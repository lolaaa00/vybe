import crypto from "crypto"
import { requireServerEnv } from "@/lib/env"

const VERSION = "v1"

function getKey() {
  const secret = requireServerEnv("TOKEN_ENCRYPTION_KEY")
  return crypto.createHash("sha256").update(secret).digest()
}

export function encryptToken(token: string): string {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv)
  const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  return [VERSION, iv.toString("base64url"), tag.toString("base64url"), encrypted.toString("base64url")].join(":")
}

export function decryptToken(payload: string): string {
  const [version, iv, tag, encrypted] = payload.split(":")
  if (version !== VERSION || !iv || !tag || !encrypted) {
    throw new Error("Unsupported token payload.")
  }

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    getKey(),
    Buffer.from(iv, "base64url")
  )
  decipher.setAuthTag(Buffer.from(tag, "base64url"))
  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, "base64url")),
    decipher.final(),
  ]).toString("utf8")
}
