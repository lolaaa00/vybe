import { describe, expect, it } from "vitest"
import { isVisibilityState, publicSectionsOnly } from "@/features/passport/privacyService"
import { PassportSection } from "@/types"

function section(id: string, visibility: PassportSection["visibility"]): PassportSection {
  return {
    id,
    user_id: "user-1",
    section_type: "proof_of_builder",
    title: "Proof",
    summary: "Summary",
    data_json: {},
    visibility,
    source_platforms: ["github"],
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  }
}

describe("privacy filtering", () => {
  it("accepts only supported visibility values", () => {
    expect(isVisibilityState("public")).toBe(true)
    expect(isVisibilityState("private")).toBe(true)
    expect(isVisibilityState("hidden")).toBe(true)
    expect(isVisibilityState("selective")).toBe(false)
  })

  it("only returns public sections for public responses", () => {
    const sections = [
      section("public-section", "public"),
      section("private-section", "private"),
      section("hidden-section", "hidden"),
    ]

    expect(publicSectionsOnly(sections).map((item) => item.id)).toEqual(["public-section"])
  })
})
