import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createOAuthState } from "@/lib/oauth/state"
import { getGitHubAuthorizeUrl } from "@/features/integrations/github/githubOAuth"
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

    const state = await createOAuthState("github", user.id)
    return NextResponse.redirect(getGitHubAuthorizeUrl(state))
  } catch (error) {
    const url = new URL("/", getAppUrl())
    url.searchParams.set("integration_error", error instanceof Error ? error.message : "Unable to start GitHub OAuth.")
    return NextResponse.redirect(url)
  }
}
