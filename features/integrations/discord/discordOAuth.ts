import { getAppUrl, getOptionalServerEnv, requireServerEnv } from "@/lib/env"

export interface DiscordTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
  scope?: string
}

export const DEFAULT_DISCORD_SCOPES = ["identify", "connections", "guilds"]

export function getDiscordRedirectUri() {
  return getOptionalServerEnv("DISCORD_REDIRECT_URI") || `${getAppUrl()}/api/oauth/discord/callback`
}

export function getDiscordScopes() {
  return (getOptionalServerEnv("DISCORD_SCOPES") || DEFAULT_DISCORD_SCOPES.join(" "))
    .split(/\s+/)
    .map((scope) => scope.trim())
    .filter(Boolean)
}

export function getDiscordAuthorizeUrl(state: string) {
  const params = new URLSearchParams({
    client_id: requireServerEnv("DISCORD_CLIENT_ID"),
    redirect_uri: getDiscordRedirectUri(),
    response_type: "code",
    scope: getDiscordScopes().join(" "),
    state,
    prompt: "consent",
  })

  return `https://discord.com/oauth2/authorize?${params.toString()}`
}

export async function exchangeDiscordCode(code: string): Promise<DiscordTokenResponse> {
  const clientId = requireServerEnv("DISCORD_CLIENT_ID")
  const clientSecret = requireServerEnv("DISCORD_CLIENT_SECRET")
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: getDiscordRedirectUri(),
    }),
  })

  const payload = await response.json()
  if (!response.ok || payload.error) {
    throw new Error(payload.error_description || payload.error || "Discord token exchange failed.")
  }

  return payload
}
