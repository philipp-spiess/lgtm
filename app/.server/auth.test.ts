import { describe, expect, it } from "vitest"
import { isAllowed } from "./auth"

describe("isAllowed", () => {
  it("should return true if user is allowed", () => {
    const user = {
      ghUsername: "philipp-spiess",
    }
    expect(isAllowed(user)).toBe(true)
  })
  it("should return false if user is not allowed", () => {
    const user = {
      ghUsername: "not-allowed",
    }
    expect(isAllowed(user)).toBe(false)
  })
})
