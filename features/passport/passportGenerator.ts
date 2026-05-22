import { Platform, PassportSection, ReputationSignal } from "@/types"
import { SIMULATED_PLATFORM_DATA } from "@/features/integrations/platformService"

export const GENERATION_STAGES = [
  { id: 1, label: "Pulling platform data", duration: 800 },
  { id: 2, label: "Mapping identity graph", duration: 900 },
  { id: 3, label: "Calculating reputation signals", duration: 1000 },
  { id: 4, label: "Building passport sections", duration: 800 },
  { id: 5, label: "Applying privacy defaults", duration: 600 },
]

export function generatePassportSections(
  platforms: Platform[]
): PassportSection[] {
  const sections: PassportSection[] = []

  if (platforms.includes("spotify")) {
    sections.push({
      id: "taste",
      type: "taste",
      title: "Proof of Taste",
      platform: "spotify",
      data: SIMULATED_PLATFORM_DATA.spotify,
      privacy: "public",
    })
  }

  if (platforms.includes("github")) {
    sections.push({
      id: "builder",
      type: "builder",
      title: "Proof of Builder",
      platform: "github",
      data: SIMULATED_PLATFORM_DATA.github,
      privacy: "public",
    })
  }

  if (platforms.includes("discord")) {
    sections.push({
      id: "community",
      type: "community",
      title: "Proof of Community",
      platform: "discord",
      data: SIMULATED_PLATFORM_DATA.discord,
      privacy: "public",
    })
  }

  if (platforms.includes("x")) {
    sections.push({
      id: "curiosity",
      type: "curiosity",
      title: "Proof of Curiosity",
      platform: "x",
      data: SIMULATED_PLATFORM_DATA.x,
      privacy: "public",
    })
  }

  sections.push({
    id: "vault",
    type: "vault",
    title: "Private Vault",
    platform: "wallet",
    data: platforms.includes("wallet")
      ? SIMULATED_PLATFORM_DATA.wallet
      : {},
    privacy: "private",
  })

  return sections
}

export function evaluateReputationSignals(
  platforms: Platform[]
): ReputationSignal[] {
  const signals: ReputationSignal[] = []

  if (platforms.includes("github")) {
    signals.push("Verified Builder")
    signals.push("Consistent Contributor")
  }

  if (platforms.includes("discord")) {
    signals.push("Early Community Member")
  }

  if (platforms.includes("wallet")) {
    signals.push("Trusted Participant")
  }

  if (platforms.includes("spotify")) {
    signals.push("Culture Curator")
  }

  if (platforms.includes("x")) {
    signals.push("Active Learner")
    signals.push("High-Signal Creator")
  }

  return signals
}
