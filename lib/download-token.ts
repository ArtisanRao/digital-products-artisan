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
};

const ALG = "sha256";
export const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

/** Returns [primary, ...fallbacks] for secret rotation. */
function getSecrets(explicit?: string | string[]): string[] {
  if (Array.isArray(explicit)) {
    const list = explicit.filter(Boolean).map((s) => s.trim()).filter(Boolean);
    if (!list.length) throw new Error("Missing download token secret(s)");
    return list;
  }
  if (typeof explicit === "string" && explicit.trim()) {
    return [explicit.trim()];
  }

  const main = (process.env.DOWNLOAD_TOKEN_SECRET || "").trim();
  const prevRaw = (process.env.DOWNLOAD_TOKEN_SECRET_PREV || "").trim();

  if (!main) throw new Error("Missing env DOWNLOAD_TOKEN_SECRET");

  // You can set DOWNLOAD_TOKEN_SECRET_PREV as a single value or comma-separated list
  const prev = prevRaw
    ? prevRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return [main, ...prev];
}

/* ---------- base64url helpers (RFC 4648 §5) ---------- */
function toBase64Url(b64: string) {
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function fromBase64Url(b64url: string) {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
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

function hmacB64url(bodyB64url: string, secret: string) {
  // Sign the *base64url* body string, output base64, then convert to base64url
  const mac = crypto.createHmac(ALG, secret).update(bodyB64url).digest("base64");
  return toBase64Url(mac);
}

/** Constant-time compare on the decoded MAC bytes (not the ascii string). */
function safeEqualB64url(aB64url: string, bB64url: string) {
  const a = Buffer.from(fromBase64Url(aB64url), "base64");
  const b = Buffer.from(fromBase64Url(bB64url), "base64");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function signDownloadToken(
  payload: Partial<DownloadTokenPayload> &
    (
      | { path: string; pid?: number | string }
      | { downloadPath: string; pid?: number | string }
      | { pid: number | string; path?: string; downloadPath?: string }
    ),
  ttlSec: number = DEFAULT_TTL_SECONDS,
  secret?: string
): string {
  const [primary] = getSecrets(secret);
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
  const sigB64url = hmacB64url(bodyB64url, primary);
  return `${bodyB64url}.${sigB64url}`;
}

/**
 * Verify token. Returns a valid payload or throws on error.
 * Accepts a single secret string or an array (primary + old) for rotation.
 */
export function verifyDownloadToken(
  token: string,
  secret?: string | string[]
): DownloadTokenPayload {
  const secrets = getSecrets(secret);
  const [bodyB64url, sigB64url] = (token || "").split(".");
  if (!bodyB64url || !sigB64url) throw new Error("bad_token");

  // Try all configured secrets (rotation support)
  let valid = false;
  for (const key of secrets) {
    const expectedSig = hmacB64url(bodyB64url, key);
    if (safeEqualB64url(sigB64url, expectedSig)) {
      valid = true;
      break;
    }
  }
  if (!valid) throw new Error("bad_sig");

  const payload = b64urlDecode<DownloadTokenPayload>(bodyB64url);
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== "number" || now > payload.exp) throw new Error("expired");

  return payload;
}

/** Convenience: create a token that targets a file path under /private */
export function signPathToken(
  path: string,
  ttlSec: number = DEFAULT_TTL_SECONDS,
  secret?: string
) {
  return signDownloadToken({ path }, ttlSec, secret);
}

/** Convenience: create a token that targets a product id (resolved in the route) */
export function signPidToken(
  pid: number | string,
  ttlSec: number = DEFAULT_TTL_SECONDS,
  secret?: string
) {
  return signDownloadToken({ pid }, ttlSec, secret);
}

/** Optional helper to build a full href to /api/download */
export function buildDownloadUrl(token: string, base = "") {
  const prefix = base.replace(/\/+$/, "");
  return `${prefix}/api/download?token=${encodeURIComponent(token)}`;
}
