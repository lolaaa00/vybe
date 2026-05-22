"use client"

import { motion } from "framer-motion"
import { User, Platform } from "@/types"
import { PLATFORM_CONFIG } from "@/features/integrations/platformService"

interface IdentityCoverProps {
  user: User
  connectedPlatforms: Platform[]
  passportNumber: string
}

export default function IdentityCover({
  user,
  connectedPlatforms,
  passportNumber,
}: IdentityCoverProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, var(--primary) 0%, #4C1D95 100%)",
        border: "1px solid var(--primary)",
      }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Passport label */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-white bg-opacity-20 flex items-center justify-center">
            <span className="text-white font-bold text-xs">V</span>
          </div>
          <span className="text-white text-xs font-bold tracking-widest opacity-80">
            VYBE
          </span>
        </div>
        <div className="text-right">
          <div className="text-white text-xs font-mono opacity-60">
            PASSPORT NO.
          </div>
          <div className="text-white text-xs font-mono font-bold">
            {passportNumber}
          </div>
        </div>
      </div>

      {/* Avatar and name */}
      <div className="flex items-center gap-4 relative z-10 mb-6">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
        >
          {user.avatar}
        </div>
        <div>
          <div className="text-white font-bold text-xl tracking-tight">
            {user.name}
          </div>
          <div className="text-white text-sm opacity-70 font-mono">
            @{user.handle}
          </div>
        </div>
      </div>

      {/* Connected platforms */}
      <div className="flex flex-wrap gap-2 relative z-10">
        {connectedPlatforms.map((platformId) => {
          const config = PLATFORM_CONFIG.find((p) => p.id === platformId)
          if (!config) return null
          return (
            <div
              key={platformId}
              className="px-3 py-1 rounded-full text-xs font-mono font-medium"
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              {config.label}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
