export type Theme = "dark" | "light"

export type Platform = "github" | "spotify"

export type Step = 1 | 2 | 3 | 4

export type VisibilityState = "public" | "private" | "hidden"
export type PrivacyState = VisibilityState

export type PassportSectionType =
  | "proof_of_builder"
  | "proof_of_taste"
  | "proof_of_presence"
  | "proof_of_social"
  | "proof_of_contribution"

export interface Profile {
  id: string
  email: string | null
  display_name: string | null
  handle: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export interface ConnectedAccount {
  id: string
  user_id: string
  platform: Platform
  platform_user_id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  scopes: string[]
  raw_profile_json?: Record<string, unknown>
  connected_at: string
  updated_at: string
}

export interface ConnectedAccountSummary {
  id: string
  platform: Platform
  platform_user_id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  scopes: string[]
  connected_at: string
  updated_at: string
}

export interface PassportSection {
  id: string
  user_id: string
  section_type: PassportSectionType
  title: string
  summary: string | null
  data_json: Record<string, unknown>
  visibility: VisibilityState
  source_platforms: Platform[]
  created_at: string
  updated_at: string
}

export interface PublicPassport {
  id: string
  user_id: string
  handle: string
  slug: string
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface PublicPassportData {
  profile: Pick<Profile, "display_name" | "handle" | "avatar_url" | "bio">
  publicPassport: Pick<PublicPassport, "handle" | "slug" | "is_public">
  sections: PassportSection[]
}

export interface DashboardData {
  profile: Profile
  connectedAccounts: ConnectedAccountSummary[]
  sections: PassportSection[]
  publicPassport: PublicPassport | null
}
