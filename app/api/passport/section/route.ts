import { NextRequest, NextResponse } from "next/server"
import { requireAuthenticatedUser } from "@/lib/api/auth"
import { apiError } from "@/lib/api/errors"
import { deletePassportSection } from "@/features/passport/passportService"

export const dynamic = "force-dynamic"

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const sectionId = typeof body.sectionId === "string" ? body.sectionId : ""
    if (!sectionId) throw new Error("Missing section id.")

    const user = await requireAuthenticatedUser()
    await deletePassportSection(user.id, sectionId)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return apiError(error, "Unable to delete passport section.")
  }
}
