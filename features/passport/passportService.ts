import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { ConnectedAccountSummary, PassportSection, Profile, PublicPassport, VisibilityState } from "@/types"
import { generatePassportSectionsFromAccounts } from "@/features/passport/passportGenerator"
import { StoredConnectedAccount } from "@/features/passport/passportTypes"
import { isVisibilityState } from "@/features/passport/privacyService"
import { upsertPublicPassportForProfile } from "@/features/auth/profileService"

export async function loadOwnerDashboardData(userId: string) {
  const admin = createSupabaseAdminClient()

  const [
    { data: profile, error: profileError },
    { data: accounts, error: accountsError },
    { data: sections, error: sectionsError },
    { data: publicPassport, error: publicPassportError },
  ] = await Promise.all([
    admin.from("profiles").select("*").eq("id", userId).single(),
    admin
      .from("connected_accounts")
      .select("id, platform, platform_user_id, username, display_name, avatar_url, scopes, connected_at, updated_at")
      .eq("user_id", userId)
      .order("connected_at", { ascending: true }),
    admin
      .from("passport_sections")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true }),
    admin.from("public_passports").select("*").eq("user_id", userId).maybeSingle(),
  ])

  if (profileError) throw profileError
  if (accountsError) throw accountsError
  if (sectionsError) throw sectionsError
  if (publicPassportError) throw publicPassportError

  return {
    profile: profile as Profile,
    connectedAccounts: (accounts || []) as ConnectedAccountSummary[],
    sections: (sections || []) as PassportSection[],
    publicPassport: publicPassport as PublicPassport | null,
  }
}

export async function generatePassportForUser(userId: string) {
  const admin = createSupabaseAdminClient()
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (profileError) throw profileError
  if (!(profile as Profile).handle) {
    throw new Error("Choose a Vybe handle before generating your passport.")
  }

  const { data: accounts, error: accountsError } = await admin
    .from("connected_accounts")
    .select("*")
    .eq("user_id", userId)
    .order("connected_at", { ascending: true })

  if (accountsError) throw accountsError

  const connectedAccounts = (accounts || []) as StoredConnectedAccount[]
  if (connectedAccounts.length === 0) {
    throw new Error("Connect GitHub or Spotify before generating your passport.")
  }

  const generated = generatePassportSectionsFromAccounts(connectedAccounts)
  if (generated.length === 0) {
    throw new Error("No usable connected account data was found.")
  }

  const inputPlatforms = Array.from(new Set(connectedAccounts.map((account) => account.platform)))
  await admin.from("passport_generation_logs").insert({
    user_id: userId,
    input_platforms: inputPlatforms,
    generated_sections: [],
    status: "started",
  })

  const sectionTypes = generated.map((section) => section.section_type)
  const { error: deleteError } = await admin
    .from("passport_sections")
    .delete()
    .eq("user_id", userId)
    .in("section_type", sectionTypes)

  if (deleteError) throw deleteError

  const rows = generated.map((section) => ({
    user_id: userId,
    ...section,
  }))

  const { data: inserted, error: insertError } = await admin
    .from("passport_sections")
    .insert(rows)
    .select("*")
    .order("created_at", { ascending: true })

  if (insertError) {
    await admin.from("passport_generation_logs").insert({
      user_id: userId,
      input_platforms: inputPlatforms,
      generated_sections: generated,
      status: "failed",
      error_message: insertError.message,
    })
    throw insertError
  }

  await upsertPublicPassportForProfile(profile as Profile)
  await admin.from("passport_generation_logs").insert({
    user_id: userId,
    input_platforms: inputPlatforms,
    generated_sections: inserted || [],
    status: "completed",
  })

  return inserted as PassportSection[]
}

export async function updateSectionVisibility(
  userId: string,
  sectionId: string,
  visibility: VisibilityState
) {
  if (!isVisibilityState(visibility)) throw new Error("Invalid visibility value.")

  const admin = createSupabaseAdminClient()
  const { data, error } = await admin
    .from("passport_sections")
    .update({ visibility })
    .eq("id", sectionId)
    .eq("user_id", userId)
    .select("*")
    .single()

  if (error) throw error
  return data as PassportSection
}

export async function deletePassportSection(userId: string, sectionId: string) {
  const admin = createSupabaseAdminClient()
  const { error } = await admin
    .from("passport_sections")
    .delete()
    .eq("id", sectionId)
    .eq("user_id", userId)

  if (error) throw error
}

export async function setPublicPassportStatus(userId: string, isPublic: boolean) {
  const admin = createSupabaseAdminClient()
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (profileError) throw profileError
  if (!(profile as Profile).handle) throw new Error("Choose a handle before enabling public sharing.")

  await upsertPublicPassportForProfile(profile as Profile)

  const { data, error } = await admin
    .from("public_passports")
    .update({ is_public: isPublic, handle: (profile as Profile).handle, slug: (profile as Profile).handle })
    .eq("user_id", userId)
    .select("*")
    .single()

  if (error) throw error
  return data as PublicPassport
}
