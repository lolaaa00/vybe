"use client"

import { FormEvent, useState } from "react"
import { motion } from "framer-motion"
import { Profile } from "@/types"
import { normalizeHandle, validateHandle } from "@/lib/validation/handle"

interface HandleSetupProps {
  profile: Profile
  onSaved: () => void
}

export default function HandleSetup({ profile, onSaved }: HandleSetupProps) {
  const [handle, setHandle] = useState(profile.handle || "")
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const validated = validateHandle(handle)
    if (!validated.ok) {
      setError(validated.error)
      return
    }

    setSaving(true)
    setError(null)
    try {
      const response = await fetch("/api/profile/handle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: validated.handle }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || "Unable to save handle.")
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save handle.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--background)" }}>
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md card p-8"
      >
        <div className="text-xs font-mono mb-3" style={{ color: "var(--primary)" }}>
          CLAIM YOUR HANDLE
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--body)" }}>
          Choose your Vybe handle
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--secondary)" }}>
          Your public passport will live at /passport/your-handle.
        </p>

        <label className="block text-xs font-mono mb-2" style={{ color: "var(--secondary)" }} htmlFor="handle">
          HANDLE
        </label>
        <div className="flex items-center rounded-xl px-4 py-3 mb-3" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
          <span className="text-sm font-mono" style={{ color: "var(--secondary)" }}>@</span>
          <input
            id="handle"
            value={handle}
            onChange={(event) => setHandle(normalizeHandle(event.target.value))}
            className="w-full bg-transparent outline-none ml-1 text-sm"
            style={{ color: "var(--body)" }}
            placeholder="your-handle"
            autoComplete="off"
          />
        </div>
        {error && <p className="text-sm mb-4" style={{ color: "#FCA5A5" }}>{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 rounded-xl font-semibold text-sm text-white transition-all duration-200"
          style={{ background: "var(--cta)", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.75 : 1 }}
        >
          {saving ? "Saving..." : "Save handle"}
        </button>
      </motion.form>
    </div>
  )
}
