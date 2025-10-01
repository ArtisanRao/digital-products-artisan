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

  // Extend as needed (email/order/etc.)
};

const ALG = "sha256";
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(explicit?: string) {
  const s = explicit ?? process.env.DOWNLOAD_TOKEN_SECRET;
  if (!s) throw new Error("Missing env DOWNLOAD_TOKEN_SECRET");
  return s;
}

/* ---------- base64url helpers (RFC 4648 §5) ---------- */
function toBase64Url(b64: string) {
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function fromBase64Url(b64url: string) {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  // pad to multiple of 4
  const pad = b64.length % 4 ? 4 - (b64.length % 4) : 0;
  return b64 + "=".repeat(pad);
}

function b64urlEncode(obj: unknown) {
  const json = JSON.stringify(obj);
  const b64 = Buffer.from(json, "utf8").toString("base64");
  return toBase64Url(b64);
}
function b64urlDecode<T = unknown>(b64url: string): T {
  const b64 = fromBase64Url(b64url);
  const json = Buffer.from(b64, "base64").toString("utf8");
  return JSON.parse(json) as T;
}

function sign(bodyB64url: string, secret: string) {
  // sign the *base64url* string, but digest in base64 then convert to base64url
  const mac = crypto.createHmac(ALG, secret).update(bodyB64url).digest("base64");
  return toBase64Url(mac);
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
    exp: (payload as any).exp ?? now + ttlSec,
  };

  if (!body.pid && !body.path && !body.downloadPath) {
    throw new Error("download_token_missing_target");
  }

  const bodyB64url = b64urlEncode(body);
  const sigB64url = sign(bodyB64url, key);
  return `${bodyB64url}.${sigB64url}`;
}

/** Verify token. Returns a valid payload or throws on error. */
export function verifyDownloadToken(token: string, secret?: string): DownloadTokenPayload {
  const key = getSecret(secret);
  const [bodyB64url, sigB64url] = (token || "").split(".");
  if (!bodyB64url || !sigB64url) throw new Error("bad_token");

  const expected = sign(bodyB64url, key);
  const a = Buffer.from(sigB64url, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new Error("bad_sig");

  const payload = b64urlDecode<DownloadTokenPayload>(bodyB64url);
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
