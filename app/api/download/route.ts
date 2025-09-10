// app/api/download/route.ts
import { NextResponse } from "next/server";
import { verifyDownloadToken } from "@/lib/download-token";
import { productsById } from "@/data/products";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const payload = verifyDownloadToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const product = productsById[payload.pid];
    if (!product?.downloadPath) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // resolve repo-relative path safely
    const filePath = path.join(process.cwd(), product.downloadPath);
    const file = await fs.readFile(filePath);

    // Basic content-type inference (PDF in your case)
    const filename = path.basename(filePath);
    const headers = new Headers({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    });

    return new NextResponse(file, { headers });
  } catch (err: any) {
    console.error("Download error:", err?.message ?? err);
    return NextResponse.json({ error: "Download error" }, { status: 500 });
  }
}
