import withPWA from "next-pwa";

/** Configure next-pwa */
const withPWACfg = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",

  /** 👇 NEW: runtime caching — never cache HTML documents */
  runtimeCaching: [
    {
      // Treat navigations / HTML as network-only so stale pages aren't served
      urlPattern: ({ request, sameOrigin }) =>
        request.destination === "document" || request.mode === "navigate",
      handler: "NetworkOnly",
      options: {
        cacheName: "html-no-cache",
      },
    },
    // (Keep default asset caching behavior; add more rules here if desired)
  ],
});

/** Content Security Policy (tune domains as needed) */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "worker-src 'self' blob:",
  "font-src 'self' data: https: https://cdn.snipcart.com",
  "img-src 'self' data: blob: https: https://cdn.snipcart.com https://app.snipcart.com",
  "media-src 'self' blob:",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com https://cdn.snipcart.com https://app.snipcart.com",
  "style-src 'self' 'unsafe-inline' https://cdn.snipcart.com",
  "connect-src 'self' https://www.google-analytics.com https://vitals.vercel-insights.com https://api.stripe.com https://checkout.stripe.com https://cdn.snipcart.com https://app.snipcart.com",
  "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com https://app.snipcart.com",
  "form-action 'self' https://app.snipcart.com https://checkout.stripe.com",
  "frame-ancestors 'self'",
].join("; ");

/** Shared security headers */
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "accelerometer=(), autoplay=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  { key: "Origin-Agent-Cluster", value: "?1" },
];

/** Non-HTML assets we never want indexed */
const assetNoIndexHeaders = [
  {
    source: "/manifest.json",
    headers: [
      { key: "Content-Type", value: "application/manifest+json" },
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
      { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
    ],
  },
  {
    source: "/site.webmanifest",
    headers: [
      { key: "Content-Type", value: "application/manifest+json" },
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
      { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
    ],
  },
  // Favicons
  {
    source: "/favicon.ico",
    headers: [
      { key: "X-Robots-Tag", value: "noindex" },
      { key: "Cache-Control", value: "public, max-age=604800, immutable" },
    ],
  },
  {
    source: "/favicon-48x48.png",
    headers: [
      { key: "X-Robots-Tag", value: "noindex" },
      { key: "Cache-Control", value: "public, max-age=604800, immutable" },
    ],
  },
  {
    source: "/apple-touch-icon.png",
    headers: [
      { key: "X-Robots-Tag", value: "noindex" },
      { key: "Cache-Control", value: "public, max-age=604800, immutable" },
    ],
  },

  { source: "/sw.js", headers: [{ key: "X-Robots-Tag", value: "noindex" }, { key: "Cache-Control", value: "no-cache" }] },
  { source: "/workbox-:hash.js", headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
  { source: "/fallback-:hash.js", headers: [{ key: "X-Robots-Tag", value: "noindex" }] },

  { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
  { source: "/cart", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
  { source: "/checkout", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
  { source: "/thank-you", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
];

/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  experimental: { optimizeCss: true },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "digitalproductsartisan.com" },
      { protocol: "https", hostname: "www.digitalproductsartisan.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.imgur.com" },
    ],
  },

  async headers() {
    return [
      ...assetNoIndexHeaders,

      /** 👇 NEW: never cache category pages at the edge */
      {
        source: "/categories",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
      {
        source: "/categories/:slug*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },

      // Global security headers
      { source: "/(.*)", headers: securityHeaders },
    ];
  },

  async redirects() {
    return [
      // Canonical host: www → apex
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.digitalproductsartisan.com" }],
        destination: "https://digitalproductsartisan.com/:path*",
        permanent: true,
      },

      // Legal
      { source: "/terms", destination: "/terms-of-service", permanent: true },
      { source: "/terms/", destination: "/terms-of-service", permanent: true },
      { source: "/legal/terms", destination: "/terms-of-service", permanent: true },
      { source: "/legal/terms/", destination: "/terms-of-service", permanent: true },

      // Existing redirects
      { source: "/help-center", destination: "/help", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },

      { source: "/bestsellers", destination: "/products/best-sellers", permanent: true },
      { source: "/bestsellers/", destination: "/products/best-sellers", permanent: true },
      { source: "/best-sellers", destination: "/products/best-sellers", permanent: true },
      { source: "/best-sellers/", destination: "/products/best-sellers", permanent: true },
      { source: "/products/bestsellers", destination: "/products/best-sellers", permanent: true },

      { source: "/products/", destination: "/products", permanent: true },
      { source: "/shop", destination: "/products", permanent: true },

      { source: "/category/:slug", destination: "/categories/:slug", permanent: true },
      { source: "/category/:slug/", destination: "/categories/:slug", permanent: true },

      // Category slug changes
      { source: "/categories/digital-art",        destination: "/categories/ai-and-chatgpt-guides",       permanent: true },
      { source: "/categories/printable-planners", destination: "/categories/planners-and-productivity",   permanent: true },
      { source: "/categories/photography-prints", destination: "/categories/self-help-and-how-to",        permanent: true },
      { source: "/categories/audio-samples",      destination: "/categories/plr-and-mrr-bundles",         permanent: true },
      { source: "/categories/video-resources",    destination: "/categories/video-courses-and-training",  permanent: true },
      { source: "/categories/templates",          destination: "/categories/complete-shop-packages",      permanent: true },
      { source: "/categories/ebooks",             destination: "/categories/health-and-fitness-ebooks",   permanent: true },

      // Restore top-level Fonts & Icons (forward from old subpaths)
      { source: "/categories/web-templates/fonts", destination: "/categories/fonts", permanent: true },
      { source: "/categories/web-templates/icons", destination: "/categories/icons", permanent: true },
    ];
  },
};

export default withPWACfg(baseConfig);
