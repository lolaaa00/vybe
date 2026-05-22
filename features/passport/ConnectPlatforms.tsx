"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppStore } from "@/store/appStore"
import { Platform } from "@/types"
import {
  PLATFORM_CONFIG,
  simulatePlatformConnect,
} from "@/features/integrations/platformService"
import PlatformCard from "@/components/passport/PlatformCard"

export default function ConnectPlatforms() {
  const { connectedPlatforms, togglePlatform, setStep, user } = useAppStore()
  const [loadingPlatform, setLoadingPlatform] = useState<Platform | null>(null)

  const handleToggle = async (platform: Platform) => {
    if (connectedPlatforms.includes(platform)) {
      togglePlatform(platform)
      return
    }
    setLoadingPlatform(platform)
    await simulatePlatformConnect(platform)
    togglePlatform(platform)
    setLoadingPlatform(null)
  }

  const handleGenerate = () => {
    if (connectedPlatforms.length > 0) {
      setStep(3)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "var(--background)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--primary)" }}
            >
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span
              className="font-bold text-xl tracking-tight"
              style={{ color: "var(--body)" }}
            >
              vybe
            </span>
          </div>

          <div
            className="text-xs font-mono mb-3"
            style={{ color: "var(--primary)" }}
          >
            STEP 02 OF 04
          </div>
          <h1
            className="text-3xl font-bold tracking-tight mb-2"
            style={{ color: "var(--body)" }}
          >
            Connect your platforms
          </h1>
          <p style={{ color: "var(--secondary)" }} className="text-sm">
            Welcome back,{" "}
            <span style={{ color: "var(--body)" }} className="font-medium">
              {user?.name}
            </span>
            . Select the platforms to include in your passport.
          </p>
        </div>

        {/* Platform list */}
        <div className="flex flex-col gap-3 mb-8">
          {PLATFORM_CONFIG.map((config, i) => (
            <motion.div
              key={config.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
            >
              <PlatformCard
                config={config}
                isConnected={connectedPlatforms.includes(config.id)}
                isLoading={loadingPlatform === config.id}
                onToggle={handleToggle}
              />
            </motion.div>
          ))}
        </div>

        {/* Connected count */}
        <AnimatePresence>
          {connectedPlatforms.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="text-xs font-mono text-center mb-4"
              style={{ color: "var(--secondary)" }}
            >
              {connectedPlatforms.length} PLATFORM
              {connectedPlatforms.length > 1 ? "S" : ""} CONNECTED
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generate button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={connectedPlatforms.length === 0}
          className="w-full py-4 rounded-xl font-semibold text-sm transition-all duration-200"
          style={{
            background:
              connectedPlatforms.length > 0
                ? "var(--cta)"
                : "var(--surface)",
            color:
              connectedPlatforms.length > 0
                ? "white"
                : "var(--secondary)",
            border: `1px solid ${
              connectedPlatforms.length > 0
                ? "transparent"
                : "var(--border)"
            }`,
            cursor:
              connectedPlatforms.length > 0 ? "pointer" : "not-allowed",
            boxShadow:
              connectedPlatforms.length > 0
                ? "0 0 20px rgba(249,115,22,0.3)"
                : "none",
          }}
        >
          {connectedPlatforms.length === 0
            ? "Select at least one platform"
            : `Generate My Passport →`}
        </motion.button>

        {/* Back */}
        <button
          onClick={() => useAppStore.getState().setStep(1)}
          className="w-full mt-3 py-2 text-xs font-mono transition-all duration-200"
          style={{ color: "var(--secondary)", background: "none", border: "none", cursor: "pointer" }}
        >
          ← BACK TO SIGN IN
        </button>
      </motion.div>
    </div>
  )
}
