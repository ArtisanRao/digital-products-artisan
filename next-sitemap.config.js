/** @type {import('next-sitemap').IConfig} */
const siteUrl = 'https://digitalproductsartisan.com';

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  trailingSlash: false,

  // Defaults (overridden per-path in transform)
  changefreq: 'weekly',
  priority: 0.7,

  // Exclude non-indexable routes, old aliases, and assets
  exclude: [
    '/404',
    '/500',
    '/contact/success',
    '/thank-you',
    '/api/*',
    '/cart',
    '/checkout',
    '/best-sellers',      // old alias (redirects)
    '/bestsellers',       // old alias (redirects)
    '/manifest.json',
    '/site.webmanifest',
    '/favicon.ico',
    '/sw.js',
    '/workbox-*.js',
    '/fallback-*.js',
    '/sitemap.xml',       // prevent self-reference
  ],

  // Fine-tune per-URL values
  transform: async (config, path) => {
    const priority =
      path === '/' ? 1.0 :
      path === '/products/best-sellers' ? 0.8 : 0.7;

    return {
      loc: path,
      changefreq: 'weekly',
      priority,
      lastmod: new Date().toISOString(),
    };
  },

  // Ensure key canonicals are always present
  additionalPaths: async (config) => {
    const paths = [
      '/',
      '/products',
      '/products/best-sellers',
      '/terms-of-service',
      '/privacy-policy',
    ];
    return Promise.all(paths.map((p) => config.transform(config, p)));
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/*',
          '/cart',
          '/checkout',
          '/thank-you',
        ],
      },
    ],
    additionalSitemaps: [
      // Add more sitemap URLs here later if you split by section (e.g., blog)
    ],
  },
};
