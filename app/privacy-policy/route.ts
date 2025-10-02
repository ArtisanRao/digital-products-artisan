import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: Request) {
  const url = new URL("/terms-of-service", req.url);
  return NextResponse.redirect(url, 308);
}
