"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ConnectedAccountSummary, PassportSection, Platform, Profile, PublicPassport, VisibilityState } from "@/types"
import IdentityCover from "@/components/passport/IdentityCover"
import PassportSectionCard from "@/components/passport/PassportSectionCard"
import PlatformCard from "@/components/passport/PlatformCard"
import {
  connectPlatform,
  disconnectPlatform,
  getConnectedAccount,
  PLATFORM_CONFIG,
} from "@/features/integrations/platformService"

interface PassportViewProps {
  profile: Profile
  connectedAccounts: ConnectedAccountSummary[]
  sections: PassportSection[]
  publicPassport: PublicPassport | null
  onRefresh: () => void
  onRegenerate: () => void
  onSignOut: () => void
}

export default function PassportView({
  profile,
  connectedAccounts,
  sections,
  publicPassport,
  onRefresh,
  onRegenerate,
  onSignOut,
}: PassportViewProps) {
  const [busySection, setBusySection] = useState<string | null>(null)
  const [busyPlatform, setBusyPlatform] = useState<Platform | null>(null)
  const [busyPublic, setBusyPublic] = useState(false)
  const [shareToast, setShareToast] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const publicPath = profile.handle ? `/passport/${profile.handle}` : ""
  const isPublic = publicPassport?.is_public ?? false

  const updateVisibility = async (sectionId: string, visibility: VisibilityState) => {
    setBusySection(sectionId)
    setError(null)
    try {
      const response = await fetch("/api/passport/visibility", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId, visibility }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || "Unable to update visibility.")
      onRefresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update visibility.")
    } finally {
      setBusySection(null)
    }
  }

  const deleteSection = async (sectionId: string) => {
    const confirmed = window.confirm("Delete this passport section? You can regenerate it later from connected account data.")
    if (!confirmed) return

    setBusySection(sectionId)
    setError(null)
    try {
      const response = await fetch("/api/passport/section", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || "Unable to delete section.")
      onRefresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete section.")
    } finally {
      setBusySection(null)
    }
  }

  const togglePublic = async () => {
    setBusyPublic(true)
    setError(null)
    try {
      const response = await fetch("/api/passport/public-toggle", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !isPublic }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || "Unable to update public sharing.")
      onRefresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update public sharing.")
    } finally {
      setBusyPublic(false)
    }
  }

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

  const handleShare = () => {
    if (!profile.handle) return
    const publicUrl = `${window.location.origin}/passport/${profile.handle}`
    navigator.clipboard.writeText(publicUrl).catch(() => {})
    setShareToast(true)
    window.setTimeout(() => setShareToast(false), 2500)
  }

  return (
    <div className="min-h-screen py-24 px-4" style={{ background: "var(--background)" }}>
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--primary)" }}>
              <span className="text-white font-bold text-xs">V</span>
            </div>
            <span className="font-bold tracking-tight" style={{ color: "var(--body)" }}>
              vybe
            </span>
          </div>
          <button type="button" onClick={onSignOut} className="text-xs font-mono" style={{ color: "var(--secondary)", background: "none", border: "none", cursor: "pointer" }}>
            SIGN OUT
          </button>
        </motion.div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: "var(--body)" }}>
            Your internet passport
          </h1>
          <p className="text-sm" style={{ color: "var(--secondary)" }}>
            {sections.length} saved section{sections.length === 1 ? "" : "s"} from {connectedAccounts.length} connected account{connectedAccounts.length === 1 ? "" : "s"}.
          </p>
        </div>

        {error && (
          <div className="rounded-xl p-4 mb-4 text-sm" style={{ color: "#FCA5A5", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
            {error}
          </div>
        )}

        <div className="mb-4">
          <IdentityCover profile={profile} connectedAccounts={connectedAccounts} />
        </div>

        <div className="card p-5 mb-4">
          <div className="font-bold text-sm mb-3" style={{ color: "var(--body)" }}>
            Connected accounts
          </div>
          <div className="flex flex-col gap-3">
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
        </div>

        <div className="card p-5 mb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-bold text-sm" style={{ color: "var(--body)" }}>
                Public passport
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--secondary)" }}>
                {isPublic ? publicPath : "Enable sharing to publish your public link."}
              </div>
            </div>
            <button
              type="button"
              disabled={busyPublic}
              onClick={togglePublic}
              className="px-3 py-2 rounded-lg text-xs font-mono font-semibold"
              style={{
                background: isPublic ? "var(--tint)" : "var(--primary)",
                color: isPublic ? "var(--primary)" : "white",
                border: "1px solid var(--primary)",
                cursor: busyPublic ? "not-allowed" : "pointer",
              }}
            >
              {isPublic ? "DISABLE" : "ENABLE"}
            </button>
          </div>
          <button
            type="button"
            disabled={!isPublic}
            onClick={handleShare}
            className="w-full mt-4 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200"
            style={{ background: isPublic ? "var(--cta)" : "var(--surface)", color: isPublic ? "white" : "var(--secondary)", border: `1px solid ${isPublic ? "transparent" : "var(--border)"}`, cursor: isPublic ? "pointer" : "not-allowed" }}
          >
            {shareToast ? "Link copied to clipboard" : "Copy public link"}
          </button>
        </div>

        <div className="flex flex-col gap-4 mb-4">
          {sections.map((section, i) => (
            <PassportSectionCard
              key={section.id}
              section={section}
              index={i}
              isBusy={busySection === section.id}
              onVisibilityChange={updateVisibility}
              onDelete={deleteSection}
            />
          ))}
        </div>

        <button type="button" onClick={onRegenerate} className="w-full py-4 rounded-xl font-semibold text-sm text-white transition-all duration-200" style={{ background: "var(--cta)", boxShadow: "0 0 20px rgba(249,115,22,0.3)" }}>
          Regenerate passport
        </button>
      </div>
    </div>
  )
}
