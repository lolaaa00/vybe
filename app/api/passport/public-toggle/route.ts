import { NextRequest, NextResponse } from "next/server"
import { requireAuthenticatedUser } from "@/lib/api/auth"
import { apiError } from "@/lib/api/errors"
import { setPublicPassportStatus } from "@/features/passport/passportService"

export const dynamic = "force-dynamic"

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    if (typeof body.isPublic !== "boolean") {
      throw new Error("Missing public status.")
    }

    const user = await requireAuthenticatedUser()
    const publicPassport = await setPublicPassportStatus(user.id, body.isPublic)
    return NextResponse.json({ publicPassport })
  } catch (error) {
    return apiError(error, "Unable to update public sharing.")
  }
}
