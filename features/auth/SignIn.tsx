"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { getAuthSetupError, signInWithGoogle } from "@/features/auth/authService"

export default function SignIn() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(getAuthSetupError())

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start sign in.")
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--background)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--primary)" }}
            >
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-xl tracking-tight" style={{ color: "var(--body)" }}>
              vybe
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-3 tracking-tight" style={{ color: "var(--body)" }}>
            Your internet passport
          </h1>
          <p className="text-base" style={{ color: "var(--secondary)" }}>
            Connect real accounts, generate your passport, and control what the public can see.
          </p>
        </div>

        <div className="card p-8">
          <p className="text-sm font-mono mb-6 text-center" style={{ color: "var(--secondary)" }}>
            SIGN IN TO CONTINUE
          </p>

          {error && (
            <div
              className="text-sm rounded-xl p-4 mb-4"
              style={{ color: "#FCA5A5", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}
            >
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading || Boolean(getAuthSetupError())}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--body)",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            <span className="flex-shrink-0" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
            </span>
            <span className="flex-1 text-left">{loading ? "Opening Google..." : "Continue with Google"}</span>
          </button>

          <p className="text-xs text-center mt-6" style={{ color: "var(--secondary)" }}>
            Powered by Supabase Auth. No demo account is used.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
