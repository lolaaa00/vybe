// Rialo Omni Account Adapter
// Phase 3: Unified Web2 + Web3 identity primitive
// Current: Simulated via Privy

import { BaseAdapter } from "@/adapters/baseAdapter"
import { User } from "@/types"

export interface OmniAccount {
  id: string
  user: User
  web2Identities: { provider: string; id: string }[]
  web3Wallets: { address: string; chain: string }[]
  unifiedDid: string
  createdAt: string
}

export interface OmniAccountAdapter extends BaseAdapter {
  createAccount: (user: User) => Promise<OmniAccount>
  linkWeb2Identity: (accountId: string, provider: string) => Promise<void>
  linkWallet: (accountId: string, walletAddress: string) => Promise<void>
  resolveAccount: (identifier: string) => Promise<OmniAccount | null>
}

export const rialoOmniAdapter: OmniAccountAdapter = {
  status: {
    available: false,
    phase: "phase3",
    note: "Rialo Omni Account not yet public. Using Privy for unified auth.",
  },

  async createAccount(user: User): Promise<OmniAccount> {
    await new Promise((r) => setTimeout(r, 300))
    return {
      id: `omni_${Math.random().toString(36).slice(2, 10)}`,
      user,
      web2Identities: [{ provider: user.loginMethod, id: user.id }],
      web3Wallets: [],
      unifiedDid: `did:rialo:${Math.random().toString(36).slice(2, 18)}`,
      createdAt: new Date().toISOString(),
    }
  },

  async linkWeb2Identity(accountId: string, provider: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 200))
  },

  async linkWallet(accountId: string, walletAddress: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 200))
  },

  async resolveAccount(identifier: string): Promise<OmniAccount | null> {
    await new Promise((r) => setTimeout(r, 200))
    return null
  },
}
