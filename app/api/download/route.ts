// app/api/download/route.ts
import fs from "node:fs/promises";
import path from "node:path";
import type { NextRequest } from "next/server";
import Stripe from "stripe";
import { verifyDownloadToken } from "@/lib/download-token";
import { products } from "@/data/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ---------------- utilities ---------------- */
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

/** Build quick lookup maps from the current products array. */
function buildProductIndexes() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const byId = new Map<number, any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bySlug = new Map<string, any>();
  for (const p of products as any[]) {
    if (!p) continue;
    if (p.id != null) byId.set(Number(p.id), p);
    if (p.slug) bySlug.set(String(p.slug), p);
  }
  return { byId, bySlug };
}

/** Accepts numeric ID or slug; returns the configured downloadPath (relative to /private). */
function resolveDownloadPathFromPidOrSlug(pidOrSlug: number | string | null | undefined): string | null {
  const { byId, bySlug } = buildProductIndexes();
  if (pidOrSlug == null) return null;

  // numeric ID?
  const num = typeof pidOrSlug === "string" ? Number(pidOrSlug) : pidOrSlug;
  if (Number.isFinite(num)) {
    const p = byId.get(Number(num));
    return p?.downloadPath ?? null;
  }

  // slug string?
  const s = String(pidOrSlug);
  const p = bySlug.get(s);
  return p?.downloadPath ?? null;
}

function getStripe(): Stripe | null {
  const key = (process.env.STRIPE_SECRET_KEY || "").trim();
  if (!key) return null;
  return new Stripe(key);
}

/* ---------------- core handler ---------------- */
async function handleDownload(req: NextRequest) {
  try {
    const url = new URL(req.url);

    // 1) Token is required for authorization. (Defense-in-depth: also supports Stripe order check.)
    const token = url.searchParams.get("token");
    if (!token) return json({ error: "missing_token" }, 400);

    // Token payload may include numeric id OR slug, or an explicit path
    const payload = verifyDownloadToken(token) as {
      pid?: number | string;      // numeric id OR slug
      slug?: string;              // optional slug alias
      path?: string;              // optional absolute-like "/files/..." (relative to /private)
      downloadPath?: string;      // optional "files/..."
    };

    // 2) Resolve the relative download path (priority: token.path|downloadPath → product.downloadPath)
    const explicit = payload?.path || payload?.downloadPath || null;
    let rel: string | null = explicit ?? null;

    if (!rel) {
      const pidOrSlug = (payload?.pid ?? payload?.slug) as string | number | undefined;
      rel = resolveDownloadPathFromPidOrSlug(pidOrSlug ?? null);
      if (!rel) return json({ error: "no_download_for_product" }, 404);
    }

    // 3) Optional: verify Stripe Checkout session if provided (?order=cs_xxx)
    const orderId = url.searchParams.get("order");
    if (orderId) {
      const stripe = getStripe();
      if (!stripe) return json({ error: "stripe_not_configured" }, 500);

      const session = await stripe.checkout.sessions.retrieve(orderId, { expand: ["line_items"] });

      // Consider "paid" or "no_payment_required" or a completed status as green lights
      const paid =
        session.payment_status === "paid" ||
        session.payment_status === "no_payment_required" ||
        session.status === "complete";

      if (!paid) return json({ error: "unauthorized" }, 403);

      // If token carried a concrete product identity, optionally cross-check against session metadata
      const tokenPid = payload?.pid;
      if (tokenPid != null && session.metadata?.productId) {
        const metaPidNum = Number(session.metadata.productId);
        const tokenPidNum = Number(tokenPid);
        // Only compare when both sides are numeric to avoid false negatives
        if (Number.isFinite(metaPidNum) && Number.isFinite(tokenPidNum) && metaPidNum !== tokenPidNum) {
          return json({ error: "mismatched_product" }, 403);
        }
      }
    }

    // 4) Sanitize and locate file under /private
    const FILE_ROOT = path.join(process.cwd(), "private"); // <-- Option B root
    // Support both "files/foo.pdf" and "/files/foo.pdf"
    const safeRel = String(rel).replace(/^[/\\]+/, "");
    const absPath = path.join(FILE_ROOT, safeRel);
    const resolved = path.resolve(absPath);

    // Ensure final path remains within /private
    if (!resolved.startsWith(FILE_ROOT)) return json({ error: "invalid_path" }, 400);

    const stat = await fs.stat(resolved).catch(() => null);
    if (!stat || !stat.isFile()) return json({ error: "file_not_found" }, 404);

    const mime = guessMime(resolved);
    const filename = path.basename(resolved);

    // HEAD: send headers only (no body)
    if (req.method === "HEAD") {
      const headers = new Headers({
        "Content-Type": mime,
        "Content-Length": String(stat.size),
        "Content-Disposition": contentDisposition(filename),
        "Cache-Control": "private, max-age=0, must-revalidate",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, nofollow",
      });
      return new Response(null, { headers, status: 200 });
    }

    // GET: read and return the file (buffered; switch to streaming if your files are huge)
    const buf = await fs.readFile(resolved);

    // Deep-copy to guaranteed ArrayBuffer (never SharedArrayBuffer)
    const ab = new ArrayBuffer(buf.byteLength);
    new Uint8Array(ab).set(buf);

    const headers = new Headers({
      "Content-Type": mime,
      "Content-Length": String(buf.byteLength),
      "Content-Disposition": contentDisposition(filename),
      "Cache-Control": "private, max-age=0, must-revalidate",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow",
    });

    return new Response(ab, { headers, status: 200 });
  } catch (err) {
    console.error("[download] error:", err);
    return json({ error: "download_error" }, 500);
  }
}

export async function GET(req: NextRequest) {
  return handleDownload(req);
}

export async function HEAD(req: NextRequest) {
  return handleDownload(req);
}
