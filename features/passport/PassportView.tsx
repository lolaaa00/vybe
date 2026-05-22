"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { useAppStore } from "@/store/appStore"
import { usePassportStore } from "@/store/passportStore"
import { PrivacyState } from "@/types"
import IdentityCover from "@/components/passport/IdentityCover"
import PassportSectionCard from "@/components/passport/PassportSectionCard"
import ReputationSignals from "@/components/passport/ReputationSignals"

export default function PassportView() {
  const { user, connectedPlatforms, reset: resetApp } = useAppStore()
  const { sections, signals, passportNumber, updatePrivacy, reset: resetPassport } = usePassportStore()
  const [shareToast, setShareToast] = useState(false)

  if (!user) return null

  const handleReset = () => {
    resetApp()
    resetPassport()
  }

  const handleShare = () => {
    const url = `${window.location.origin}/passport/${user.handle}`
    navigator.clipboard.writeText(url).catch(() => {})
    setShareToast(true)
    setTimeout(() => setShareToast(false), 2500)
  }

  return (
    <div
      className="min-h-screen py-10 px-4"
      style={{ background: "var(--background)" }}
    >
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "var(--primary)" }}
            >
              <span className="text-white font-bold text-xs">V</span>
            </div>
            <span className="font-bold tracking-tight" style={{ color: "var(--body)" }}>
              vybe
            </span>
          </div>
          <div className="text-xs font-mono" style={{ color: "var(--secondary)" }}>
            STEP 04 OF 04
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: "var(--body)" }}>
            Your passport is ready
          </h1>
          <p className="text-sm" style={{ color: "var(--secondary)" }}>
            {sections.length} sections generated · {signals.length} reputation signals awarded
          </p>
        </motion.div>

        {/* Identity Cover */}
        <div className="mb-4">
          <IdentityCover
            user={user}
            connectedPlatforms={connectedPlatforms}
            passportNumber={passportNumber}
          />
        </div>

        {/* Passport sections */}
        <div className="flex flex-col gap-4 mb-4">
          {sections.map((section, i) => (
            <PassportSectionCard
              key={section.id}
              section={section}
              index={i}
              onPrivacyChange={(id, val: PrivacyState) => updatePrivacy(id, val)}
            />
          ))}
        </div>

        {/* Reputation signals */}
        <div className="mb-6">
          <ReputationSignals signals={signals} />
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={handleShare}
            className="w-full py-4 rounded-xl font-semibold text-sm text-white transition-all duration-200 relative overflow-hidden"
            style={{
              background: "var(--cta)",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(249,115,22,0.3)",
            }}
          >
            {shareToast ? "Link copied to clipboard ✓" : "Share Public Passport →"}
          </button>

          <button
            onClick={handleReset}
            className="w-full py-3 rounded-xl font-medium text-sm transition-all duration-200"
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--secondary)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--primary)"
              e.currentTarget.style.color = "var(--body)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)"
              e.currentTarget.style.color = "var(--secondary)"
            }}
          >
            Reset & Start Over
          </button>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs font-mono" style={{ color: "var(--secondary)" }}>
          VYBE · INTERNET PASSPORT · 2026
        </div>
      </div>
    </div>
  )
}
