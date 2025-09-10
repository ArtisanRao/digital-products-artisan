// lib/download-token.ts
import crypto from "crypto"

export type TokenPayload = {
  /** path to the file under /public or wherever your download route expects */
  p: string
  /** absolute unix ms timestamp when the token expires */
  exp: number
}

/** Resolve the secret from an explicit argument or env var */
function resolveSecret(explicit?: string) {
  const s = explicit ?? process.env.DOWNLOAD_SECRET
  if (!s) throw new Error("Missing DOWNLOAD_SECRET")
  return s
}

/**
 * Create a signed, expiring token. Accepts an optional `secret` so callers
 * can supply one explicitly (e.g., read once from env) or fall back to env.
 */
export function signDownloadToken(payload: TokenPayload, secret?: string): string {
  const key = resolveSecret(secret)
  const json = JSON.stringify(payload)
  const sig = crypto.createHmac("sha256", key).update(json).digest("base64url")
  const body = Buffer.from(json, "utf8").toString("base64url")
  return `${body}.${sig}`
}

/** Verify and parse a token. Returns null if invalid/expired. */
export function verifyDownloadToken(token: string, secret?: string): TokenPayload | null {
  try {
    const key = resolveSecret(secret)
    const [body, sig] = token.split(".")
    if (!body || !sig) return null

    const json = Buffer.from(body, "base64url").toString("utf8")
    const expected = crypto.createHmac("sha256", key).update(json).digest("base64url")
    // timing-safe compare
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null

    const payload = JSON.parse(json) as TokenPayload
    if (Date.now() > payload.exp) return null
    return payload
  } catch {
    return null
  }
}
