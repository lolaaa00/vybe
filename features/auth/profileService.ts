import { User } from "@supabase/supabase-js"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { handleFromIdentity, validateHandle } from "@/lib/validation/handle"
import { Profile } from "@/types"

function metadataValue(user: User, key: string): string | null {
  const value = user.user_metadata?.[key]
  return typeof value === "string" && value.trim() ? value : null
}

export function profileFromUser(user: User): Omit<Profile, "created_at" | "updated_at"> {
  return {
    id: user.id,
    email: user.email ?? null,
    display_name:
      metadataValue(user, "full_name") ||
      metadataValue(user, "name") ||
      user.email?.split("@")[0] ||
      null,
    handle: null,
    avatar_url:
      metadataValue(user, "avatar_url") ||
      metadataValue(user, "picture") ||
      null,
    bio: null,
  }
}

export async function ensureProfileForUser(user: User): Promise<Profile> {
  const admin = createSupabaseAdminClient()
  const baseProfile = profileFromUser(user)

  const { data: existing, error: existingError } = await admin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  if (existingError) throw existingError
  if (existing) return existing as Profile

  const { data, error } = await admin
    .from("profiles")
    .insert(baseProfile)
    .select("*")
    .single()

  if (error) throw error
  return data as Profile
}

export async function setProfileHandle(userId: string, input: string): Promise<Profile> {
  const validated = validateHandle(input)
  if (!validated.ok) throw new Error(validated.error)

  const admin = createSupabaseAdminClient()

  const { data: existing, error: existingError } = await admin
    .from("profiles")
    .select("id")
    .ilike("handle", validated.handle)
    .neq("id", userId)
    .maybeSingle()

  if (existingError) throw existingError
  if (existing) throw new Error("That handle is already taken.")

  const { data, error } = await admin
    .from("profiles")
    .update({ handle: validated.handle })
    .eq("id", userId)
    .select("*")
    .single()

  if (error) throw error

  await upsertPublicPassportForProfile(data as Profile)
  return data as Profile
}

export async function suggestHandleForUser(user: User): Promise<string> {
  const admin = createSupabaseAdminClient()
  const base = handleFromIdentity(
    metadataValue(user, "full_name") || metadataValue(user, "name"),
    user.email
  )

  for (let i = 0; i < 20; i++) {
    const candidate = i === 0 ? base : `${base.slice(0, 20)}-${i + 1}`
    const validated = validateHandle(candidate)
    if (!validated.ok) continue

    const { data, error } = await admin
      .from("profiles")
      .select("id")
      .ilike("handle", validated.handle)
      .maybeSingle()

    if (error) throw error
    if (!data) return validated.handle
  }

  return `vybe-${user.id.slice(0, 8)}`
}

export async function upsertPublicPassportForProfile(profile: Profile) {
  if (!profile.handle) return null

  const admin = createSupabaseAdminClient()
  const { data, error } = await admin
    .from("public_passports")
    .upsert(
      {
        user_id: profile.id,
        handle: profile.handle,
        slug: profile.handle,
      },
      { onConflict: "user_id" }
    )
    .select("*")
    .single()

  if (error) throw error
  return data
}
