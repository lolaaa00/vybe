export class SetupError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "SetupError"
  }
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}

export function getPublicSupabaseEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  }
}

export function getMissingPublicSupabaseKeys(): string[] {
  const missing: string[] = []
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL")
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  return missing
}

export function requirePublicSupabaseEnv() {
  const env = getPublicSupabaseEnv()
  const missing = getMissingPublicSupabaseKeys()
  if (missing.length > 0) {
    throw new SetupError(`Supabase is not configured. Add ${missing.join(", ")}.`)
  }
  return env
}

export function requireServerEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new SetupError(`${name} is not configured.`)
  }
  return value
}

export function getOptionalServerEnv(name: string): string | null {
  return process.env[name] || null
}

export function isSetupError(error: unknown): error is SetupError {
  return error instanceof SetupError
}
