// lib/download-token.ts
import crypto from "crypto";

const SECRET = process.env.DOWNLOAD_SECRET;

type Payload = { pid: number; exp: number };

export function signDownloadToken(payload: Payload) {
  if (!SECRET) throw new Error("[download-token] Missing env DOWNLOAD_SECRET");
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyDownloadToken(token: string): Payload | null {
  if (!SECRET) throw new Error("[download-token] Missing env DOWNLOAD_SECRET");
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  const expected = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  // timing-safe compare
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as Payload;
  if (Date.now() > payload.exp) return null;
  return payload;
}
