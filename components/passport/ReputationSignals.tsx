"use client"

import { motion } from "framer-motion"
import { ReputationSignal } from "@/types"

const SIGNAL_ICONS: Record<ReputationSignal, string> = {
  "Verified Builder": "⚡",
  "Early Community Member": "🌱",
  "Consistent Contributor": "🔁",
  "Trusted Participant": "🛡️",
  "Culture Curator": "🎨",
  "Active Learner": "📚",
  "High-Signal Creator": "📡",
}

export default function ReputationSignals({ signals }: { signals: ReputationSignal[] }) {
  if (signals.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="card p-5"
    >
      <div className="text-xs font-mono mb-4" style={{ color: "var(--primary)" }}>
        REPUTATION SIGNALS
      </div>
      <div className="flex flex-wrap gap-2">
        {signals.map((signal, i) => (
          <motion.div
            key={signal}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.07 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
            style={{
              background: "var(--tint)",
              color: "var(--primary)",
              border: "1px solid var(--border)",
            }}
          >
            <span>{SIGNAL_ICONS[signal]}</span>
            {signal}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
