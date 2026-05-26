import crypto from "crypto"
import { cookies } from "next/headers"
import { requireServerEnv } from "@/lib/env"
import { Platform } from "@/types"

const COOKIE_PREFIX = "vybe_oauth_state_"
const PKCE_COOKIE_PREFIX = "vybe_oauth_pkce_"

function signingSecret() {
  return requireServerEnv("SUPABASE_SERVICE_ROLE_KEY")
}

function sign(payload: string) {
  return crypto.createHmac("sha256", signingSecret()).update(payload).digest("base64url")
}

export async function createOAuthState(platform: Platform, userId: string) {
  const payload = Buffer.from(
    JSON.stringify({
      platform,
      userId,
      nonce: crypto.randomBytes(16).toString("base64url"),
      createdAt: Date.now(),
    })
  ).toString("base64url")

  const state = `${payload}.${sign(payload)}`
  const cookieStore = await cookies()
  cookieStore.set(`${COOKIE_PREFIX}${platform}`, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60,
    path: "/",
  })
  return state
}

export async function verifyOAuthState(platform: Platform, state: string | null, userId: string) {
  if (!state) throw new Error("Missing OAuth state.")

  const cookieName = `${COOKIE_PREFIX}${platform}`
  const cookieStore = await cookies()
  const expected = cookieStore.get(cookieName)?.value
  cookieStore.delete(cookieName)

  if (!expected || expected !== state) {
    throw new Error("OAuth state verification failed.")
  }

  const [payload, signature] = state.split(".")
  if (!payload || !signature || sign(payload) !== signature) {
    throw new Error("OAuth state signature is invalid.")
  }

  const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))
  if (parsed.platform !== platform || parsed.userId !== userId) {
    throw new Error("OAuth state user mismatch.")
  }

  if (Date.now() - parsed.createdAt > 10 * 60 * 1000) {
    throw new Error("OAuth state expired.")
  }
}

export async function createOAuthPkce(platform: Platform) {
  const verifier = crypto.randomBytes(32).toString("base64url")
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url")
  const cookieStore = await cookies()

  cookieStore.set(`${PKCE_COOKIE_PREFIX}${platform}`, verifier, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60,
    path: "/",
  })

  return { verifier, challenge }
}

export async function consumeOAuthPkceVerifier(platform: Platform) {
  const cookieName = `${PKCE_COOKIE_PREFIX}${platform}`
  const cookieStore = await cookies()
  const verifier = cookieStore.get(cookieName)?.value
  cookieStore.delete(cookieName)

  if (!verifier) {
    throw new Error("Missing OAuth PKCE verifier.")
  }

  return verifier
}
