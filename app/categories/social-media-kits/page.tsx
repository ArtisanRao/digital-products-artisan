'use client';

import Head from 'next/head';
import HoverableCover from '@/components/ui/hoverable-cover';

export default function SocialMediaKitsPage() {
  const items = [
    {
      id: 'instagram-canva-templates',
      title: 'Instagram Canva Templates',
      image: '/images/social-media-kits/instagram-canva-templates-cover.jpg',
      price: 6.99,
      description: 'Stylish post & story templates ready to edit in Canva.',
      fileUrl: '/downloads/instagram-canva-templates.zip',
    },
    {
      id: 'tiktok-reels-pack',
      title: 'TikTok & Reels Pack',
      image: '/images/social-media-kits/tiktok-reels-pack-cover.jpg',
      price: 5.49,
      description: 'Hook-driven short video prompt cards and overlays.',
      fileUrl: '/downloads/tiktok-reels-pack.zip',
    },
    {
      id: 'pinterest-pin-templates',
      title: 'Pinterest Pin Templates',
      image: '/images/social-media-kits/pinterest-pin-templates-cover.jpg',
      price: 4.99,
      description: 'High-CTR pin designs optimized for saves and clicks.',
      fileUrl: '/downloads/pinterest-pin-templates.zip',
    },
    {
      id: 'facebook-ads-creatives',
      title: 'Facebook Ads Creatives',
      image: '/images/social-media-kits/facebook-ads-creatives-cover.jpg',
      price: 7.99,
      description: 'Editable ad image templates for quick A/B testing.',
      fileUrl: '/downloads/facebook-ads-creatives.zip',
    },
    {
      id: 'stories-highlights-icons',
      title: 'Stories & Highlight Icons',
      image: '/images/social-media-kits/stories-highlights-icons-cover.jpg',
      price: 3.99,
      description: 'Minimal story backgrounds + 50 highlight icons.',
      fileUrl: '/downloads/stories-highlights-icons.zip',
    },
    {
      id: 'carousel-posts-kit',
      title: 'Carousel Posts Kit',
      image: '/images/social-media-kits/carousel-posts-kit-cover.jpg',
      price: 6.49,
      description: 'Swipe-worthy carousel layouts with pro typography.',
      fileUrl: '/downloads/carousel-posts-kit.zip',
    },
  ];

  const structuredData = items.map((p) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    image: `https://digitalproductsartisan.com${p.image}`,
    description: p.description,
    sku: p.id,
    offers: {
      '@type': 'Offer',
      url: 'https://digitalproductsartisan.com/categories/social-media-kits',
      priceCurrency: 'EUR',
      price: p.price.toFixed(2),
      availability: 'https://schema.org/InStock',
    },
  }));

  return (
    <>
      <Head>
        <title>Social Media Kits | Digital Products Artisan</title>
        <meta
          name="description"
          content="Editable social templates, ad creatives, carousels, and more — ready to customize."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10">📱 Social Media Kits</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg group"
            >
              {/* ✅ Hoverable, perfectly-fit cover */}
              <HoverableCover
                src={item.image}
                alt={item.title}
                ratio="16/9"     // keep consistent with other categories; change to "1/1" if your covers are square
                fit="contain"     // switch to "cover" for edge-to-edge fill
              />

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <p className="text-lg font-bold mb-3">€{item.price.toFixed(2)}</p>

                <button
                  className="snipcart-add-item bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  data-item-id={item.id}
                  data-item-name={item.title}
                  data-item-price={item.price}
                  data-item-url="/categories/social-media-kits"
                  data-item-description={item.description}
                  data-item-image={item.image}
                  data-item-file-guid={item.fileUrl}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
