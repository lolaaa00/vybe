"use client"

import { motion } from "framer-motion"
import { PassportSection, VisibilityState } from "@/types"
import PrivacyToggle from "@/components/passport/PrivacyToggle"

interface SectionProps {
  section: PassportSection
  index: number
  isBusy?: boolean
  onVisibilityChange: (id: string, val: VisibilityState) => void
  onDelete: (id: string) => void
}

function StatGrid({ stats }: { stats: Record<string, unknown> }) {
  const entries = Object.entries(stats).slice(0, 4)
  if (entries.length === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {entries.map(([key, value]) => (
        <div key={key} className="rounded-xl p-3 text-center" style={{ background: "var(--background)" }}>
          <div className="font-bold text-sm" style={{ color: "var(--body)" }}>
            {typeof value === "number" ? value.toLocaleString() : String(value)}
          </div>
          <div className="text-xs font-mono mt-0.5 capitalize" style={{ color: "var(--secondary)" }}>
            {key.replace(/([A-Z])/g, " $1")}
          </div>
        </div>
      ))}
    </div>
  )
}

function Tags({ section }: { section: PassportSection }) {
  const tags = [
    ...((section.data_json.languages || []) as string[]),
    ...((section.data_json.tasteTags || []) as string[]),
    ...((section.data_json.socialTags || []) as string[]),
    ...((section.data_json.communityTags || []) as string[]),
    ...((section.data_json.badges || []) as string[]),
  ].slice(0, 10)

  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "var(--tint)", color: "var(--primary)" }}>
          {tag}
        </span>
      ))}
    </div>
  )
}

function SourceDetails({ section }: { section: PassportSection }) {
  const topRepos = (section.data_json.topRepos || []) as Array<Record<string, unknown>>
  const topArtists = (section.data_json.topArtists || []) as Array<Record<string, unknown>>
  const topTracks = (section.data_json.topTracks || []) as Array<Record<string, unknown>>
  const recentTweets = (section.data_json.recentTweets || []) as Array<Record<string, unknown>>
  const guilds = (section.data_json.guilds || []) as Array<Record<string, unknown>>
  const connections = (section.data_json.connections || []) as Array<Record<string, unknown>>
  const items =
    topRepos.length > 0
      ? topRepos
      : topArtists.length > 0
      ? topArtists
      : topTracks.length > 0
      ? topTracks
      : recentTweets.length > 0
      ? recentTweets
      : guilds.length > 0
      ? guilds
      : connections

  if (items.length === 0) return null

  return (
    <div className="space-y-2">
      {items.slice(0, 4).map((item, index) => (
        <div key={`${String(item.name)}-${index}`} className="rounded-lg p-3" style={{ background: "var(--background)" }}>
          <div className="text-sm font-semibold" style={{ color: "var(--body)" }}>{String(item.name || item.type || "Item")}</div>
          {typeof item.description === "string" && item.description.trim() && (
            <div className="text-xs mt-1" style={{ color: "var(--secondary)" }}>{item.description}</div>
          )}
          {typeof item.text === "string" && item.text.trim() && (
            <div className="text-xs mt-1" style={{ color: "var(--secondary)" }}>{item.text}</div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function PassportSectionCard({
  section,
  index,
  isBusy,
  onVisibilityChange,
  onDelete,
}: SectionProps) {
  const stats = (section.data_json.stats || {}) as Record<string, unknown>

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className="card p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-mono mb-1" style={{ color: "var(--primary)" }}>
            SECTION 0{index + 1}
          </div>
          <div className="font-bold text-base" style={{ color: "var(--body)" }}>
            {section.title}
          </div>
          <div className="text-xs font-mono mt-1 uppercase" style={{ color: "var(--secondary)" }}>
            {section.source_platforms.join(" + ")}
          </div>
        </div>
        <PrivacyToggle
          value={section.visibility}
          disabled={isBusy}
          onChange={(val) => onVisibilityChange(section.id, val)}
        />
      </div>

      {section.visibility === "hidden" ? (
        <div className="mt-4 flex items-center gap-3 p-4 rounded-xl" style={{ background: "var(--background)" }}>
          <span className="text-sm" style={{ color: "var(--secondary)" }}>
            This section is hidden from public sharing and collapsed in your normal view.
          </span>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {section.summary && <p className="text-sm" style={{ color: "var(--secondary)" }}>{section.summary}</p>}
          <StatGrid stats={stats} />
          <Tags section={section} />
          <SourceDetails section={section} />
        </div>
      )}

      <button
        type="button"
        disabled={isBusy}
        onClick={() => onDelete(section.id)}
        className="mt-4 text-xs font-mono transition-all duration-200"
        style={{ color: "var(--secondary)", background: "none", border: "none", cursor: isBusy ? "not-allowed" : "pointer" }}
      >
        DELETE SECTION
      </button>
    </motion.div>
  )
}
