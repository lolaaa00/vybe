import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { getAppUrl } from "@/lib/env"
import { verifyOAuthState } from "@/lib/oauth/state"
import { exchangeSpotifyCode } from "@/features/integrations/spotify/spotifyOAuth"
import { fetchSpotifyAccountData } from "@/features/integrations/spotify/spotifyApi"
import { mapSpotifyAccountForStorage } from "@/features/integrations/spotify/spotifyMapper"

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
    if (!code) throw new Error("Missing Spotify authorization code.")

    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) return dashboardRedirect({ integration_error: "not_authenticated" })

    await verifyOAuthState("spotify", state, user.id)

    const token = await exchangeSpotifyCode(code)
    const accountData = await fetchSpotifyAccountData(token.access_token)
    const row = mapSpotifyAccountForStorage(user.id, token, accountData)
    const admin = createSupabaseAdminClient()

    const { error: upsertError } = await admin
      .from("connected_accounts")
      .upsert(row, { onConflict: "user_id,platform" })

    if (upsertError) throw upsertError

    return dashboardRedirect({ connected: "spotify" })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Spotify connection failed."
    return dashboardRedirect({ integration_error: message })
  }
}
