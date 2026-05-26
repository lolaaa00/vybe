import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function requireAuthenticatedUser() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) throw error
  if (!user) throw new Error("Not authenticated.")

  return user
}
