"use client"

import { motion } from "framer-motion"
import { ConnectedAccountSummary, Platform } from "@/types"
import { PlatformConfig } from "@/features/integrations/platformService"

interface PlatformCardProps {
  config: PlatformConfig
  account: ConnectedAccountSummary | null
  isBusy: boolean
  onConnect: (platform: Platform) => void
  onDisconnect: (platform: Platform) => void
}

export default function PlatformCard({
  config,
  account,
  isBusy,
  onConnect,
  onDisconnect,
}: PlatformCardProps) {
  const isConnected = Boolean(account)

  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div
        className="flex items-center justify-between gap-4 p-4 rounded-xl transition-all duration-200"
        style={{
          background: isConnected ? "var(--tint)" : "var(--surface)",
          border: `1px solid ${isConnected ? "var(--primary)" : "var(--border)"}`,
          boxShadow: isConnected ? "0 0 16px rgba(124,58,237,0.15)" : "none",
        }}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs font-mono text-white flex-shrink-0"
            style={{ background: config.color }}
            aria-hidden="true"
          >
            {config.icon}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm" style={{ color: "var(--body)" }}>
              {config.label}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--secondary)" }}>
              {isConnected
                ? account?.username || account?.display_name || "Connected"
                : config.description}
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={isBusy}
          onClick={() => (isConnected ? onDisconnect(config.id) : onConnect(config.id))}
          className="px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all duration-200 flex-shrink-0"
          style={{
            background: isConnected ? "transparent" : "var(--primary)",
            border: isConnected ? "1px solid var(--primary)" : "1px solid var(--primary)",
            color: isConnected ? "var(--primary)" : "white",
            cursor: isBusy ? "not-allowed" : "pointer",
            opacity: isBusy ? 0.65 : 1,
          }}
          aria-label={`${isConnected ? "Disconnect" : "Connect"} ${config.label}`}
        >
          {isBusy ? "WAIT" : isConnected ? "DISCONNECT" : "CONNECT"}
        </button>
      </div>
    </motion.div>
  )
}
