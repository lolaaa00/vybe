import { createClient } from "@supabase/supabase-js"
import { requirePublicSupabaseEnv, requireServerEnv } from "@/lib/env"

export function createSupabaseAdminClient() {
  const env = requirePublicSupabaseEnv()
  const serviceRoleKey = requireServerEnv("SUPABASE_SERVICE_ROLE_KEY")

  return createClient(env.url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
