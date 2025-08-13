// app/sitemap.xml/route.ts
import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://digitalproductsartisan.com';

  // Get categories from Supabase
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, updated_at');

  // Get products from Supabase
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at');

  // Static pages (merged from your manual XML version + first version)
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
    '/returns',
    '/terms',
    '/privacy-policy',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic category pages from Supabase
  const categoryPages =
    categories?.map((cat) => ({
      url: `${baseUrl}/categories/${cat.slug}`,
      lastModified: cat.updated_at
        ? new Date(cat.updated_at)
        : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || [];

  // Dynamic product pages from Supabase
  const productPages =
    products?.map((prod) => ({
      url: `${baseUrl}/products/${prod.slug}`,
      lastModified: prod.updated_at
        ? new Date(prod.updated_at)
        : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })) || [];

  return [...staticPages, ...categoryPages, ...productPages];
}
