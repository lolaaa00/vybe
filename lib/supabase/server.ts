import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { requirePublicSupabaseEnv } from "@/lib/env"

export async function createSupabaseServerClient() {
  const env = requirePublicSupabaseEnv()
  const cookieStore = await cookies()

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}
