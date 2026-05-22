"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useAppStore } from "@/store/appStore"
import { simulateLogin } from "@/features/auth/authService"

type LoginMethod = "google" | "apple" | "wallet"

const LOGIN_OPTIONS = [
  {
    method: "google" as LoginMethod,
    label: "Continue with Google",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
        <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
      </svg>
    ),
  },
  {
    method: "apple" as LoginMethod,
    label: "Continue with Apple",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
        <path d="M13.173 9.545c-.022-2.046 1.672-3.033 1.748-3.082-0.953-1.393-2.435-1.584-2.964-1.603-1.263-.128-2.468.744-3.106.744-.638 0-1.625-.727-2.672-.707-1.374.02-2.644.8-3.352 2.033-1.429 2.479-.366 6.151 1.027 8.163.681.982 1.492 2.085 2.557 2.046 1.028-.04 1.416-.662 2.659-.662 1.244 0 1.593.662 2.678.641 1.103-.02 1.8-.999 2.475-1.985.782-1.138 1.103-2.241 1.122-2.298-.024-.011-2.15-.825-2.172-3.29z"/>
        <path d="M11.124 3.299c.565-.685.948-1.635.843-2.582-.815.033-1.801.543-2.385 1.228-.524.607-.982 1.577-.859 2.507.909.07 1.836-.461 2.401-1.153z"/>
      </svg>
    ),
  },
  {
    method: "wallet" as LoginMethod,
    label: "Continue with Wallet",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="4" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M1 7h16" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="13.5" cy="11" r="1.5" fill="currentColor"/>
      </svg>
    ),
  },
]

export default function SignIn() {
  const [loading, setLoading] = useState<LoginMethod | null>(null)
  const { setUser, setStep } = useAppStore()

  const handleLogin = async (method: LoginMethod) => {
    setLoading(method)
    try {
      const user = await simulateLogin(method)
      setUser(user)
      setStep(2)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--background)" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--primary)" }}>
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
            One place for your taste, work, communities, and reputation.
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="card p-8"
        >
          <p className="text-sm font-mono mb-6 text-center" style={{ color: "var(--secondary)" }}>
            SIGN IN TO CONTINUE
          </p>

          <div className="flex flex-col gap-3">
            {LOGIN_OPTIONS.map((option, i) => (
              <motion.button
                key={option.method}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
                onClick={() => handleLogin(option.method)}
                disabled={loading !== null}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--body)",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading && loading !== option.method ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.borderColor = "var(--primary)"
                    e.currentTarget.style.boxShadow = "0 0 16px rgba(124,58,237,0.2)"
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <span className="flex-shrink-0">{option.icon}</span>
                <span className="flex-1 text-left">{option.label}</span>
                {loading === option.method && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 rounded-full flex-shrink-0"
                    style={{
                      borderColor: "var(--primary)",
                      borderTopColor: "transparent",
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          <p className="text-xs text-center mt-6" style={{ color: "var(--secondary)" }}>
            Simulated auth — no real data is collected
          </p>
        </motion.div>

        {/* Bottom label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs font-mono mt-6"
          style={{ color: "var(--secondary)" }}
        >
          VYBE · INTERNET PASSPORT · 2026
        </motion.p>
      </motion.div>
    </div>
  )
}
