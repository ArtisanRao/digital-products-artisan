import { verifyDownloadToken } from "@/lib/download-token";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs"; // make sure this runs on Node in Vercel

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

    const payload = verifyDownloadToken(token); // throws on bad/expired token
    const pid = Number((payload as any).pid);
    const relFromToken = (payload as any).path || (payload as any).downloadPath || null;

    // Resolve relative path: prefer explicit path from token, otherwise by product id
    let relative: string | null = relFromToken;
    if (!relative) {
      const { productsById } = await import("@/data/products");
      const product = productsById[pid];
      if (!product?.downloadPath) {
        return json({ error: "No download available for this product" }, 404);
      }
      relative = product.downloadPath;
    }

    // Files are served from /private (not /public)
    const FILE_ROOT = path.join(process.cwd(), "private");
    const safeRel = relative!.replace(/^\/+/, ""); // strip any leading slash
    const absPath = path.join(FILE_ROOT, safeRel);

    // Prevent path traversal
    const resolved = path.resolve(absPath);
    if (!resolved.startsWith(FILE_ROOT)) {
      return json({ error: "Invalid path" }, 400);
    }

    // Read file as Buffer
    const buf = await fs.readFile(resolved);

    // Convert Buffer -> Uint8Array (safe BlobPart for DOM types)
    const uint8 = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);

    const mime = guessMime(resolved);
    const filename = path.basename(resolved);

    // Create a Blob from the Uint8Array so Response(body) typing is satisfied
    const blob = new Blob([uint8], { type: mime });

    const headers = new Headers({
      "Content-Type": mime,
      "Content-Length": String(uint8.byteLength),
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    });

    return new Response(blob, { headers });
  } catch (err: any) {
    console.error("Download error:", err?.message ?? err);
    return json({ error: "Download error" }, 500);
  }
}
