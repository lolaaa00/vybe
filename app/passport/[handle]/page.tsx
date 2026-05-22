"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { PublicPassportData, getPublicPassport } from "@/features/sharing/publicPassportService"
import IdentityCover from "@/components/passport/IdentityCover"
import ReputationSignals from "@/components/passport/ReputationSignals"
import { PLATFORM_CONFIG } from "@/features/integrations/platformService"
import { PassportSection } from "@/types"

function ReadOnlySectionCard({ section, index }: { section: PassportSection; index: number }) {
  const isPrivate = section.privacy === "private"

  const privacyConfig = {
    public: { label: "Public", color: "#10B981", bg: "rgba(16,185,129,0.1)" },
    selective: { label: "Selective", color: "#F97316", bg: "rgba(249,115,22,0.1)" },
    private: { label: "Private", color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
  }
  const pc = privacyConfig[section.privacy]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs font-mono mb-1" style={{ color: "var(--primary)" }}>
            SECTION 0{index + 2}
          </div>
          <div className="font-bold text-base" style={{ color: "var(--body)" }}>
            {section.title}
          </div>
        </div>
        <div
          className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5"
          style={{ background: pc.bg, color: pc.color, border: `1px solid ${pc.color}40` }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: pc.color }} />
          {pc.label}
        </div>
      </div>

      {isPrivate ? (
        <div
          className="flex items-center gap-3 p-4 rounded-xl"
          style={{ background: "var(--background)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <span className="text-sm" style={{ color: "var(--secondary)" }}>
            This section is private.
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          {section.type === "taste" && (
            <>
              <div className="flex flex-wrap gap-2">
                {(section.data.topArtists as string[]).map((a) => (
                  <span key={a} className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: "var(--tint)", color: "var(--primary)" }}>{a}</span>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Minutes", value: (section.data.minutesListened as number).toLocaleString() },
                  { label: "Genres", value: (section.data.topGenres as string[]).length },
                  { label: "Mood", value: "Reflective" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "var(--background)" }}>
                    <div className="font-bold text-sm" style={{ color: "var(--body)" }}>{s.value}</div>
                    <div className="text-xs font-mono mt-0.5" style={{ color: "var(--secondary)" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          {section.type === "builder" && (
            <>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Commits", value: (section.data.commits as number).toLocaleString() },
                  { label: "Repos", value: section.data.repos as number },
                  { label: "Stars", value: section.data.stars as number },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "var(--background)" }}>
                    <div className="font-bold text-lg" style={{ color: "var(--body)" }}>{s.value}</div>
                    <div className="text-xs font-mono mt-0.5" style={{ color: "var(--secondary)" }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {(section.data.topLangs as string[]).map((l) => (
                  <span key={l} className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: "var(--tint)", color: "var(--primary)" }}>{l}</span>
                ))}
              </div>
            </>
          )}
          {section.type === "community" && (
            <>
              <div className="flex flex-wrap gap-2">
                {(section.data.servers as string[]).map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: "var(--tint)", color: "var(--primary)" }}>{s}</span>
                ))}
              </div>
              <div className="text-xs font-mono" style={{ color: "var(--secondary)" }}>
                ROLES: {(section.data.roles as string[]).join(" · ")}
              </div>
            </>
          )}
          {section.type === "curiosity" && (
            <>
              <div className="flex flex-wrap gap-2">
                {(section.data.topics as string[]).map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: "var(--tint)", color: "var(--primary)" }}>#{t}</span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Followers", value: (section.data.followers as number).toLocaleString() },
                  { label: "Posts", value: (section.data.posts as number).toLocaleString() },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "var(--background)" }}>
                    <div className="font-bold text-sm" style={{ color: "var(--body)" }}>{s.value}</div>
                    <div className="text-xs font-mono mt-0.5" style={{ color: "var(--secondary)" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          {section.type === "vault" && (
            <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "var(--background)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <span className="text-sm" style={{ color: "var(--secondary)" }}>
                Private vault — not publicly visible.
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default function PublicPassportPage() {
  const params = useParams()
  const handle = params.handle as string
  const [passport, setPassport] = useState<PublicPassportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark")
    getPublicPassport(handle).then((data) => {
      if (data) {
        setPassport(data)
      } else {
        setNotFound(true)
      }
      setLoading(false)
    })
  }, [handle])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--background)" }}>
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 rounded-full mx-auto mb-4"
            style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }}
          />
          <div className="text-xs font-mono" style={{ color: "var(--secondary)" }}>
            LOADING PASSPORT...
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !passport) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--background)" }}>
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <div className="font-bold text-xl mb-2" style={{ color: "var(--body)" }}>
            Passport not found
          </div>
          <div className="text-sm mb-6" style={{ color: "var(--secondary)" }}>
            No passport found for @{handle}
          </div>
          <a href="/" className="text-xs font-mono" style={{ color: "var(--primary)" }}>
            ← Create your passport
          </a>
        </div>
      </div>
    )
  }

  const publicSections = passport.sections.filter((s) => s.privacy !== "private")

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "var(--background)" }}>
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "var(--primary)" }}>
              <span className="text-white font-bold text-xs">V</span>
            </div>
            <span className="font-bold tracking-tight" style={{ color: "var(--body)" }}>vybe</span>
          </div>
          <div className="text-xs font-mono px-3 py-1 rounded-full"
            style={{ background: "var(--tint)", color: "var(--primary)" }}>
            PUBLIC PASSPORT
          </div>
        </motion.div>

        {/* Cover */}
        <div className="mb-4">
          <IdentityCover
            user={passport.user}
            connectedPlatforms={passport.connectedPlatforms}
            passportNumber={passport.passportNumber}
          />
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-4 mb-4">
          {publicSections.map((section, i) => (
            <ReadOnlySectionCard key={section.id} section={section} index={i} />
          ))}
        </div>

        {/* Signals */}
        <div className="mb-6">
          <ReputationSignals signals={passport.signals} />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <a href="/"
            className="inline-block w-full py-4 rounded-xl font-semibold text-sm text-white text-center transition-all duration-200"
            style={{
              background: "var(--cta)",
              boxShadow: "0 0 20px rgba(249,115,22,0.3)",
            }}
          >
            Create your own Vybe passport →
          </a>
          <div className="text-xs font-mono mt-4" style={{ color: "var(--secondary)" }}>
            VYBE · INTERNET PASSPORT · 2026
          </div>
        </motion.div>
      </div>
    </div>
  )
}
