// app/api/download/route.ts
import { verifyDownloadToken } from "@/lib/download-token";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs"; // ensure Node runtime

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function guessMime(p: string): string {
  const ext = path.extname(p).toLowerCase();
  switch (ext) {
    case ".pdf":
      return "application/pdf";
    case ".zip":
      return "application/zip";
    case ".docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    default:
      return "application/octet-stream";
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (!token) return json({ error: "Missing token" }, 400);

    // Verify HMAC token (requires DOWNLOAD_SECRET env)
    const payload = verifyDownloadToken(token); // throws on failure
    const pid = Number((payload as any).pid);
    const relPath =
      (payload as any).path || (payload as any).downloadPath || null;

    if (!pid && !relPath) {
      return json({ error: "Invalid token payload" }, 400);
    }

    // If the token contains a specific relative path, prefer that.
    // Otherwise, look up by product id using your products table.
    let relative = relPath as string | null;

    if (!relative) {
      const { productsById } = await import("@/data/products");
      const product = productsById[pid];
      if (!product?.downloadPath) {
        return json({ error: "No download available for this product" }, 404);
      }
      relative = product.downloadPath;
    }

    // We expect downloadPath like "/files/...". Files live under /private, not /public.
    const FILE_ROOT = path.join(process.cwd(), "private");
    const safeRel = relative.replace(/^\/+/, ""); // strip leading slash
    const absPath = path.join(FILE_ROOT, safeRel);

    // Prevent path traversal
    const resolved = path.resolve(absPath);
    if (!resolved.startsWith(FILE_ROOT)) {
      return json({ error: "Invalid path" }, 400);
    }

    // Read file as Buffer and convert to Uint8Array for Response body
    const buf = await fs.readFile(resolved);
    const body = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);

    const filename = path.basename(resolved);
    const mime = guessMime(resolved);

    const headers = new Headers({
      "Content-Type": mime,
      "Content-Length": String(body.byteLength),
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    });

    return new Response(body, { headers });
  } catch (err: any) {
    console.error("Download error:", err?.message ?? err);
    return json({ error: "Download error" }, 500);
  }
}
