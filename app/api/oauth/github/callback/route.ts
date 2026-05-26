import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { getAppUrl } from "@/lib/env"
import { verifyOAuthState } from "@/lib/oauth/state"
import { exchangeGitHubCode } from "@/features/integrations/github/githubOAuth"
import { fetchGitHubAccountData } from "@/features/integrations/github/githubApi"
import { mapGitHubAccountForStorage } from "@/features/integrations/github/githubMapper"

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
    if (!code) throw new Error("Missing GitHub authorization code.")

    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) return dashboardRedirect({ integration_error: "not_authenticated" })

    await verifyOAuthState("github", state, user.id)

    const token = await exchangeGitHubCode(code)
    const accountData = await fetchGitHubAccountData(token.access_token)
    const row = mapGitHubAccountForStorage(user.id, token, accountData)
    const admin = createSupabaseAdminClient()

    const { error: upsertError } = await admin
      .from("connected_accounts")
      .upsert(row, { onConflict: "user_id,platform" })

    if (upsertError) throw upsertError

    return dashboardRedirect({ connected: "github" })
  } catch (error) {
    const message = error instanceof Error ? error.message : "GitHub connection failed."
    return dashboardRedirect({ integration_error: message })
  }
}
