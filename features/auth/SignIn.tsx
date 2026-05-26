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
      className="min-h-screen flex items-center justify-center px-6 py-10"
      style={{ background: "var(--background)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <span className="vybe-logo-frame" aria-label="Rialo logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/rialo-logo.jpg"
              alt=""
              className="vybe-logo-mark vybe-logo-mark-light"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/rialo-logo2.jpeg"
              alt=""
              className="vybe-logo-mark vybe-logo-mark-dark"
            />
          </span>
          <h1 className="text-5xl font-black mb-4 tracking-normal" style={{ color: "var(--body)" }}>
            Vybe
          </h1>
          <p className="text-xl" style={{ color: "var(--secondary)" }}>
            Your internet passport
          </p>
        </div>

        <div className="card vybe-auth-card p-8">
          <p className="text-sm font-mono mb-7 text-center tracking-[0.28em]" style={{ color: "var(--secondary)" }}>
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
            className="vybe-auth-button w-full flex items-center gap-4 px-6 py-4 font-semibold text-lg transition-all duration-200"
            style={{
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

          <div className="mt-4 space-y-4">
            <button
              type="button"
              disabled
              className="vybe-auth-button w-full flex items-center gap-4 px-6 py-4 font-semibold text-lg"
              style={{ color: "var(--body)", opacity: 0.7, cursor: "not-allowed" }}
              aria-label="Continue with Apple unavailable"
            >
              <span aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 18 18" fill="currentColor">
                  <path d="M13.173 9.545c-.022-2.046 1.672-3.033 1.748-3.082-.953-1.393-2.435-1.584-2.964-1.603-1.263-.128-2.468.744-3.106.744-.638 0-1.625-.727-2.672-.707-1.374.02-2.644.8-3.352 2.033-1.429 2.479-.366 6.151 1.027 8.163.681.982 1.492 2.085 2.557 2.046 1.028-.04 1.416-.662 2.659-.662 1.244 0 1.593.662 2.678.641 1.103-.02 1.8-.999 2.475-1.985.782-1.138 1.103-2.241 1.122-2.298-.024-.011-2.15-.825-2.172-3.29z"/>
                  <path d="M11.124 3.299c.565-.685.948-1.635.843-2.582-.815.033-1.801.543-2.385 1.228-.524.607-.982 1.577-.859 2.507.909.07 1.836-.461 2.401-1.153z"/>
                </svg>
              </span>
              <span className="flex-1 text-left">Continue with Apple</span>
            </button>

            <button
              type="button"
              disabled
              className="vybe-auth-button w-full flex items-center gap-4 px-6 py-4 font-semibold text-lg"
              style={{ color: "var(--body)", opacity: 0.7, cursor: "not-allowed" }}
              aria-label="Continue with Wallet unavailable"
            >
              <span aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                  <rect x="1" y="4" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M1 7h16" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="13.5" cy="11" r="1.5" fill="currentColor"/>
                </svg>
              </span>
              <span className="flex-1 text-left">Continue with Wallet</span>
            </button>
          </div>
        </div>

        <p className="text-center text-sm font-mono mt-8 tracking-[0.22em]" style={{ color: "var(--secondary)" }}>
          VYBE &middot; INTERNET PASSPORT &middot; 2026
        </p>
      </motion.div>
    </div>
  )
}
