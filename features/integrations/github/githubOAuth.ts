import { getAppUrl, requireServerEnv } from "@/lib/env"

export interface GitHubTokenResponse {
  access_token: string
  token_type: string
  scope: string
}

export function getGitHubAuthorizeUrl(state: string) {
  const params = new URLSearchParams({
    client_id: requireServerEnv("GITHUB_CLIENT_ID"),
    redirect_uri: `${getAppUrl()}/api/oauth/github/callback`,
    scope: "read:user user:email public_repo",
    state,
    allow_signup: "true",
  })

  return `https://github.com/login/oauth/authorize?${params.toString()}`
}

export async function exchangeGitHubCode(code: string): Promise<GitHubTokenResponse> {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: requireServerEnv("GITHUB_CLIENT_ID"),
      client_secret: requireServerEnv("GITHUB_CLIENT_SECRET"),
      code,
      redirect_uri: `${getAppUrl()}/api/oauth/github/callback`,
    }),
  })

  const payload = await response.json()
  if (!response.ok || payload.error) {
    throw new Error(payload.error_description || "GitHub token exchange failed.")
  }

  return payload
}
