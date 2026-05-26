import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { apiError } from "@/lib/api/errors"
import { ensureProfileForUser, upsertPublicPassportForProfile } from "@/features/auth/profileService"
import { ConnectedAccountSummary, PassportSection, PublicPassport } from "@/types"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 })
    }

    const profile = await ensureProfileForUser(user)
    const admin = createSupabaseAdminClient()

    const [{ data: accountRows, error: accountsError }, { data: sectionRows, error: sectionsError }] =
      await Promise.all([
        admin
          .from("connected_accounts")
          .select("id, platform, platform_user_id, username, display_name, avatar_url, scopes, connected_at, updated_at")
          .eq("user_id", user.id)
          .order("connected_at", { ascending: true }),
        admin
          .from("passport_sections")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true }),
      ])

    if (accountsError) throw accountsError
    if (sectionsError) throw sectionsError

    const publicPassport = profile.handle
      ? await upsertPublicPassportForProfile(profile)
      : null

    return NextResponse.json({
      profile,
      connectedAccounts: (accountRows || []) as ConnectedAccountSummary[],
      sections: (sectionRows || []) as PassportSection[],
      publicPassport: publicPassport as PublicPassport | null,
    })
  } catch (error) {
    return apiError(error, "Unable to load dashboard.")
  }
}
