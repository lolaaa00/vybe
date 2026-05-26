import { describe, expect, it } from "vitest"
import { normalizeHandle, validateHandle } from "@/lib/validation/handle"

describe("handle validation", () => {
  it("normalizes handles to lowercase", () => {
    expect(normalizeHandle("  Alex_River-01  ")).toBe("alex_river-01")
  })

  it("accepts valid handles", () => {
    expect(validateHandle("alex_river-01")).toEqual({ ok: true, handle: "alex_river-01" })
  })

  it("rejects spaces and uppercase after normalization rules are applied", () => {
    expect(validateHandle("alex river").ok).toBe(false)
  })

  it("rejects reserved handles", () => {
    expect(validateHandle("passport").ok).toBe(false)
  })

  it("rejects too-short handles", () => {
    expect(validateHandle("ab").ok).toBe(false)
  })
})
