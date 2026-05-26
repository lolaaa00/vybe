import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { validateHandle } from "@/lib/validation/handle"
import { PassportSection, Profile, PublicPassport, PublicPassportData } from "@/types"
import { publicSectionsOnly, shapePublicSection } from "@/features/passport/privacyService"

export async function getPublicPassport(handleOrSlug: string): Promise<PublicPassportData | null> {
  const validated = validateHandle(handleOrSlug)
  if (!validated.ok) return null

  const admin = createSupabaseAdminClient()
  const { data: publicPassport, error: publicPassportError } = await admin
    .from("public_passports")
    .select("*")
    .or(`handle.eq.${validated.handle},slug.eq.${validated.handle}`)
    .eq("is_public", true)
    .maybeSingle()

  if (publicPassportError) throw publicPassportError
  if (!publicPassport) return null

  const [{ data: profile, error: profileError }, { data: sections, error: sectionsError }] =
    await Promise.all([
      admin
        .from("profiles")
        .select("display_name, handle, avatar_url, bio")
        .eq("id", (publicPassport as PublicPassport).user_id)
        .maybeSingle(),
      admin
        .from("passport_sections")
        .select("*")
        .eq("user_id", (publicPassport as PublicPassport).user_id)
        .eq("visibility", "public")
        .order("created_at", { ascending: true }),
    ])

  if (profileError) throw profileError
  if (sectionsError) throw sectionsError
  if (!profile) return null

  const publicSections = publicSectionsOnly((sections || []) as PassportSection[]).map(shapePublicSection)

  return {
    profile: profile as Pick<Profile, "display_name" | "handle" | "avatar_url" | "bio">,
    publicPassport: {
      handle: (publicPassport as PublicPassport).handle,
      slug: (publicPassport as PublicPassport).slug,
      is_public: true,
    },
    sections: publicSections,
  }
}
