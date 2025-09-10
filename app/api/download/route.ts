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

    // Verify token -> { pid, exp }
    let payload: any;
    try {
      payload = verifyDownloadToken(token);
    } catch {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const pid = Number(payload?.pid);
    const product = productsById[pid];
    if (!product?.downloadPath) {
      return NextResponse.json({ error: "No file for this product" }, { status: 404 });
    }

    // Files are stored under /private (not /public)
    const relative = product.downloadPath.replace(/^\//, ""); // strip leading slash
    const absPath = path.join(process.cwd(), "private", relative);

    const stat = await fs.stat(absPath);
    if (!stat.isFile()) {
      return NextResponse.json({ error: "Not a file" }, { status: 404 });
    }

    // Read as Node Buffer, then wrap in a Blob (BodyInit-safe)
    const file = await fs.readFile(absPath);
    const mime = guessMime(absPath);
    const blob = new Blob([file], { type: mime });

    const headers = new Headers({
      "Content-Type": mime,
      // Friendly filename + force download
      "Content-Disposition": `attachment; filename="${path.basename(absPath)}"`,
      "Cache-Control": "no-store",
    });

    return new NextResponse(blob, { headers });
  } catch (err: any) {
    console.error("Download error:", err?.message ?? err);
    return NextResponse.json({ error: "Download error" }, { status: 500 });
  }
}
