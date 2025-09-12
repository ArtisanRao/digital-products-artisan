// next.config.js

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** Content Security Policy (tune domains as needed) */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "worker-src 'self'",
  "font-src 'self' data: https:",
  "img-src 'self' data: blob: https:",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com",
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self' https://www.google-analytics.com https://vitals.vercel-insights.com https://api.stripe.com https://checkout.stripe.com",
  "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
].join('; ');

/** Shared security headers */
const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable Topics/FLoC + powerful device APIs by default
  { key: 'Permissions-Policy', value: "accelerometer=(), autoplay=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()" },
];

/** Non-HTML assets we never want indexed */
const assetNoIndexHeaders = [
  // Web App Manifest (both common paths)
  {
    source: '/manifest.json',
    headers: [
      { key: 'Content-Type', value: 'application/manifest+json' },
      { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
      { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
    ],
  },
  {
    source: '/site.webmanifest',
    headers: [
      { key: 'Content-Type', value: 'application/manifest+json' },
      { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
      { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
    ],
  },
  // Icons / PWA runtime files
  { source: '/favicon.ico', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] },
  { source: '/apple-touch-icon.png', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] },
  { source: '/sw.js', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }, { key: 'Cache-Control', value: 'no-cache' }] },
  { source: '/workbox-:hash.js', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] },
  { source: '/fallback-:hash.js', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] },
];

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  poweredByHeader: false,

  experimental: {
    optimizeCss: true,
  },

  async headers() {
    return [
      // 1) Explicit noindex for assets like the manifest (fixes GSC warning)
      ...assetNoIndexHeaders,
      // 2) Global security headers for everything
      { source: '/(.*)', headers: securityHeaders },
    ];
  },

  async redirects() {
    return [
      // Keep your existing helpful redirects
      { source: '/help-center', destination: '/help', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },

      // ✅ Canonicalize "best sellers" to the single indexable URL
      { source: '/best-sellers', destination: '/products/best-sellers', permanent: true },
      { source: '/bestsellers', destination: '/products/best-sellers', permanent: true },

      // ✅ Canonicalize "products" (remove trailing slash & legacy alias)
      { source: '/products/', destination: '/products', permanent: true },
      { source: '/shop', destination: '/products', permanent: true },
    ];
  },
});

module.exports = nextConfig;
