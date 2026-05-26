"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ConnectedAccountSummary, Profile, Platform } from "@/types"
import {
  connectPlatform,
  disconnectPlatform,
  getConnectedAccount,
  PLATFORM_CONFIG,
} from "@/features/integrations/platformService"
import PlatformCard from "@/components/passport/PlatformCard"

interface ConnectPlatformsProps {
  profile: Profile
  connectedAccounts: ConnectedAccountSummary[]
  hasSections: boolean
  onGenerate: () => void
  onRefresh: () => void
}

export default function ConnectPlatforms({
  profile,
  connectedAccounts,
  hasSections,
  onGenerate,
  onRefresh,
}: ConnectPlatformsProps) {
  const [busyPlatform, setBusyPlatform] = useState<Platform | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = (platform: Platform) => {
    setBusyPlatform(platform)
    connectPlatform(platform)
  }

  const handleDisconnect = async (platform: Platform) => {
    const confirmed = window.confirm(
      "Disconnecting this platform stops future refreshes. Existing generated sections remain until you delete or regenerate them."
    )
    if (!confirmed) return

    setBusyPlatform(platform)
    setError(null)
    try {
      await disconnectPlatform(platform)
      onRefresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to disconnect platform.")
    } finally {
      setBusyPlatform(null)
    }
  }

  return (
    <div className="min-h-screen px-4 py-24" style={{ background: "var(--background)" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg mx-auto"
      >
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--primary)" }}>
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-xl tracking-tight" style={{ color: "var(--body)" }}>
              vybe
            </span>
          </div>

          <div className="text-xs font-mono mb-3" style={{ color: "var(--primary)" }}>
            DASHBOARD
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: "var(--body)" }}>
            Connect your accounts
          </h1>
          <p style={{ color: "var(--secondary)" }} className="text-sm">
            Signed in as{" "}
            <span style={{ color: "var(--body)" }} className="font-medium">
              @{profile.handle}
            </span>
            . Connect a platform to start building your Vybe passport.
          </p>
        </div>

        {error && (
          <div className="rounded-xl p-4 mb-4 text-sm" style={{ color: "#FCA5A5", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 mb-8">
          {PLATFORM_CONFIG.map((config) => (
            <PlatformCard
              key={config.id}
              config={config}
              account={getConnectedAccount(connectedAccounts, config.id)}
              isBusy={busyPlatform === config.id}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          ))}
        </div>

        <div className="card p-5 mb-4">
          <div className="font-bold text-sm mb-1" style={{ color: "var(--body)" }}>
            {connectedAccounts.length === 0
              ? "Connect GitHub, Spotify, X, or Discord to start building your Vybe passport."
              : hasSections
              ? "Your saved passport is ready. Regenerate any time after account changes."
              : "Your accounts are connected. Generate your passport."}
          </div>
          <p className="text-xs" style={{ color: "var(--secondary)" }}>
            Passport sections are generated from the real platform data saved in your account.
          </p>
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={connectedAccounts.length === 0}
          className="w-full py-4 rounded-xl font-semibold text-sm transition-all duration-200"
          style={{
            background: connectedAccounts.length > 0 ? "var(--cta)" : "var(--surface)",
            color: connectedAccounts.length > 0 ? "white" : "var(--secondary)",
            border: `1px solid ${connectedAccounts.length > 0 ? "transparent" : "var(--border)"}`,
            cursor: connectedAccounts.length > 0 ? "pointer" : "not-allowed",
            boxShadow: connectedAccounts.length > 0 ? "0 0 20px rgba(249,115,22,0.3)" : "none",
          }}
        >
          {hasSections ? "Regenerate Passport" : "Generate Passport"}
        </button>
      </motion.div>
    </div>
  )
}
