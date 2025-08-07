/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://digitalproductsartisan.com',
  generateRobotsTxt: true, // Automatically creates robots.txt
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
    additionalSitemaps: [
      'https://digitalproductsartisan.com/sitemap.xml',
    ],
  },
};
