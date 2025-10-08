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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildProductIndexes(productsArr: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const byId = new Map<number, any>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bySlug = new Map<string, any>();
  for (const p of productsArr) {
    if (!p) continue;
    if (p.id != null) byId.set(Number(p.id), p);
    if (p.slug) bySlug.set(String(p.slug), p);
  }
  return { byId, bySlug };
}

/** Accepts numeric ID or slug; returns the product and its configured downloadPath. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolveProductFromPidOrSlug(pidOrSlug: number | string | null | undefined): { product: any | null, downloadPath: string | null } {
  const { byId, bySlug } = buildProductIndexes(products as any[]);
  if (pidOrSlug == null) return { product: null, downloadPath: null };

  // numeric ID?
  const num = typeof pidOrSlug === "string" ? Number(pidOrSlug) : pidOrSlug;
  if (Number.isFinite(num)) {
    const p = byId.get(Number(num));
    return { product: p ?? null, downloadPath: p?.downloadPath ?? null };
  }

  // slug string?
  const s = String(pidOrSlug);
  const p = bySlug.get(s);
  return { product: p ?? null, downloadPath: p?.downloadPath ?? null };
}

/** Map a product slug to an ENV var name like STRIPE_PRICE_ID_CHATGPT_SIDE_HUSTLES */
function envNameForPriceId(slug: string) {
  return `STRIPE_PRICE_ID_${slug.replace(/-/g, "_").toUpperCase()}`;
}

/** If present, return the expected Stripe price id for a product based on ENV. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function expectedPriceIdForProduct(product: any): string | null {
  if (!product?.slug) return null;
  const name = envNameForPriceId(product.slug);
  const val = (process.env[name] || "").trim();
  return val || null;
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

    // 1) Signed token is required (prevents link sharing)
    const token = url.searchParams.get("token");
    if (!token) return json({ error: "missing_token" }, 400);

    // Token payload may include numeric id OR slug, or an explicit path
    const payload = verifyDownloadToken(token) as {
      pid?: number | string;      // numeric id OR slug
      slug?: string;              // optional slug alias
      path?: string;              // optional absolute-like "/files/..." (relative to /private)
      downloadPath?: string;      // optional "files/..."
      exp?: number;               // optional expiry (unix seconds)
      sessionId?: string;         // optional Stripe session id bound into token
    };

    // 2) Identify product & downloadPath
    const pidOrSlug = (payload?.pid ?? payload?.slug) as string | number | undefined;
    const { product, downloadPath } = resolveProductFromPidOrSlug(pidOrSlug ?? null);

    // Prefer explicit path from token; otherwise use product.downloadPath
    const explicit = payload?.path || payload?.downloadPath || null;
    let rel: string | null = explicit ?? downloadPath ?? null;
    if (!rel) return json({ error: "no_download_for_product" }, 404);

    // 3) Optional: verify a Stripe Checkout session (?order=cs_xxx).
    //    This is a quick purchase check. If provided, we verify "paid"
    //    and optionally ensure the line items match the expected price id.
    const orderId = url.searchParams.get("order") || payload?.sessionId || null;
    if (orderId) {
      const stripe = getStripe();
      if (!stripe) return json({ error: "stripe_not_configured" }, 500);

      const session = await stripe.checkout.sessions.retrieve(orderId, {
        expand: ["line_items.data.price.product"],
      });

      const paid =
        session.payment_status === "paid" ||
        session.payment_status === "no_payment_required" ||
        session.status === "complete";

      if (!paid) return json({ error: "unauthorized" }, 403);

      // If we can identify a product AND you configured its price id in ENV, require an exact price match.
      // This blocks someone from reusing a paid session for another product.
      if (product) {
        const expectedPrice = expectedPriceIdForProduct(product);
        const items = session.line_items?.data ?? [];

        if (expectedPrice) {
          const hasExpectedPrice = items.some((li) => li.price?.id === expectedPrice);
          if (!hasExpectedPrice) return json({ error: "mismatched_product" }, 403);
        } else {
          // Fallback: if you included metadata during session creation, we can check that too.
          // (Recommended: add both `productId` and `productSlug` in your /api/checkout)
          const metaOk =
            (session.metadata?.productId && String(session.metadata.productId) === String(product.id)) ||
            (session.metadata?.productSlug && String(session.metadata.productSlug) === String(product.slug));

          // If you didn't set metadata and no ENV price id is configured, we accept "paid" as sufficient.
          // Uncomment the block below to make metadata mandatory instead:
          // if (!metaOk) return json({ error: "missing_or_mismatched_metadata" }, 403);
        }
      }
    }

    // 4) Sanitize and locate file under /private
    const FILE_ROOT = path.join(process.cwd(), "private"); // Option B root
    const safeRel = String(rel).replace(/^[/\\]+/, "");     // support "/files/foo.pdf" or "files/foo.pdf"
    const absPath = path.join(FILE_ROOT, safeRel);
    const resolved = path.resolve(absPath);
    if (!resolved.startsWith(FILE_ROOT)) return json({ error: "invalid_path" }, 400);

    const stat = await fs.stat(resolved).catch(() => null);
    if (!stat || !stat.isFile()) return json({ error: "file_not_found" }, 404);

    const mime = guessMime(resolved);
    const filename = path.basename(resolved);

    // HEAD: headers only
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

    // GET: read & return file (buffered)
    const buf = await fs.readFile(resolved);
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
