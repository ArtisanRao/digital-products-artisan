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
  /^\/checkout$/,                  // ✅ guest checkout page
  /^\/order-confirmation(\/.*)?$/, // confirmation page(s)

  // ✅ guest access to checkout/payment APIs
  /^\/api\/checkout(\/.*)?$/,
  /^\/api\/create-payment-intent(\/.*)?$/,
  /^\/api\/stripe\/create(\/.*)?$/,
  /^\/api\/confirm-payment(\/.*)?$/,
  /^\/api\/stripe\/webhook$/,      // webhooks never require auth

  // auth pages should remain public
  /^\/login(\/.*)?$/,
  /^\/signup(\/.*)?$/,

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
 */
const PRIVATE_PROTECT: RegExp[] = [
  /^\/dashboard(\/.*)?$/,
  /^\/account(\/.*)?$/,
  /^\/admin(\/.*)?$/,
];

/** Dependency-free “am I logged in?” check via common session cookie names. */
function hasSessionCookie(req: NextRequest): boolean {
  const ck = req.cookies;
  const names = [
    "__Secure-next-auth.session-token", // NextAuth (secure)
    "next-auth.session-token",          // NextAuth (dev)
    "__Secure-authjs.session-token",    // Auth.js v5+
    "authjs.session-token",
    "session",                          // generic
    "auth",
    "token",
  ];
  return names.some((n) => !!ck.get(n)?.value);
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // 1) Always allow public routes (incl. checkout + APIs)
  if (PUBLIC_ALLOW.some((re) => re.test(pathname))) {
    return NextResponse.next();
  }

  // 2) Protect private areas only
  if (PRIVATE_PROTECT.some((re) => re.test(pathname))) {
    if (!hasSessionCookie(req)) {
      const url = new URL("/login", req.url);
      url.searchParams.set("redirect", pathname + search);
      return NextResponse.redirect(url);
    }
  }

  // 3) Everything else passes through
  return NextResponse.next();
}

/** Apply to all routes except static/runtime assets. */
export const config = {
  matcher: ["/((?!_next|favicon.ico|sitemap.xml|robots.txt|sw.js|workbox-).*)"],
};
