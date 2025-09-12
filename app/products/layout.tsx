// app/products/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://digitalproductsartisan.com'),
  title: 'All Digital Products | Digital Products Artisan',
  description:
    'Discover our complete collection of digital downloads for creators and entrepreneurs.',
  alternates: { canonical: '/products' },
  openGraph: {
    title: 'All Digital Products | Digital Products Artisan',
    url: 'https://digitalproductsartisan.com/products',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
