import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createOAuthState } from "@/lib/oauth/state"
import { getDiscordAuthorizeUrl } from "@/features/integrations/discord/discordOAuth"
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

    const state = await createOAuthState("discord", user.id)
    return NextResponse.redirect(getDiscordAuthorizeUrl(state))
  } catch (error) {
    const url = new URL("/", getAppUrl())
    url.searchParams.set("integration_error", error instanceof Error ? error.message : "Unable to start Discord OAuth.")
    return NextResponse.redirect(url)
  }
}
