import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const out: Record<string, any> = {
    runtime: (process as any).env?.NEXT_RUNTIME ?? "unknown",
    node: process.version,
    env: {
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      NEXT_PUBLIC_SITE_URL: !!process.env.NEXT_PUBLIC_SITE_URL,
    },
  };

  try {
    if (process.env.STRIPE_SECRET_KEY) {
      // Just instantiate; no network call
      const s = new Stripe(process.env.STRIPE_SECRET_KEY);
      out.stripe = { sdkLoaded: true };
    } else {
      out.stripe = { sdkLoaded: false };
    }
  } catch (e: any) {
    out.stripe = { sdkLoaded: false, error: e?.message };
  }

  return NextResponse.json(out);
}
