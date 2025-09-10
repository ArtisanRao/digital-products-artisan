// app/api/download/route.ts
import { NextResponse } from "next/server";
import { productsById } from "@/data/products";
import { verifyDownloadToken } from "@/lib/download-token";
import * as fs from "node:fs/promises";
import * as path from "node:path";

export const runtime = "nodejs";

function guessMime(p: string) {
  const ext = path.extname(p).toLowerCase();
  if (ext === ".pdf") return "application/pdf";
  if (ext === ".zip") return "application/zip";
  if (ext === ".docx") return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (ext === ".doc") return "application/msword";
  return "application/octet-stream";
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    // Verify token -> { pid, exp, ... }
    let payload: any;
    try {
      payload = verifyDownloadToken(token);
    } catch (e: any) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const pid = Number(payload?.pid);
    const product = productsById[pid];
    if (!product?.downloadPath) {
      return NextResponse.json({ error: "No file for this product" }, { status: 404 });
    }

    // Files live under /private (not /public)
    const relative = product.downloadPath.replace(/^\//, ""); // strip leading slash
    const absPath = path.join(process.cwd(), "private", relative);

    const stat = await fs.stat(absPath);
    if (!stat.isFile()) {
      return NextResponse.json({ error: "Not a file" }, { status: 404 });
    }

    const file = await fs.readFile(absPath); // Node Buffer
    // Convert Node Buffer -> ArrayBuffer (BodyInit) to satisfy NextResponse
    const body = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength);

    const headers = new Headers({
      "Content-Type": guessMime(absPath),
      "Content-Length": String(file.length),
      // Force download with a friendly filename
      "Content-Disposition": `attachment; filename="${path.basename(absPath)}"`,
      "Cache-Control": "no-store",
    });

    return new NextResponse(body, { headers });
  } catch (err: any) {
    console.error("Download error:", err?.message ?? err);
    return NextResponse.json({ error: "Download error" }, { status: 500 });
  }
}
