import { NextRequest, NextResponse } from "next/server"
import { requireAuthenticatedUser } from "@/lib/api/auth"
import { apiError } from "@/lib/api/errors"
import { updateSectionVisibility } from "@/features/passport/passportService"
import { isVisibilityState } from "@/features/passport/privacyService"

export const dynamic = "force-dynamic"

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const sectionId = typeof body.sectionId === "string" ? body.sectionId : ""
    const visibility = body.visibility

    if (!sectionId) throw new Error("Missing section id.")
    if (!isVisibilityState(visibility)) throw new Error("Invalid visibility value.")

    const user = await requireAuthenticatedUser()
    const section = await updateSectionVisibility(user.id, sectionId, visibility)
    return NextResponse.json({ section })
  } catch (error) {
    return apiError(error, "Unable to update visibility.")
  }
}
