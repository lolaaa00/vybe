import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createOAuthPkce, createOAuthState } from "@/lib/oauth/state"
import { getXAuthorizeUrl } from "@/features/integrations/x/xOAuth"
import { getAppUrl } from "@/lib/env"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) throw error
    if (!user) return NextResponse.redirect(new URL("/?auth=required", getAppUrl()))

    const state = await createOAuthState("x", user.id)
    const { challenge } = await createOAuthPkce("x")
    return NextResponse.redirect(getXAuthorizeUrl(state, challenge))
  } catch (error) {
    const url = new URL("/", getAppUrl())
    url.searchParams.set("integration_error", error instanceof Error ? error.message : "Unable to start X OAuth.")
    return NextResponse.redirect(url)
  }
}
