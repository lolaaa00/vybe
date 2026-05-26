import { GeneratedPassportSection, StoredConnectedAccount } from "@/features/passport/passportTypes"

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

function numberValue(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null
}

function generateGitHubSection(account: StoredConnectedAccount): GeneratedPassportSection | null {
  const raw = account.raw_profile_json || {}
  const profile = asRecord(raw.profile)
  const repos = asArray<Record<string, unknown>>(raw.repos)
  const recentActivity = asArray<Record<string, unknown>>(raw.recentActivity)
  const languages = asArray<string>(raw.languages).filter(Boolean)
  const login = stringValue(profile.login) || account.username

  if (!login) return null

  const topRepos = repos
    .map((repo) => ({
      name: stringValue(repo.name) || stringValue(repo.full_name) || "Repository",
      url: stringValue(repo.html_url),
      description: stringValue(repo.description),
      language: stringValue(repo.language),
      stars: numberValue(repo.stargazers_count),
      forks: numberValue(repo.forks_count),
      updatedAt: stringValue(repo.updated_at),
    }))
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 5)

  const repoCount = numberValue(profile.public_repos) || repos.length
  const followers = numberValue(profile.followers)
  const activityTypes = Array.from(
    new Set(recentActivity.map((event) => stringValue(event.type)).filter(Boolean) as string[])
  ).slice(0, 6)

  const summaryParts = [
    `${account.display_name || login} maintains ${repoCount} public repos`,
    languages.length ? `works mostly in ${languages.slice(0, 3).join(", ")}` : null,
    followers ? `has ${followers.toLocaleString()} GitHub followers` : null,
  ].filter(Boolean)

  return {
    section_type: "proof_of_builder",
    title: "Proof of Builder",
    summary: `${summaryParts.join(", ")}.`,
    visibility: "public",
    source_platforms: ["github"],
    data_json: {
      platform: "github",
      username: login,
      profileUrl: stringValue(profile.html_url),
      bio: stringValue(profile.bio),
      stats: {
        publicRepos: repoCount,
        followers,
        following: numberValue(profile.following),
        recentPublicEvents: recentActivity.length,
      },
      languages,
      topRepos,
      activityTypes,
      badges: [
        repoCount >= 10 ? "Public Builder" : null,
        languages.length >= 3 ? "Polyglot" : null,
        followers >= 50 ? "Followed Builder" : null,
      ].filter(Boolean),
    },
  }
}

function generateSpotifySection(account: StoredConnectedAccount): GeneratedPassportSection | null {
  const raw = account.raw_profile_json || {}
  const profile = asRecord(raw.profile)
  const topArtists = asArray<Record<string, unknown>>(raw.topArtists)
  const topTracks = asArray<Record<string, unknown>>(raw.topTracks)
  const genres = asArray<string>(raw.genres).filter(Boolean)
  const displayName = account.display_name || stringValue(profile.display_name) || account.username

  if (!account.platform_user_id) return null

  const artists = topArtists.slice(0, 8).map((artist) => ({
    name: stringValue(artist.name) || "Artist",
    genres: asArray<string>(artist.genres).slice(0, 4),
    popularity: numberValue(artist.popularity),
    url: stringValue(asRecord(artist.external_urls).spotify),
  }))

  const tracks = topTracks.slice(0, 8).map((track) => ({
    name: stringValue(track.name) || "Track",
    artists: asArray<Record<string, unknown>>(track.artists)
      .map((artist) => stringValue(artist.name))
      .filter(Boolean),
    popularity: numberValue(track.popularity),
    url: stringValue(asRecord(track.external_urls).spotify),
  }))

  const summary =
    artists.length > 0
      ? `${displayName || "This listener"} gravitates toward ${artists
          .slice(0, 3)
          .map((artist) => artist.name)
          .join(", ")}${genres.length ? `, with signals around ${genres.slice(0, 4).join(", ")}` : ""}.`
      : `${displayName || "This listener"} connected Spotify. Top listening data is limited or unavailable yet.`

  return {
    section_type: "proof_of_taste",
    title: "Proof of Taste",
    summary,
    visibility: "public",
    source_platforms: ["spotify"],
    data_json: {
      platform: "spotify",
      profileUrl: stringValue(asRecord(profile.external_urls).spotify),
      genres,
      topArtists: artists,
      topTracks: tracks,
      tasteTags: genres.slice(0, 6),
      stats: {
        topArtistCount: artists.length,
        topTrackCount: tracks.length,
        genreCount: genres.length,
      },
    },
  }
}

export function generatePassportSectionsFromAccounts(
  accounts: StoredConnectedAccount[]
): GeneratedPassportSection[] {
  return accounts
    .map((account) => {
      if (account.platform === "github") return generateGitHubSection(account)
      if (account.platform === "spotify") return generateSpotifySection(account)
      return null
    })
    .filter(Boolean) as GeneratedPassportSection[]
}
