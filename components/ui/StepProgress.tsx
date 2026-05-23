"use client"

import { motion } from "framer-motion"
import { useAppStore } from "@/store/appStore"

const STEPS = [
  { id: 1, label: "Sign In" },
  { id: 2, label: "Connect" },
  { id: 3, label: "Generate" },
  { id: 4, label: "Passport" },
]

export default function StepProgress() {
  const { step } = useAppStore()

  return (
    <div className="fixed top-0 left-0 right-0 z-40 px-4 pt-3 pb-2"
      style={{ background: "var(--background)", borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-lg mx-auto flex items-center justify-between">
        {STEPS.map((s, i) => {
          const isComplete = step > s.id
          const isActive = step === s.id
          return (
            <div key={s.id} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <motion.div
                  animate={{
                    background: isComplete
                      ? "var(--primary)"
                      : isActive
                      ? "var(--primary)"
                      : "var(--border)",
                    scale: isActive ? 1.1 : 1,
                  }}
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {isComplete ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span className="text-white text-xs font-bold">{s.id}</span>
                  )}
                </motion.div>
                <span className="text-xs font-mono hidden sm:block"
                  style={{ color: isActive ? "var(--primary)" : isComplete ? "var(--body)" : "var(--secondary)" }}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <motion.div
                  className="w-8 sm:w-16 h-px mx-1"
                  animate={{ background: isComplete ? "var(--primary)" : "var(--border)" }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
