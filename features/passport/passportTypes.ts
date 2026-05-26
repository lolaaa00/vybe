import { ConnectedAccount, Platform } from "@/types"

export interface StoredConnectedAccount extends ConnectedAccount {
  raw_profile_json: Record<string, unknown>
}

export interface GeneratedPassportSection {
  section_type:
    | "proof_of_builder"
    | "proof_of_taste"
    | "proof_of_presence"
    | "proof_of_social"
    | "proof_of_contribution"
  title: string
  summary: string
  data_json: Record<string, unknown>
  visibility: "public" | "private" | "hidden"
  source_platforms: Platform[]
}
