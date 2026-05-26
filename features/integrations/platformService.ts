import { ConnectedAccountSummary, Platform } from "@/types"

export interface PlatformConfig {
  id: Platform
  label: string
  description: string
  color: string
  icon: string
}

export const PLATFORM_CONFIG: PlatformConfig[] = [
  {
    id: "github",
    label: "GitHub",
    description: "Public repos, languages, followers, and recent activity",
    color: "#24292F",
    icon: "GH",
  },
  {
    id: "spotify",
    label: "Spotify",
    description: "Top artists, tracks, genres, and listening profile",
    color: "#1DB954",
    icon: "SP",
  },
  {
    id: "x",
    label: "X",
    description: "Profile, public metrics, and recent post signals",
    color: "#111111",
    icon: "X",
  },
  {
    id: "discord",
    label: "Discord",
    description: "Profile, linked accounts, and community memberships",
    color: "#5865F2",
    icon: "DC",
  },
]

export const SUPPORTED_PLATFORMS: Platform[] = ["github", "spotify", "x", "discord"]

export function getConnectedAccount(
  accounts: ConnectedAccountSummary[],
  platform: Platform
) {
  return accounts.find((account) => account.platform === platform) || null
}

export function connectPlatform(platform: Platform) {
  window.location.href = `/api/oauth/${platform}/start`
}

export async function disconnectPlatform(platform: Platform) {
  const response = await fetch("/api/integrations/disconnect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ platform }),
  })

  const payload = await response.json()
  if (!response.ok) {
    throw new Error(payload.error || `Unable to disconnect ${platform}.`)
  }
}

export function isSupportedPlatform(value: unknown): value is Platform {
  return typeof value === "string" && SUPPORTED_PLATFORMS.includes(value as Platform)
}
