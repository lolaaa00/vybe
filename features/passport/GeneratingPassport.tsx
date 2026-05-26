"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { DashboardData } from "@/types"

const STAGES = [
  "Loading connected account data",
  "Mapping identity signals",
  "Generating passport sections",
  "Saving privacy defaults",
]

interface GeneratingPassportProps {
  onComplete: (data: DashboardData) => void
  onCancel: () => void
}

export default function GeneratingPassport({ onComplete, onCancel }: GeneratingPassportProps) {
  const [stage, setStage] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const interval = window.setInterval(() => {
      setStage((current) => Math.min(current + 1, STAGES.length - 1))
    }, 700)

    const run = async () => {
      try {
        const response = await fetch("/api/passport/generate", { method: "POST" })
        const payload = await response.json()
        if (!response.ok) throw new Error(payload.error || "Unable to generate passport.")
        if (!cancelled) onComplete(payload)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unable to generate passport.")
      } finally {
        window.clearInterval(interval)
      }
    }

    run()
    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [onComplete])

  const progress = Math.round(((stage + 1) / STAGES.length) * 100)

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--background)" }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "var(--primary)" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <path d="M14 2L16.5 9.5L24 7L19 13L26 16L18.5 17L21 24.5L14 20L7 24.5L9.5 17L2 16L9 13L4 7L11.5 9.5L14 2Z" fill="white" />
              </svg>
            </motion.div>
          </div>
          <div className="text-xs font-mono mb-3" style={{ color: "var(--primary)" }}>
            GENERATING
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: "var(--body)" }}>
            Building your passport
          </h1>
          <p className="text-sm" style={{ color: "var(--secondary)" }}>
            {error ? "Generation paused" : STAGES[stage]}
          </p>
        </div>

        <div className="card p-6 mb-6">
          {error ? (
            <div>
              <p className="text-sm mb-4" style={{ color: "#FCA5A5" }}>{error}</p>
              <button type="button" onClick={onCancel} className="w-full py-3 rounded-xl text-sm font-semibold" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--body)" }}>
                Back to dashboard
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {STAGES.map((label, index) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: index <= stage ? "var(--primary)" : "transparent", border: `1px solid ${index <= stage ? "var(--primary)" : "var(--border)"}` }}>
                    {index <= stage && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span className="text-sm" style={{ color: index <= stage ? "var(--body)" : "var(--secondary)" }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {!error && (
          <>
            <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ background: "var(--border)" }}>
              <motion.div className="h-full rounded-full" style={{ background: "var(--primary)" }} animate={{ width: `${progress}%` }} />
            </div>
            <div className="text-xs font-mono text-center mt-2" style={{ color: "var(--secondary)" }}>
              {progress}% COMPLETE
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
