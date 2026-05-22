"use client"

import { motion } from "framer-motion"
import { Platform } from "@/types"
import { PlatformConfig } from "@/features/integrations/platformService"

interface PlatformCardProps {
  config: PlatformConfig
  isConnected: boolean
  isLoading: boolean
  onToggle: (platform: Platform) => void
}

export default function PlatformCard({
  config,
  isConnected,
  isLoading,
  onToggle,
}: PlatformCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => !isLoading && onToggle(config.id)}
      className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 cursor-pointer"
      style={{
        background: isConnected ? "var(--tint)" : "var(--surface)",
        border: `1px solid ${isConnected ? "var(--primary)" : "var(--border)"}`,
        boxShadow: isConnected ? "0 0 16px rgba(124,58,237,0.15)" : "none",
        opacity: isLoading ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!isLoading) {
          e.currentTarget.style.borderColor = "var(--primary)"
          e.currentTarget.style.boxShadow = "0 0 16px rgba(124,58,237,0.2)"
        }
      }}
      onMouseLeave={(e) => {
        if (!isConnected) {
          e.currentTarget.style.borderColor = "var(--border)"
          e.currentTarget.style.boxShadow = "none"
        }
      }}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs font-mono text-white flex-shrink-0"
          style={{ background: config.color }}
        >
          {config.icon}
        </div>

        {/* Info */}
        <div>
          <div className="font-semibold text-sm" style={{ color: "var(--body)" }}>
            {config.label}
          </div>
          <div className="text-xs mt-0.5" style={{ color: "var(--secondary)" }}>
            {config.description}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {isLoading ? (
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
          <motion.div
            initial={false}
            animate={{
              scale: isConnected ? [1.2, 1] : 1,
            }}
            className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
            style={{
              background: isConnected ? "var(--primary)" : "transparent",
              borderColor: isConnected ? "var(--primary)" : "var(--border)",
            }}
          >
            {isConnected && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
