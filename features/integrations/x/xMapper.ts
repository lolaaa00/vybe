import { encryptToken } from "@/lib/security/tokenCrypto"
import { XAccountData } from "@/features/integrations/x/xApi"
import { XTokenResponse } from "@/features/integrations/x/xOAuth"

export function mapXAccountForStorage(
  userId: string,
  token: XTokenResponse,
  accountData: XAccountData
) {
  const profile = accountData.profile
  const expiresAt = token.expires_in
    ? new Date(Date.now() + token.expires_in * 1000).toISOString()
    : null

  return {
    user_id: userId,
    platform: "x",
    platform_user_id: profile.id,
    username: profile.username,
    display_name: profile.name || profile.username,
    avatar_url: profile.profile_image_url || null,
    access_token_encrypted: encryptToken(token.access_token),
    refresh_token_encrypted: token.refresh_token ? encryptToken(token.refresh_token) : null,
    token_expires_at: expiresAt,
    scopes: token.scope ? token.scope.split(" ").filter(Boolean) : [],
    raw_profile_json: accountData,
  }
}
