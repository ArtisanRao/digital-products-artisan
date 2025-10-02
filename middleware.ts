// middleware.ts (project root)
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { productsById } from "@/data/products";

/** ---------- helpers ---------- */
function permRedirect(req: NextRequest, to: string) {
  const url = new URL(to, req.url);
  return NextResponse.redirect(url, 308);
}

/** Public routes: always accessible (guest checkout included). */
const PUBLIC_ALLOW: RegExp[] = [
  /^\/$/,                          // home
  /^\/products(\/.*)?$/,           // products + PDPs
  /^\/categories(\/.*)?$/,         // categories
  /^\/cart$/,                      // cart
  /^\/checkout$/,                  // guest checkout page
  /^\/order-confirmation(\/.*)?$/, // confirmation page(s)

  // guest access to checkout/payment APIs
  /^\/api\/checkout(\/.*)?$/,
  /^\/api\/create-payment-intent(\/.*)?$/,
  /^\/api\/stripe\/create(\/.*)?$/,
  /^\/api\/confirm-payment(\/.*)?$/,
  /^\/api\/stripe\/webhook$/,      // webhooks never require auth
  /^\/api\/download$/,             // signed download links must be public

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

/** Private sections that require auth. */
const PRIVATE_PROTECT: RegExp[] = [
  /^\/dashboard(\/.*)?$/,
  /^\/account(\/.*)?$/,
  /^\/admin(\/.*)?$/,
];

/** Dependency-free session check via common cookie names. */
function hasSessionCookie(req: NextRequest): boolean {
  const ck = req.cookies;
  const names = [
    "__Secure-next-auth.session-token",
    "next-auth.session-token",
    "__Secure-authjs.session-token",
    "authjs.session-token",
    "session",
    "auth",
    "token",
  ];
  return names.some((n) => !!ck.get(n)?.value);
}

/** Strip any leading ",", spaces, or their URL-encoded forms after "/" */
function stripLeadingCommaSpace(pathname: string): string {
  // Examples matched: "/, /privacy-policy", "/%2C%20/privacy-policy", "/,/%20privacy-policy"
  return pathname.replace(/^\/(?:(?:,|%2c)+(?:\s|%20)*)+/i, "/").replace(/^\/\s+/, "/");
}

export function middleware(req: NextRequest) {
  const { search } = req.nextUrl;
  let pathname = req.nextUrl.pathname;

  // A) Sanitize leading commas/spaces that cause GSC to request "/, /privacy-policy"
  const trimmedOnce = stripLeadingCommaSpace(pathname);
  if (trimmedOnce !== pathname) {
    pathname = trimmedOnce;
    return permRedirect(req, pathname + search);
  }

  const lower = pathname.toLowerCase();

  /** ---------- URL normalization / SEO fixes ---------- */

  // 1) Junk root variants like /$, /&, /$& → /
  if (/^\/(?:[$&])+$/i.test(lower)) {
    return permRedirect(req, "/");
  }

  // 2) Legacy privacy page -> terms-of-service (handle with/without trailing slash)
  if (lower === "/privacy-policy" || lower === "/privacy-policy/") {
    return permRedirect(req, "/terms-of-service");
  }

  // 3) Numeric product URLs (/products/123) -> canonical slug
  const m = lower.match(/^\/products\/(\d+)(?:\/)?$/);
  if (m) {
    const id = Number(m[1]);
    const p = productsById[id];
    if (p?.slug) {
      return permRedirect(req, `/products/${encodeURIComponent(p.slug)}${search}`);
    }
  }

  /** ---------- Access control (lightweight) ---------- */

  // Always allow public routes (incl. checkout & APIs)
  if (PUBLIC_ALLOW.some((re) => re.test(pathname))) {
    return NextResponse.next();
  }

  // Protect private areas only
  if (PRIVATE_PROTECT.some((re) => re.test(pathname))) {
    if (!hasSessionCookie(req)) {
      const url = new URL("/login", req.url);
      url.searchParams.set("redirect", pathname + search);
      return NextResponse.redirect(url);
    }
  }

  // Everything else passes through
  return NextResponse.next();
}

/** Apply to all routes except static/runtime assets. */
export const config = {
  matcher: ["/((?!_next|favicon.ico|sitemap.xml|robots.txt|sw.js|workbox-).*)"],
};
