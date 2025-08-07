/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://digitalproductsartisan.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  trailingSlash: false,
  exclude: [
    '/404',
    '/500',
    '/thank-you',
    '/terms',
    '/privacy-policy',
    '/contact/success',
    '/sitemap.xml', // ✅ Prevent sitemap index from referencing itself
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/404',
          '/500',
          '/thank-you',
          '/terms',
          '/privacy-policy',
          '/contact/success',
        ],
      },
    ],
    // ✅ Remove additionalSitemaps pointing to sitemap.xml
    additionalSitemaps: [
      // If you ever generate additional sitemaps manually (e.g. blog sitemap), list them here
      // Example:
      // 'https://digitalproductsartisan.com/blog-sitemap.xml',
    ],
  },
};
