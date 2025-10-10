// pwa-runtime-caching.js
// Workbox runtime caching for next-pwa. We *never* cache React Server Components,
// Next data routes, or dynamic category/product pages.
const { CacheFirst, StaleWhileRevalidate, NetworkOnly } = require('workbox-strategies');
const { ExpirationPlugin } = require('workbox-expiration');

module.exports = [
  // ❌ Never cache RSC / Flight / data payloads
  {
    urlPattern: ({ url, request }) => {
      const u = url.toString();
      return (
        u.includes('/_next/data/') ||             // SSG/ISR JSON payloads
        u.includes('__flight__')   ||             // React Flight
        u.includes('react-server') ||             // RSC paths
        request.headers.get('RSC') ||             // RSC header
        u.includes('/_rsc')                         // Next 15 internal RSC
      );
    },
    handler: 'NetworkOnly',
  },

  // ❌ Never cache your dynamic routes (server rendered)
  { urlPattern: /\/categories(\/.*)?(\?.*)?$/i, handler: 'NetworkOnly' },
  { urlPattern: /\/products(\/.*)?(\?.*)?$/i,   handler: 'NetworkOnly' },

  // ✅ Static assets: ok to cache
  {
    urlPattern: /\/_next\/static\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'next-static-assets',
      plugins: [new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 })],
    },
  },
  {
    urlPattern: /\/(images|fonts)\/.*/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'site-assets',
      plugins: [new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 })],
    },
  },
];
