import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { apiError } from "@/lib/api/errors"
import { setProfileHandle } from "@/features/auth/profileService"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const handle = typeof body.handle === "string" ? body.handle : ""

    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) throw error
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 })
    }

    const profile = await setProfileHandle(user.id, handle)
    return NextResponse.json({ profile })
  } catch (error) {
    return apiError(error, "Unable to save handle.")
  }
}
