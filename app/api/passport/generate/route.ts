import { NextResponse } from "next/server"
import { requireAuthenticatedUser } from "@/lib/api/auth"
import { apiError } from "@/lib/api/errors"
import { generatePassportForUser, loadOwnerDashboardData } from "@/features/passport/passportService"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    const user = await requireAuthenticatedUser()
    await generatePassportForUser(user.id)
    const dashboard = await loadOwnerDashboardData(user.id)
    return NextResponse.json(dashboard)
  } catch (error) {
    return apiError(error, "Unable to generate passport.")
  }
}
