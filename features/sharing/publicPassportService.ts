import { User, Platform, PassportSection, ReputationSignal } from "@/types"
import { generatePassportSections, evaluateReputationSignals } from "@/features/passport/passportGenerator"

export interface PublicPassportData {
  user: User
  connectedPlatforms: Platform[]
  sections: PassportSection[]
  signals: ReputationSignal[]
  passportNumber: string
}

const DEMO_PASSPORT: PublicPassportData = {
  user: {
    id: "demo_001",
    name: "Alex River",
    handle: "alexriver",
    avatar: "AR",
    loginMethod: "google",
  },
  connectedPlatforms: ["github", "spotify", "discord", "x", "wallet"],
  sections: generatePassportSections(["github", "spotify", "discord", "x", "wallet"]),
  signals: evaluateReputationSignals(["github", "spotify", "discord", "x", "wallet"]),
  passportNumber: "VP-291847",
}

export async function getPublicPassport(handle: string): Promise<PublicPassportData | null> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  if (handle === "alexriver" || handle === "demo") {
    return DEMO_PASSPORT
  }
  return null
}
