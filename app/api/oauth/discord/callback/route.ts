import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { getAppUrl } from "@/lib/env"
import { verifyOAuthState } from "@/lib/oauth/state"
import { exchangeDiscordCode } from "@/features/integrations/discord/discordOAuth"
import { fetchDiscordAccountData } from "@/features/integrations/discord/discordApi"
import { mapDiscordAccountForStorage } from "@/features/integrations/discord/discordMapper"

function dashboardRedirect(params: Record<string, string>) {
  const url = new URL("/", getAppUrl())
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value))
  return NextResponse.redirect(url)
}

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("code")
    const state = request.nextUrl.searchParams.get("state")
    const error = request.nextUrl.searchParams.get("error")

    if (error) return dashboardRedirect({ integration_error: error })
    if (!code) throw new Error("Missing Discord authorization code.")

    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) return dashboardRedirect({ integration_error: "not_authenticated" })

    await verifyOAuthState("discord", state, user.id)

    const token = await exchangeDiscordCode(code)
    const accountData = await fetchDiscordAccountData(token.access_token)
    const row = mapDiscordAccountForStorage(user.id, token, accountData)
    const admin = createSupabaseAdminClient()

    const { error: upsertError } = await admin
      .from("connected_accounts")
      .upsert(row, { onConflict: "user_id,platform" })

    if (upsertError) throw upsertError

    return dashboardRedirect({ connected: "discord" })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Discord connection failed."
    return dashboardRedirect({ integration_error: message })
  }
}
