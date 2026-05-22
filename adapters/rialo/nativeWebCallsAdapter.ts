// Rialo Native Web Calls Adapter
// Phase 3: Smart contracts call external APIs directly
// Current: Simulated OAuth + serverless functions

import { BaseAdapter } from "@/adapters/baseAdapter"
import { Platform } from "@/types"

export interface NativeWebCallResult {
  platform: Platform
  data: Record<string, unknown>
  fetchedAt: string
  onChain: boolean
  txHash?: string
}

export interface NativeWebCallsAdapter extends BaseAdapter {
  fetchPlatformData: (platform: Platform, userId: string) => Promise<NativeWebCallResult>
}

export const rialoNativeWebCallsAdapter: NativeWebCallsAdapter = {
  status: {
    available: false,
    phase: "phase3",
    note: "Rialo Native Web Calls not yet public. Using OAuth 2.0 + serverless functions.",
  },

  async fetchPlatformData(platform: Platform, userId: string): Promise<NativeWebCallResult> {
    // Simulated — replace with Rialo smart contract web calls
    await new Promise((r) => setTimeout(r, 500))
    return {
      platform,
      data: {},
      fetchedAt: new Date().toISOString(),
      onChain: false,
    }
  },
}
