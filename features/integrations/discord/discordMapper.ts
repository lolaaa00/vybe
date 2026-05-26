import { encryptToken } from "@/lib/security/tokenCrypto"
import {
  DiscordAccountData,
  getDiscordAvatarUrl,
} from "@/features/integrations/discord/discordApi"
import { DiscordTokenResponse } from "@/features/integrations/discord/discordOAuth"

export function mapDiscordAccountForStorage(
  userId: string,
  token: DiscordTokenResponse,
  accountData: DiscordAccountData
) {
  const profile = accountData.profile
  const expiresAt = new Date(Date.now() + token.expires_in * 1000).toISOString()

  return {
    user_id: userId,
    platform: "discord",
    platform_user_id: profile.id,
    username: profile.username,
    display_name: profile.global_name || profile.username,
    avatar_url: getDiscordAvatarUrl(profile),
    access_token_encrypted: encryptToken(token.access_token),
    refresh_token_encrypted: token.refresh_token ? encryptToken(token.refresh_token) : null,
    token_expires_at: expiresAt,
    scopes: token.scope ? token.scope.split(" ").filter(Boolean) : [],
    raw_profile_json: accountData,
  }
}
