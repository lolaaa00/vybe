import { User } from "@/types"

const SIMULATED_USERS = {
  google: {
    id: "sim_google_001",
    name: "Alex River",
    handle: "alexriver",
    avatar: "AR",
    loginMethod: "google" as const,
  },
  apple: {
    id: "sim_apple_001",
    name: "Alex River",
    handle: "alexriver",
    avatar: "AR",
    loginMethod: "apple" as const,
  },
  wallet: {
    id: "sim_wallet_001",
    name: "0x4f3a...c91b",
    handle: "0x4f3a...c91b",
    avatar: "0x",
    loginMethod: "wallet" as const,
  },
}

export async function simulateLogin(
  method: "google" | "apple" | "wallet"
): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 1200))
  return SIMULATED_USERS[method]
}

export async function simulateLogout(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500))
}
