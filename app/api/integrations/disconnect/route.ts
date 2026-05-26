import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { apiError } from "@/lib/api/errors"
import { isSupportedPlatform } from "@/features/integrations/platformService"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!isSupportedPlatform(body.platform)) {
      throw new Error("Unsupported platform.")
    }

    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) throw error
    if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 })

    const admin = createSupabaseAdminClient()
    const { error: deleteError } = await admin
      .from("connected_accounts")
      .delete()
      .eq("user_id", user.id)
      .eq("platform", body.platform)

    if (deleteError) throw deleteError
    return NextResponse.json({ ok: true })
  } catch (error) {
    return apiError(error, "Unable to disconnect platform.")
  }
}
