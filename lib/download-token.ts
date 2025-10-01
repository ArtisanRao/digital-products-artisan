// lib/download-token.ts
import crypto from "node:crypto";

/** Unified payload used by the download route. */
export type DownloadTokenPayload = {
  /** Optional: product id (resolved via data/products) */
  pid?: number | string;
  /** Optional: relative path under /private, e.g. "files/my.zip" */
  path?: string;
  /** Optional legacy alias; treated the same as `path` */
  downloadPath?: string;

  /** Issued-at (unix seconds) */
  iat: number;
  /** Expiry (unix seconds) */
  exp: number;

  // You can extend with user/email/order if needed
  // email?: string;
  // order?: string;
};

const ALG = "sha256";
const ENC: BufferEncoding = "base64url";
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(explicit?: string) {
  const s = explicit ?? process.env.DOWNLOAD_TOKEN_SECRET;
  if (!s) throw new Error("Missing env DOWNLOAD_TOKEN_SECRET");
  return s;
}

function b64urlEncode(obj: unknown) {
  return Buffer.from(JSON.stringify(obj), "utf8").toString(ENC);
}
function b64urlDecode<T = unknown>(b64: string): T {
  return JSON.parse(Buffer.from(b64, ENC).toString("utf8")) as T;
}

function sign(bodyB64: string, secret: string) {
  return crypto.createHmac(ALG, secret).update(bodyB64).digest(ENC);
}

export function signDownloadToken(
  payload: Partial<DownloadTokenPayload> & (
    | { path: string; pid?: number | string }
    | { downloadPath: string; pid?: number | string }
    | { pid: number | string; path?: string; downloadPath?: string }
  ),
  ttlSec: number = DEFAULT_TTL_SECONDS,
  secret?: string
): string {
  const key = getSecret(secret);
  const now = Math.floor(Date.now() / 1000);

  const body: DownloadTokenPayload = {
    pid: payload.pid,
    path: payload.path ?? payload.downloadPath,
    downloadPath: payload.downloadPath, // keep for backward compat
    iat: now,
    exp: (payload.exp as number) || now + ttlSec,
  };

  if (!body.pid && !body.path && !body.downloadPath) {
    throw new Error("download_token_missing_target");
  }

  const bodyB64 = b64urlEncode(body);
  const sig = sign(bodyB64, key);
  return `${bodyB64}.${sig}`;
}

/** Verify token. Returns a valid payload or throws on error. */
export function verifyDownloadToken(token: string, secret?: string): DownloadTokenPayload {
  const key = getSecret(secret);
  const [bodyB64, sig] = (token || "").split(".");
  if (!bodyB64 || !sig) throw new Error("bad_token");

  const expected = sign(bodyB64, key);
  // timing-safe compare
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error("bad_sig");

  const payload = b64urlDecode<DownloadTokenPayload>(bodyB64);
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== "number" || now > payload.exp) throw new Error("expired");

  return payload;
}

/** Convenience: create a token that targets a file path under /private */
export function signPathToken(path: string, ttlSec: number = DEFAULT_TTL_SECONDS, secret?: string) {
  return signDownloadToken({ path }, ttlSec, secret);
}

/** Convenience: create a token that targets a product id (resolved in the route) */
export function signPidToken(pid: number | string, ttlSec: number = DEFAULT_TTL_SECONDS, secret?: string) {
  return signDownloadToken({ pid }, ttlSec, secret);
}
