import { verifyDownloadToken } from "@/lib/download-token";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function guessMime(p: string): string {
  const ext = path.extname(p).toLowerCase();
  switch (ext) {
    case ".pdf": return "application/pdf";
    case ".zip": return "application/zip";
    case ".docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case ".png": return "image/png";
    case ".jpg":
    case ".jpeg": return "image/jpeg";
    default: return "application/octet-stream";
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (!token) return json({ error: "Missing token" }, 400);

    const payload = verifyDownloadToken(token); // throws if invalid/expired
    const pid = Number((payload as any).pid);
    const explicit = (payload as any).path || (payload as any).downloadPath || null;

    // Resolve relative path from token or by product id
    let relative: string | null = explicit;
    if (!relative) {
      const { productsById } = await import("@/data/products");
      const product = productsById[pid];
      if (!product?.downloadPath) return json({ error: "No download for this product" }, 404);
      relative = product.downloadPath;
    }

    // Files live under /private (not /public)
    const FILE_ROOT = path.join(process.cwd(), "private");
    const safeRel = relative!.replace(/^\/+/, "");
    const absPath = path.join(FILE_ROOT, safeRel);

    // Prevent traversal
    const resolved = path.resolve(absPath);
    if (!resolved.startsWith(FILE_ROOT)) return json({ error: "Invalid path" }, 400);

    const buf = await fs.readFile(resolved); // Node Buffer

    // âœ… Deep-copy into a fresh ArrayBuffer (avoids SharedArrayBuffer typings)
    const ab = new ArrayBuffer(buf.byteLength);
    new Uint8Array(ab).set(buf);

    const mime = guessMime(resolved);
    const filename = path.basename(resolved);

    const headers = new Headers({
      "Content-Type": mime,
      "Content-Length": String(buf.byteLength),
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    });

    // Return pure ArrayBuffer, which satisfies BodyInit in this environment
    return new Response(ab, { headers });
  } catch (err: any) {
    console.error("Download error:", err?.message ?? err);
    return json({ error: "Download error" }, 500);
  }
}
