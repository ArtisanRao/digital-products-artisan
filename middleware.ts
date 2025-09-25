// middleware.ts (project root)
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * This middleware is intentionally permissive.
 * It ensures checkout UI and checkout APIs are always reachable
 * (guest checkout), avoiding any redirect-to-login loops.
 */

const PUBLIC_ALLOW: RegExp[] = [
  /^\/$/,                          // home
  /^\/products(\/.*)?$/,           // products + PDPs
  /^\/categories(\/.*)?$/,         // categories
  /^\/cart$/,                      // cart
  /^\/checkout$/,                  // ✅ allow guest checkout page
  /^\/order-confirmation(\/.*)?$/, // confirmation page(s)

  // ✅ allow guest access to checkout/payment APIs
  /^\/api\/checkout(\/.*)?$/,
  /^\/api\/create-payment-intent(\/.*)?$/,
  /^\/api\/stripe\/create(\/.*)?$/,
  /^\/api\/confirm-payment(\/.*)?$/,

  // static/runtime
  /^\/_next\/.*/,
  /^\/favicon\.ico$/,
  /^\/sw\.js$/,
  /^\/workbox-.*\.js$/,
  /^\/sitemap.*\.xml$/,
  /^\/robots\.txt$/,
];

export function middleware(_req: NextRequest) {
  // We simply pass through; the allowlist is here for clarity
  // and for easy future tweaks (e.g., if you later add guards).
  return NextResponse.next();
}

/**
 * Apply to all routes except static/runtime assets.
 * If you already have a middleware, move the PUBLIC_ALLOW concept
 * to the top of your existing file and early-return NextResponse.next()
 * when the path matches one of those patterns.
 */
export const config = {
  matcher: ["/((?!_next|favicon.ico|sitemap.xml|robots.txt|sw.js|workbox-).*)"],
};
