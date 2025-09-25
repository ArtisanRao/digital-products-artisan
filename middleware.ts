// middleware.ts (project root)
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Public routes: always accessible (guest checkout included).
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
  /^\/api\/stripe\/webhook$/,      // webhooks should never require auth

  // static/runtime
  /^\/_next\/.*/,
  /^\/favicon\.ico$/,
  /^\/sw\.js$/,
  /^\/workbox-.*\.js$/,
  /^\/sitemap.*\.xml$/,
  /^\/robots\.txt$/,
];

/**
 * Private sections that require auth.
 * (Add more patterns here as needed.)
 */
const PRIVATE_PROTECT: RegExp[] = [
  /^\/dashboard(\/.*)?$/,
  /^\/account(\/.*)?$/,
  /^\/admin(\/.*)?$/,
];

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // 1) Always allow public routes (incl. checkout + APIs)
  if (PUBLIC_ALLOW.some((re) => re.test(pathname))) {
    return NextResponse.next();
  }

  // 2) If route is private, require auth (NextAuth if available)
  if (PRIVATE_PROTECT.some((re) => re.test(pathname))) {
    try {
      // Dynamically import so this works even if next-auth isn't installed
      const mod = await import("next-auth/jwt").catch(() => null as any);
      const token = mod?.getToken ? await mod.getToken({ req }) : null;

      if (!token) {
        const url = new URL("/login", req.url);
        url.searchParams.set("redirect", pathname + search);
        return NextResponse.redirect(url);
      }
    } catch {
      // If auth check fails for any reason, default to letting it through
      // (prevents accidental lockouts of non-auth sites)
      return NextResponse.next();
    }
  }

  // 3) Everything else passes through
  return NextResponse.next();
}

/**
 * Apply to all routes except static/runtime assets.
 */
export const config = {
  matcher: ["/((?!_next|favicon.ico|sitemap.xml|robots.txt|sw.js|workbox-).*)"],
};
