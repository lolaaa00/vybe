"use client"

import { motion } from "framer-motion"
import { PassportSection, PrivacyState } from "@/types"
import PrivacyToggle from "@/components/passport/PrivacyToggle"

interface SectionProps {
  section: PassportSection
  index: number
  onPrivacyChange: (id: string, val: PrivacyState) => void
}

function TasteContent({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap gap-2">
        {(data.topArtists as string[]).map((a) => (
          <span
            key={a}
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{ background: "var(--tint)", color: "var(--primary)" }}
          >
            {a}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 mt-3">
        {[
          { label: "Minutes", value: (data.minutesListened as number).toLocaleString() },
          { label: "Genres", value: (data.topGenres as string[]).length },
          { label: "Mood", value: "Reflective" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-3 text-center"
            style={{ background: "var(--background)" }}
          >
            <div className="font-bold text-sm" style={{ color: "var(--body)" }}>
              {stat.value}
            </div>
            <div className="text-xs font-mono mt-0.5" style={{ color: "var(--secondary)" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      <div className="text-xs font-mono" style={{ color: "var(--secondary)" }}>
        TOP GENRES: {(data.topGenres as string[]).join(" · ")}
      </div>
    </div>
  )
}

function BuilderContent({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="mt-4 space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Commits", value: (data.commits as number).toLocaleString() },
          { label: "Repos", value: data.repos as number },
          { label: "Stars", value: data.stars as number },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-3 text-center"
            style={{ background: "var(--background)" }}
          >
            <div className="font-bold text-lg" style={{ color: "var(--body)" }}>
              {stat.value}
            </div>
            <div className="text-xs font-mono mt-0.5" style={{ color: "var(--secondary)" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {(data.topLangs as string[]).map((lang) => (
          <span
            key={lang}
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{ background: "var(--tint)", color: "var(--primary)" }}
          >
            {lang}
          </span>
        ))}
      </div>
      <div className="text-xs font-mono" style={{ color: "var(--secondary)" }}>
        PROJECTS: {(data.projects as string[]).join(" · ")}
      </div>
    </div>
  )
}

function CommunityContent({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap gap-2">
        {(data.servers as string[]).map((s) => (
          <span
            key={s}
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{ background: "var(--tint)", color: "var(--primary)" }}
          >
            {s}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Account Age", value: data.accountAge as string },
          { label: "Events", value: data.events as number },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-3 text-center"
            style={{ background: "var(--background)" }}
          >
            <div className="font-bold text-sm" style={{ color: "var(--body)" }}>
              {stat.value}
            </div>
            <div className="text-xs font-mono mt-0.5" style={{ color: "var(--secondary)" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      <div className="text-xs font-mono" style={{ color: "var(--secondary)" }}>
        ROLES: {(data.roles as string[]).join(" · ")}
      </div>
    </div>
  )
}

function CuriosityContent({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap gap-2">
        {(data.topics as string[]).map((t) => (
          <span
            key={t}
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{ background: "var(--tint)", color: "var(--primary)" }}
          >
            #{t}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Followers", value: (data.followers as number).toLocaleString() },
          { label: "Posts", value: (data.posts as number).toLocaleString() },
          { label: "Engagement", value: data.engagementRate as string },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-3 text-center"
            style={{ background: "var(--background)" }}
          >
            <div className="font-bold text-sm" style={{ color: "var(--body)" }}>
              {stat.value}
            </div>
            <div className="text-xs font-mono mt-0.5" style={{ color: "var(--secondary)" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      <div className="text-xs font-mono" style={{ color: "var(--secondary)" }}>
        ACCOUNT AGE: {data.accountAge as string}
      </div>
    </div>
  )
}

function VaultContent({ privacy }: { privacy: PrivacyState }) {
  if (privacy !== "private") {
    return (
      <div className="mt-4 space-y-2">
        {["Email address", "Phone number", "Wallet seed phrase hint", "Private notes"].map(
          (item) => (
            <div
              key={item}
              className="flex items-center gap-3 p-3 rounded-lg"
              style={{ background: "var(--background)" }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--primary)" }}
              />
              <span className="text-sm" style={{ color: "var(--secondary)" }}>
                {item}
              </span>
              <span
                className="ml-auto text-xs font-mono"
                style={{ color: "var(--secondary)" }}
              >
                ENCRYPTED
              </span>
            </div>
          )
        )}
      </div>
    )
  }
  return (
    <div
      className="mt-4 flex items-center gap-3 p-4 rounded-xl"
      style={{ background: "var(--background)" }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
      <span className="text-sm" style={{ color: "var(--secondary)" }}>
        This section is private. Only you can see it.
      </span>
    </div>
  )
}

export default function PassportSectionCard({ section, index, onPrivacyChange }: SectionProps) {
  const isPrivate = section.privacy === "private" && section.type !== "vault"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="card p-5"
    >
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-mono mb-1" style={{ color: "var(--primary)" }}>
            SECTION 0{index + 2}
          </div>
          <div className="font-bold text-base" style={{ color: "var(--body)" }}>
            {section.title}
          </div>
        </div>
        <PrivacyToggle
          value={section.privacy}
          onChange={(val) => onPrivacyChange(section.id, val)}
        />
      </div>

      {/* Content */}
      {isPrivate ? (
        <div
          className="mt-4 flex items-center gap-3 p-4 rounded-xl"
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
        <>
          {section.type === "taste" && <TasteContent data={section.data} />}
          {section.type === "builder" && <BuilderContent data={section.data} />}
          {section.type === "community" && <CommunityContent data={section.data} />}
          {section.type === "curiosity" && <CuriosityContent data={section.data} />}
          {section.type === "vault" && <VaultContent privacy={section.privacy} />}
        </>
      )}
    </motion.div>
  )
}
