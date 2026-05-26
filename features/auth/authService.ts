"use client"

import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { getAppUrl, getMissingPublicSupabaseKeys } from "@/lib/env"
import { DashboardData } from "@/types"

export function getAuthSetupError(): string | null {
  const missing = getMissingPublicSupabaseKeys()
  if (missing.length === 0) return null
  return `Supabase Auth is not configured. Add ${missing.join(", ")}.`
}

export async function signInWithGoogle() {
  const setupError = getAuthSetupError()
  if (setupError) {
    throw new Error(setupError)
  }

  const supabase = createSupabaseBrowserClient()
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getAppUrl()}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  })

  if (error) throw error
}

export async function signOut() {
  const supabase = createSupabaseBrowserClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentSession() {
  const setupError = getAuthSetupError()
  if (setupError) return null

  const supabase = createSupabaseBrowserClient()
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export function onAuthStateChange(callback: () => void) {
  const setupError = getAuthSetupError()
  if (setupError) return () => {}

  const supabase = createSupabaseBrowserClient()
  const { data } = supabase.auth.onAuthStateChange(() => callback())
  return () => data.subscription.unsubscribe()
}

export async function loadDashboardData(): Promise<DashboardData> {
  const response = await fetch("/api/me/bootstrap", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  const payload = await response.json()
  if (!response.ok) {
    throw new Error(payload.error || "Unable to load your Vybe dashboard.")
  }

  return payload
}
