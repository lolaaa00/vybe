export interface DiscordUser {
  id: string
  username: string
  global_name?: string | null
  discriminator?: string
  avatar?: string | null
  email?: string | null
  verified?: boolean
}

export interface DiscordGuild {
  id: string
  name: string
  icon?: string | null
  owner?: boolean
  permissions?: string
  features?: string[]
  approximate_member_count?: number
  approximate_presence_count?: number
}

export interface DiscordConnection {
  id: string
  name: string
  type: string
  verified?: boolean
  visibility?: number
}

export interface DiscordAccountData {
  profile: DiscordUser
  guilds: DiscordGuild[]
  connections: DiscordConnection[]
}

export function getDiscordAvatarUrl(user: DiscordUser) {
  if (!user.avatar) return null
  const extension = user.avatar.startsWith("a_") ? "gif" : "png"
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=128`
}

async function discordFetch<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`https://discord.com/api/v10${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const payload = await response.json()
  if (!response.ok) {
    throw new Error(payload.message || `Discord API request failed: ${response.status}`)
  }

  return payload
}

export async function fetchDiscordAccountData(token: string): Promise<DiscordAccountData> {
  const profile = await discordFetch<DiscordUser>("/users/@me", token)

  let guilds: DiscordGuild[] = []
  let connections: DiscordConnection[] = []

  try {
    guilds = await discordFetch<DiscordGuild[]>(
      "/users/@me/guilds?with_counts=true&limit=100",
      token
    )
  } catch {
    guilds = []
  }

  try {
    connections = await discordFetch<DiscordConnection[]>("/users/@me/connections", token)
  } catch {
    connections = []
  }

  return { profile, guilds, connections }
}
