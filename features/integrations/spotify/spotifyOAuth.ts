import { getAppUrl, requireServerEnv } from "@/lib/env"

export interface SpotifyTokenResponse {
  access_token: string
  token_type: string
  scope: string
  expires_in: number
  refresh_token?: string
}

export const SPOTIFY_SCOPES = ["user-read-email", "user-read-private", "user-top-read"]

export function getSpotifyRedirectUri() {
  return process.env.SPOTIFY_REDIRECT_URI || `${getAppUrl()}/api/oauth/spotify/callback`
}

export function getSpotifyAuthorizeUrl(state: string) {
  const params = new URLSearchParams({
    client_id: requireServerEnv("SPOTIFY_CLIENT_ID"),
    response_type: "code",
    redirect_uri: getSpotifyRedirectUri(),
    scope: SPOTIFY_SCOPES.join(" "),
    state,
  })

  return `https://accounts.spotify.com/authorize?${params.toString()}`
}

export async function exchangeSpotifyCode(code: string): Promise<SpotifyTokenResponse> {
  const clientId = requireServerEnv("SPOTIFY_CLIENT_ID")
  const clientSecret = requireServerEnv("SPOTIFY_CLIENT_SECRET")
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: getSpotifyRedirectUri(),
    }),
  })

  const payload = await response.json()
  if (!response.ok || payload.error) {
    throw new Error(payload.error_description || "Spotify token exchange failed.")
  }

  return payload
}
