import Link from "next/link"
import { getPublicPassport } from "@/features/sharing/publicPassportService"
import { isSetupError } from "@/lib/env"
import { PassportSection } from "@/types"

function EmptyPassport({ handle }: { handle: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--background)" }}>
      <div className="text-center max-w-sm">
        <div className="text-4xl mb-4">404</div>
        <div className="font-bold text-xl mb-2" style={{ color: "var(--body)" }}>
          Passport not found
        </div>
        <div className="text-sm mb-6" style={{ color: "var(--secondary)" }}>
          No public passport found for @{handle}
        </div>
        <Link href="/" className="text-xs font-mono" style={{ color: "var(--primary)" }}>
          Create your passport
        </Link>
      </div>
    </div>
  )
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

function PublicSectionCard({ section, index }: { section: PassportSection; index: number }) {
  const stats = (section.data_json.stats || {}) as Record<string, unknown>
  const tags = [
    ...((section.data_json.languages || []) as string[]),
    ...((section.data_json.tasteTags || []) as string[]),
    ...((section.data_json.badges || []) as string[]),
  ].slice(0, 10)

  return (
    <div className="card p-5">
      <div className="text-xs font-mono mb-1" style={{ color: "var(--primary)" }}>
        SECTION 0{index + 1}
      </div>
      <h2 className="font-bold text-base mb-2" style={{ color: "var(--body)" }}>
        {section.title}
      </h2>
      {section.summary && (
        <p className="text-sm mb-4" style={{ color: "var(--secondary)" }}>
          {section.summary}
        </p>
      )}
      <div className="space-y-4">
        <StatGrid stats={stats} />
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "var(--tint)", color: "var(--primary)" }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default async function PublicPassportPage({
  params,
}: {
  params: { handle: string }
}) {
  let setupError: string | null = null
  let passport = null

  try {
    passport = await getPublicPassport(params.handle)
  } catch (error) {
    if (isSetupError(error)) {
      setupError = error.message
    } else {
      throw error
    }
  }

  if (setupError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--background)" }}>
        <div className="card p-6 max-w-sm">
          <div className="text-xs font-mono mb-2" style={{ color: "var(--primary)" }}>SETUP REQUIRED</div>
          <h1 className="text-xl font-bold mb-2" style={{ color: "var(--body)" }}>Public passport is not configured</h1>
          <p className="text-sm" style={{ color: "var(--secondary)" }}>{setupError}</p>
        </div>
      </div>
    )
  }

  if (!passport) {
    return <EmptyPassport handle={params.handle} />
  }

  const displayName = passport.profile.display_name || passport.profile.handle || "Vybe user"
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <main className="min-h-screen py-10 px-4" style={{ background: "var(--background)" }}>
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--primary)" }}>
              <span className="text-white font-bold text-xs">V</span>
            </div>
            <span className="font-bold tracking-tight" style={{ color: "var(--body)" }}>vybe</span>
          </div>
          <div className="text-xs font-mono px-3 py-1 rounded-full" style={{ background: "var(--tint)", color: "var(--primary)" }}>
            PUBLIC PASSPORT
          </div>
        </div>

        <section className="rounded-2xl p-6 mb-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--primary) 0%, #4C1D95 100%)", border: "1px solid var(--primary)" }}>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
              {passport.profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={passport.profile.avatar_url} alt={`${displayName} avatar`} className="w-full h-full rounded-xl object-cover" />
              ) : (
                initials
              )}
            </div>
            <div>
              <h1 className="text-white font-bold text-xl tracking-tight">{displayName}</h1>
              <div className="text-white text-sm opacity-70 font-mono">@{passport.profile.handle}</div>
              {passport.profile.bio && (
                <p className="text-white text-sm opacity-80 mt-2">{passport.profile.bio}</p>
              )}
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-4 mb-6">
          {passport.sections.map((section, index) => (
            <PublicSectionCard key={section.id} section={section} index={index} />
          ))}
        </div>

        <Link href="/" className="inline-block w-full py-4 rounded-xl font-semibold text-sm text-white text-center transition-all duration-200" style={{ background: "var(--cta)", boxShadow: "0 0 20px rgba(249,115,22,0.3)" }}>
          Create your own Vybe passport
        </Link>
      </div>
    </main>
  )
}
