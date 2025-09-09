// app/api/download/route.ts
import { NextResponse } from "next/server"
import { verifyDownloadToken } from "@/lib/download-token"
import { productsById } from "@/data/products"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get("token") || ""
  const payload = verifyDownloadToken(token)
  if (!payload) return new NextResponse("Invalid or expired link", { status: 401 })

  const product = productsById[payload.pid]
  if (!product) return new NextResponse("Product not found", { status: 404 })

  // Put your real file here. Default convention:
  //   public/files/{slug}.zip
  const filePath = product.downloadPath || `/files/${product.slug}.zip`

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL("/", req.url).origin
  return NextResponse.redirect(new URL(filePath, baseUrl).toString(), { status: 302 })
}
