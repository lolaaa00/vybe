"use client"

import { motion } from "framer-motion"
import { ConnectedAccountSummary, Profile } from "@/types"
import { PLATFORM_CONFIG } from "@/features/integrations/platformService"

interface IdentityCoverProps {
  profile: Profile
  connectedAccounts: ConnectedAccountSummary[]
}

function initialsFor(profile: Profile) {
  const label = profile.display_name || profile.handle || profile.email || "Vybe"
  return label
    .split(/[\s@._-]+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export default function IdentityCover({ profile, connectedAccounts }: IdentityCoverProps) {
  const displayName = profile.display_name || profile.handle || "Vybe user"

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
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

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
            HANDLE
          </div>
          <div className="text-white text-xs font-mono font-bold">
            @{profile.handle}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 relative z-10 mb-6">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
        >
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt={`${displayName} avatar`} className="w-full h-full object-cover" />
          ) : (
            initialsFor(profile)
          )}
        </div>
        <div>
          <div className="text-white font-bold text-xl tracking-tight">
            {displayName}
          </div>
          <div className="text-white text-sm opacity-70 font-mono">
            @{profile.handle}
          </div>
          {profile.bio && <p className="text-white text-sm opacity-80 mt-1">{profile.bio}</p>}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 relative z-10">
        {connectedAccounts.map((account) => {
          const config = PLATFORM_CONFIG.find((p) => p.id === account.platform)
          if (!config) return null
          return (
            <div
              key={account.id}
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
