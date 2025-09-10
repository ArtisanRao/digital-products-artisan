// app/api/diag/route.ts
import { NextResponse } from "next/server"
export const runtime = "nodejs"

export async function GET() {
  return NextResponse.json({
    runtime: (process as any).env?.NEXT_RUNTIME ?? "unknown",
    stripeEnvSet: !!process.env.STRIPE_SECRET_KEY,
    siteUrlSet: !!process.env.NEXT_PUBLIC_SITE_URL,
  })
}
