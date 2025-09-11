// app/api/currency-suggest/route.ts
import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// Minimal EU list where we'll default to EUR (helps Klarna show up)
const EU = new Set([
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT",
  "LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"
]);

export async function GET(req: Request) {
  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    "";

  const currency = EU.has(country.toUpperCase()) ? "eur" : "usd";
  return NextResponse.json({ country: country || null, currency });
}
