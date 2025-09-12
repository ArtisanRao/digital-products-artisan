// next.config.js

const withPWA = require('next-pwa')({
  dest: 'public',                          // Output folder for service worker and precache files
  register: true,                          // Auto-register the service worker
  skipWaiting: true,                       // Activate new service worker immediately
  disable: process.env.NODE_ENV === 'development', // Disable PWA in dev
});

/** Content Security Policy (tune domains as needed) */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "worker-src 'self'",
  "font-src 'self' data: https:",
  "img-src 'self' data: blob: https:",
  // Allow only the scripts you actually use (add/remove hosts as needed)
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com",
  "style-src 'self' 'unsafe-inline'",
  // Network/XHR/WebSocket destinations
  "connect-src 'self' https://www.google-analytics.com https://vitals.vercel-insights.com https://api.stripe.com https://checkout.stripe.com",
  // Frames (Stripe Checkout, etc.)
  "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
].join('; ');

/** Shared security headers */
const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Turn off Google Topics/FLoC and most powerful APIs by default
  { key: 'Permissions-Policy', value: "accelerometer=(), autoplay=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  poweredByHeader: false,

  experimental: {
    optimizeCss: true, // Helps with font preload consistency
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  async redirects() {
    return [
      { source: '/help-center', destination: '/help', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/best-sellers', destination: '/bestsellers', permanent: true },
    ];
  },
});

module.exports = nextConfig;
