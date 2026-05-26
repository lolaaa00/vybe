import { getAppUrl, getOptionalServerEnv, requireServerEnv } from "@/lib/env"

export interface XTokenResponse {
  access_token: string
  token_type: string
  expires_in?: number
  refresh_token?: string
  scope?: string
}

export const DEFAULT_X_SCOPES = ["tweet.read", "users.read", "follows.read", "offline.access"]

export function getXRedirectUri() {
  return getOptionalServerEnv("X_REDIRECT_URI") || `${getAppUrl()}/api/oauth/x/callback`
}

export function getXScopes() {
  return (getOptionalServerEnv("X_SCOPES") || DEFAULT_X_SCOPES.join(" "))
    .split(/\s+/)
    .map((scope) => scope.trim())
    .filter(Boolean)
}

export function getXAuthorizeUrl(state: string, codeChallenge: string) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: requireServerEnv("X_CLIENT_ID"),
    redirect_uri: getXRedirectUri(),
    scope: getXScopes().join(" "),
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  })

  return `https://x.com/i/oauth2/authorize?${params.toString()}`
}

export async function exchangeXCode(
  code: string,
  codeVerifier: string
): Promise<XTokenResponse> {
  const clientId = requireServerEnv("X_CLIENT_ID")
  const clientSecret = requireServerEnv("X_CLIENT_SECRET")
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const response = await fetch("https://api.x.com/2/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: getXRedirectUri(),
      code_verifier: codeVerifier,
    }),
  })

  const payload = await response.json()
  if (!response.ok || payload.error) {
    throw new Error(payload.error_description || payload.error || "X token exchange failed.")
  }

  return payload
}
