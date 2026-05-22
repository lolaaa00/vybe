"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppStore } from "@/store/appStore"
import { usePassportStore } from "@/store/passportStore"
import {
  GENERATION_STAGES,
  generatePassportSections,
  evaluateReputationSignals,
} from "@/features/passport/passportGenerator"

export default function GeneratingPassport() {
  const { connectedPlatforms, setStep } = useAppStore()
  const { setSections, setSignals } = usePassportStore()
  const [currentStage, setCurrentStage] = useState(0)
  const [completedStages, setCompletedStages] = useState<number[]>([])

  useEffect(() => {
    let stageIndex = 0

    const runStages = async () => {
      for (const stage of GENERATION_STAGES) {
        setCurrentStage(stage.id)
        await new Promise((resolve) => setTimeout(resolve, stage.duration))
        setCompletedStages((prev) => [...prev, stage.id])
        stageIndex++
      }

      const sections = generatePassportSections(connectedPlatforms)
      const signals = evaluateReputationSignals(connectedPlatforms)
      setSections(sections)
      setSignals(signals)

      await new Promise((resolve) => setTimeout(resolve, 400))
      setStep(4)
    }

    runStages()
  }, [])

  const totalDuration = GENERATION_STAGES.reduce((a, b) => a + b.duration, 0)
  const completedDuration = GENERATION_STAGES.filter((s) =>
    completedStages.includes(s.id)
  ).reduce((a, b) => a + b.duration, 0)
  const progress = Math.round((completedDuration / totalDuration) * 100)

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--background)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "var(--primary)" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path
                  d="M14 2L16.5 9.5L24 7L19 13L26 16L18.5 17L21 24.5L14 20L7 24.5L9.5 17L2 16L9 13L4 7L11.5 9.5L14 2Z"
                  fill="white"
                />
              </svg>
            </motion.div>
          </div>
          <div
            className="text-xs font-mono mb-3"
            style={{ color: "var(--primary)" }}
          >
            STEP 03 OF 04
          </div>
          <h1
            className="text-2xl font-bold tracking-tight mb-2"
            style={{ color: "var(--body)" }}
          >
            Building your passport
          </h1>
          <p className="text-sm" style={{ color: "var(--secondary)" }}>
            Analysing {connectedPlatforms.length} connected platform
            {connectedPlatforms.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Stages */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col gap-4">
            {GENERATION_STAGES.map((stage) => {
              const isCompleted = completedStages.includes(stage.id)
              const isActive = currentStage === stage.id && !isCompleted

              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * stage.id }}
                  className="flex items-center gap-3"
                >
                  {/* Status icon */}
                  <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: "var(--primary)" }}
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path
                            d="M2 5l2.5 2.5L8 3"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </motion.div>
                    ) : isActive ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 rounded-full"
                        style={{
                          borderColor: "var(--primary)",
                          borderTopColor: "transparent",
                        }}
                      />
                    ) : (
                      <div
                        className="w-5 h-5 rounded-full border-2"
                        style={{ borderColor: "var(--border)" }}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className="text-sm font-medium transition-all duration-300"
                    style={{
                      color: isCompleted
                        ? "var(--body)"
                        : isActive
                        ? "var(--primary)"
                        : "var(--secondary)",
                    }}
                  >
                    {stage.label}
                  </span>

                  {/* Active pulse */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full ml-auto"
                        style={{ background: "var(--primary)" }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="w-full rounded-full h-1.5 overflow-hidden"
          style={{ background: "var(--border)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--primary)" }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <div
          className="text-xs font-mono text-center mt-2"
          style={{ color: "var(--secondary)" }}
        >
          {progress}% COMPLETE
        </div>
      </motion.div>
    </div>
  )
}
