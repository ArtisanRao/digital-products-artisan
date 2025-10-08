// app/api/download/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server"
import path from "node:path"
import fs from "node:fs/promises"
import { productsBySlug } from "@/data/products"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug)
  const product = productsBySlug[slug]

  if (!product || !product.downloadPath) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // TODO: verify purchase / auth here (session, order lookup, signed token, etc.)

  // Prevent path traversal
  const safeRel = path.normalize(product.downloadPath).replace(/^(\.\.[/\\])+/, "")
  const abs = path.join(process.cwd(), "private", safeRel)

  try {
    const file = await fs.readFile(abs)
    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${path.basename(abs)}"`
      }
    })
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }
}
