"use client"

import { motion } from "framer-motion"
import { PrivacyState } from "@/types"

const PRIVACY_CYCLE: PrivacyState[] = ["public", "selective", "private"]

const PRIVACY_CONFIG = {
  public: { label: "Public", color: "#10B981", bg: "rgba(16,185,129,0.1)" },
  selective: { label: "Selective", color: "#F97316", bg: "rgba(249,115,22,0.1)" },
  private: { label: "Private", color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
}

interface PrivacyToggleProps {
  value: PrivacyState
  onChange: (val: PrivacyState) => void
}

export default function PrivacyToggle({ value, onChange }: PrivacyToggleProps) {
  const config = PRIVACY_CONFIG[value]

  const handleClick = () => {
    const idx = PRIVACY_CYCLE.indexOf(value)
    const next = PRIVACY_CYCLE[(idx + 1) % PRIVACY_CYCLE.length]
    onChange(next)
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 flex items-center gap-1.5"
      style={{
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.color}40`,
        cursor: "pointer",
      }}
    >
      <div
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: config.color }}
      />
      {config.label}
    </motion.button>
  )
}
