import { NextResponse } from "next/server"
import { isSetupError } from "@/lib/env"

export function apiError(error: unknown, fallback = "Something went wrong") {
  if (isSetupError(error)) {
    return NextResponse.json({ error: error.message, code: "setup_error" }, { status: 503 })
  }

  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ error: fallback }, { status: 400 })
}
