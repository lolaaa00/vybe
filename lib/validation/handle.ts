export const HANDLE_PATTERN = /^[a-z0-9_-]{3,24}$/

const RESERVED_HANDLES = new Set([
  "admin",
  "api",
  "app",
  "auth",
  "dashboard",
  "demo",
  "help",
  "login",
  "logout",
  "passport",
  "settings",
  "support",
  "vybe",
])

export function normalizeHandle(input: string): string {
  return input.trim().toLowerCase()
}

export function validateHandle(input: string): { ok: true; handle: string } | { ok: false; error: string } {
  const handle = normalizeHandle(input)

  if (!HANDLE_PATTERN.test(handle)) {
    return {
      ok: false,
      error: "Handle must be 3-24 characters and use only lowercase letters, numbers, underscores, or hyphens.",
    }
  }

  if (RESERVED_HANDLES.has(handle)) {
    return { ok: false, error: "That handle is reserved." }
  }

  return { ok: true, handle }
}

export function handleFromIdentity(displayName?: string | null, email?: string | null): string {
  const base =
    displayName ||
    email?.split("@")[0] ||
    "vybe-user"

  return normalizeHandle(base)
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "")
    .slice(0, 20) || "vybe-user"
}
