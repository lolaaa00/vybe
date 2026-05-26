import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { getAppUrl } from "@/lib/env"
import { consumeOAuthPkceVerifier, verifyOAuthState } from "@/lib/oauth/state"
import { exchangeXCode } from "@/features/integrations/x/xOAuth"
import { fetchXAccountData } from "@/features/integrations/x/xApi"
import { mapXAccountForStorage } from "@/features/integrations/x/xMapper"

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
    if (!code) throw new Error("Missing X authorization code.")

    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) return dashboardRedirect({ integration_error: "not_authenticated" })

    await verifyOAuthState("x", state, user.id)
    const codeVerifier = await consumeOAuthPkceVerifier("x")

    const token = await exchangeXCode(code, codeVerifier)
    const accountData = await fetchXAccountData(token.access_token)
    const row = mapXAccountForStorage(user.id, token, accountData)
    const admin = createSupabaseAdminClient()

    const { error: upsertError } = await admin
      .from("connected_accounts")
      .upsert(row, { onConflict: "user_id,platform" })

    if (upsertError) throw upsertError

    return dashboardRedirect({ connected: "x" })
  } catch (error) {
    const message = error instanceof Error ? error.message : "X connection failed."
    return dashboardRedirect({ integration_error: message })
  }
}
