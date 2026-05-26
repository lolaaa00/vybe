"use client"

import { motion } from "framer-motion"
import { VisibilityState } from "@/types"

const VISIBILITY_CYCLE: VisibilityState[] = ["public", "private", "hidden"]

const VISIBILITY_CONFIG = {
  public: { label: "Public", color: "#10B981", bg: "rgba(16,185,129,0.1)" },
  private: { label: "Private", color: "#F97316", bg: "rgba(249,115,22,0.1)" },
  hidden: { label: "Hidden", color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
}

interface PrivacyToggleProps {
  value: VisibilityState
  disabled?: boolean
  onChange: (val: VisibilityState) => void
}

export default function PrivacyToggle({ value, disabled, onChange }: PrivacyToggleProps) {
  const config = VISIBILITY_CONFIG[value]

  const handleClick = () => {
    const idx = VISIBILITY_CYCLE.indexOf(value)
    const next = VISIBILITY_CYCLE[(idx + 1) % VISIBILITY_CYCLE.length]
    onChange(next)
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      disabled={disabled}
      onClick={handleClick}
      className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 flex items-center gap-1.5"
      style={{
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.color}40`,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.65 : 1,
      }}
      aria-label={`Section visibility is ${config.label}. Click to change.`}
    >
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: config.color }} />
      {config.label}
    </motion.button>
  )
}
