export type Theme = 'dark' | 'light'

export type Platform = 'github' | 'spotify' | 'discord' | 'x' | 'wallet'

export type Step = 1 | 2 | 3 | 4

export type PrivacyState = 'public' | 'selective' | 'private'

export type ReputationSignal =
  | 'Verified Builder'
  | 'Early Community Member'
  | 'Consistent Contributor'
  | 'Trusted Participant'
  | 'Culture Curator'
  | 'Active Learner'
  | 'High-Signal Creator'

export interface User {
  id: string
  name: string
  handle: string
  avatar: string
  loginMethod: 'google' | 'apple' | 'wallet'
}

export interface PassportSection {
  id: string
  type: 'taste' | 'builder' | 'community' | 'curiosity' | 'vault'
  title: string
  platform: Platform
  data: Record<string, unknown>
  privacy: PrivacyState
}

export interface ActivityEvent {
  platform: Platform
  type: string
  timestamp: string
  value: number | string
  metadata: Record<string, unknown>
  visibility: PrivacyState
}
