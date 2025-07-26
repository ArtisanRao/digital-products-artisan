// app/api/sitemap/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://digitalproductsartisan.com';

  // Example of static URLs — replace/add more if needed
  const staticPages = ['', '/about', '/products', '/contact'];

  const urls = staticPages.map((page) => {
    return `
      <url>
        <loc>${baseUrl}${page}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>1.0</priority>
      </url>
    `;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.join('')}
  </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
