// app/sitemap.xml/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://digitalproductsartisan.com';

  const staticPages = [
    '',
    '/categories',
    '/categories/ebooks',
    '/categories/digital-art',
    '/categories/templates',
    '/categories/marketing-tools',
    '/categories/printable-planners',
    '/categories/video-resources',
    '/about',
    '/contact',
    '/terms',
    '/privacy-policy',
  ];

  const urls = staticPages.map((path) => {
    return `
      <url>
        <loc>${baseUrl}${path}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.join('')}
    </urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
