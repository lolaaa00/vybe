import { encryptToken } from "@/lib/security/tokenCrypto"
import { GitHubAccountData } from "@/features/integrations/github/githubApi"
import { GitHubTokenResponse } from "@/features/integrations/github/githubOAuth"

export function mapGitHubAccountForStorage(
  userId: string,
  token: GitHubTokenResponse,
  accountData: GitHubAccountData
) {
  const profile = accountData.profile

  return {
    user_id: userId,
    platform: "github",
    platform_user_id: String(profile.id),
    username: profile.login,
    display_name: profile.name || profile.login,
    avatar_url: profile.avatar_url,
    access_token_encrypted: encryptToken(token.access_token),
    refresh_token_encrypted: null,
    token_expires_at: null,
    scopes: token.scope ? token.scope.split(",").map((scope) => scope.trim()).filter(Boolean) : [],
    raw_profile_json: accountData,
  }
}
