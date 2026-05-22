import { Platform } from "@/types"

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
    description: "Commits, repos, languages, contributions",
    color: "#6e40c9",
    icon: "GH",
  },
  {
    id: "spotify",
    label: "Spotify",
    description: "Top artists, genres, listening history",
    color: "#1DB954",
    icon: "SP",
  },
  {
    id: "discord",
    label: "Discord",
    description: "Servers, roles, community memberships",
    color: "#5865F2",
    icon: "DC",
  },
  {
    id: "x",
    label: "X / Twitter",
    description: "Topics, reach, interests, social graph",
    color: "#000000",
    icon: "X",
  },
  {
    id: "wallet",
    label: "Wallet",
    description: "NFTs, DAOs, DeFi, onchain activity",
    color: "#F97316",
    icon: "W3",
  },
]

export const SIMULATED_PLATFORM_DATA: Record<Platform, Record<string, unknown>> = {
  github: {
    repos: 42,
    commits: 1847,
    topLangs: ["TypeScript", "Rust", "Python"],
    projects: ["passport-ui", "rialo-sdk", "vybe-graph"],
    stars: 312,
    contributions: 847,
  },
  spotify: {
    topArtists: ["Bon Iver", "James Blake", "FKA Twigs"],
    topGenres: ["Indie Folk", "Electronic Soul", "Ambient"],
    minutesListened: 84320,
    topTracks: ["Holocene", "Limit To Your Love", "Water Me"],
    recentMood: "Melancholic / Reflective",
  },
  discord: {
    servers: ["Rialo Builders", "Figma Community", "Indie Hackers"],
    roles: ["Core Contributor", "Early Member", "Verified Human"],
    accountAge: "3 years",
    events: 24,
  },
  x: {
    followers: 2840,
    topics: ["Web3", "Design Systems", "Open Source"],
    posts: 1203,
    accountAge: "5 years",
    engagementRate: "4.2%",
  },
  wallet: {
    address: "0x4f3a...c91b",
    nfts: 7,
    daos: ["Developer DAO", "Gitcoin"],
    defi: ["Uniswap", "Aave"],
    transactions: 143,
  },
}

export async function simulatePlatformConnect(platform: Platform): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 800))
}
