// app/api/download/route.ts
import fs from "node:fs/promises";
import path from "node:path";
import type { NextRequest } from "next/server";
import Stripe from "stripe";
import { verifyDownloadToken } from "@/lib/download-token";
import { products } from "@/data/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VERCEL_ENV = process.env.VERCEL_ENV || "";
const IS_PROD_DEPLOY = VERCEL_ENV === "production";

/* ---------- helpers ---------- */
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function guessMime(p: string): string {
  switch (path.extname(p).toLowerCase()) {
    case ".pdf": return "application/pdf";
    case ".zip": return "application/zip";
    case ".docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case ".xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case ".csv": return "text/csv";
    case ".txt": return "text/plain; charset=utf-8";
    case ".png": return "image/png";
    case ".jpg":
    case ".jpeg": return "image/jpeg";
    case ".webp": return "image/webp";
    default: return "application/octet-stream";
  }
}

function contentDisposition(filename: string) {
  const ascii = filename.replace(/[/\\]/g, "_");
  const encoded = encodeURIComponent(filename).replace(/'/g, "%27");
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function resolveProductDownloadPath(pid: number): Promise<string | null> {
  const byId = new Map<number, any>();
  for (const p of products as any[]) {
    if (p?.id != null) byId.set(Number(p.id), p);
  }
  const product = byId.get(pid);
  return product?.downloadPath ?? null;
}

async function streamFileFromPrivate(rel: string) {
  const FILE_ROOT = path.join(process.cwd(), "private");
  const safeRel = rel.replace(/^[/\\]+/, "");
  const absPath = path.join(FILE_ROOT, safeRel);
  const resolved = path.resolve(absPath);
  if (!resolved.startsWith(FILE_ROOT)) return json({ error: "invalid_path" }, 400);

  const stat = await fs.stat(resolved).catch(() => null);
  if (!stat || !stat.isFile()) return json({ error: "file_not_found" }, 404);

  const buf = await fs.readFile(resolved);

  // copy to guaranteed ArrayBuffer
  const ab = new ArrayBuffer(buf.byteLength);
  new Uint8Array(ab).set(buf);

  const mime = guessMime(resolved);
  const filename = path.basename(resolved);

  const headers = new Headers({
    "Content-Type": mime,
    "Content-Length": String(buf.byteLength),
    "Content-Disposition": contentDisposition(filename),
    "Cache-Control": "private, max-age=0, must-revalidate",
    "X-Content-Type-Options": "nosniff",
  });

  return new Response(ab, { headers, status: 200 });
}

function getStripe(): Stripe {
  const raw = process.env.STRIPE_SECRET_KEY ?? "";
  const key = raw.trim();
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  if (IS_PROD_DEPLOY && key.startsWith("sk_test_")) {
    throw new Error("STRIPE_SECRET_KEY is test on a production deploy.");
  }
  return new Stripe(key);
}

/* ---------- main handler ---------- */
async function handleDownload(req: NextRequest) {
  try {
    const url = new URL(req.url);

    // 1) Preferred: token-based (fast, no Stripe roundtrip)
    const token = url.searchParams.get("token");
    if (token) {
      const payload = verifyDownloadToken(token) as unknown as {
        pid?: number | string;
        path?: string;
        downloadPath?: string;
      };

      const pid = payload?.pid != null ? Number(payload.pid) : NaN;
      const explicit = payload?.path || payload?.downloadPath || null;

      let rel: string | null = explicit ?? null;
      if (!rel) {
        if (!Number.isFinite(pid)) return json({ error: "invalid_product" }, 400);
        rel = await resolveProductDownloadPath(pid);
        if (!rel) return json({ error: "no_download_for_product" }, 404);
      }

      return streamFileFromPrivate(rel);
    }

    // 2) Back-compat fallback: verify Stripe session & product
    const order = url.searchParams.get("order");
    const productId = Number(url.searchParams.get("productId") || 0);
    if (order && productId) {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(order);

      const paid =
        session.payment_status === "paid" ||
        session.status === "complete" ||
        session.status === "paid";
      if (!paid) return json({ error: "unauthorized" }, 403);

      // if our metadata exists, ensure product matches (single-item assumption)
      if (
        session.metadata?.kind === "product" &&
        session.metadata?.productId &&
        String(session.metadata.productId) !== String(productId)
      ) {
        return json({ error: "mismatched_product" }, 403);
      }

      const rel = await resolveProductDownloadPath(productId);
      if (!rel) return json({ error: "no_download_for_product" }, 404);

      return streamFileFromPrivate(rel);
    }

    // If neither provided:
    return json({ error: "missing_token_or_order" }, 400);
  } catch (err) {
    console.error("[download] error:", err);
    return json({ error: "download_error" }, 500);
  }
}

export async function GET(req: NextRequest) {
  return handleDownload(req);
}

export async function HEAD(req: NextRequest) {
  const res = await handleDownload(req);
  if (!res.body) return res;
  return new Response(null, { status: res.status, headers: res.headers });
}
