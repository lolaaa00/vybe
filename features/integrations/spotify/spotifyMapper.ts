import { encryptToken } from "@/lib/security/tokenCrypto"
import { SpotifyAccountData } from "@/features/integrations/spotify/spotifyApi"
import { SpotifyTokenResponse } from "@/features/integrations/spotify/spotifyOAuth"

export function mapSpotifyAccountForStorage(
  userId: string,
  token: SpotifyTokenResponse,
  accountData: SpotifyAccountData
) {
  const profile = accountData.profile
  const avatarUrl = profile.images?.[0]?.url || null
  const expiresAt = new Date(Date.now() + token.expires_in * 1000).toISOString()

  return {
    user_id: userId,
    platform: "spotify",
    platform_user_id: profile.id,
    username: profile.id,
    display_name: profile.display_name || profile.id,
    avatar_url: avatarUrl,
    access_token_encrypted: encryptToken(token.access_token),
    refresh_token_encrypted: token.refresh_token ? encryptToken(token.refresh_token) : null,
    token_expires_at: expiresAt,
    scopes: token.scope ? token.scope.split(" ").filter(Boolean) : [],
    raw_profile_json: accountData,
  }
}
