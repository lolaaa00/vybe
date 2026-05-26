import { PassportSection, VisibilityState } from "@/types"

export const VISIBILITY_VALUES: VisibilityState[] = ["public", "private", "hidden"]

export function isVisibilityState(value: unknown): value is VisibilityState {
  return value === "public" || value === "private" || value === "hidden"
}

export function publicSectionsOnly(sections: PassportSection[]) {
  return sections.filter((section) => section.visibility === "public")
}

export function shapePublicSection(section: PassportSection): PassportSection {
  return {
    ...section,
    visibility: "public",
  }
}
