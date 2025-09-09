// lib/download-token.ts
import crypto from "crypto"

const SECRET = process.env.DOWNLOAD_SECRET!
if (!SECRET) {
  // Fail early in dev so it's obvious
  console.warn("[download-token] Missing env DOWNLOAD_SECRET")
}

export type DownloadPayload = { pid: number; exp: number } // pid = product id

export function signDownloadToken(payload: DownloadPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url")
  const sig = crypto.createHmac("sha256", SECRET).update(body).digest("base64url")
  return `${body}.${sig}`
}

export function verifyDownloadToken(token: string): DownloadPayload | null {
  const [body, sig] = token.split(".")
  if (!body || !sig) return null
  const expected = crypto.createHmac("sha256", SECRET).update(body).digest("base64url")
  // timing safe compare
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
  const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as DownloadPayload
  if (Date.now() > payload.exp) return null
  return payload
}
