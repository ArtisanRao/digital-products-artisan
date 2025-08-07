'use client';

import Head from 'next/head';

export default function EbooksPage() {
  const ebooks = [
    {
      id: "50-powerful-prompts",
      title: "50 Powerful Prompts",
      image: "/images/50-powerful-prompts-cover.jpg",
      price: 5.99,
      description: "Supercharge your creativity with 50 AI-ready prompts.",
      fileUrl: "/downloads/50-powerful-prompts.pdf",
    },
    {
      id: "50-prompts-notion",
      title: "50 Prompts (Notion Format)",
      image: "/images/50-powerful-prompts-notion-format-cover.jpg",
      price: 5.99,
      description: "Same prompts, fully organized in Notion.",
      fileUrl: "/downloads/50-powerful-prompts-notion.pdf",
    },
    {
      id: "fantasy-novel",
      title: "The Lost Realm – A Fantasy Novel",
      image: "/images/fantasy-novel-cover.jpg",
      price: 6.49,
      description: "An epic journey through a magical world of dragons and destiny.",
      fileUrl: "/downloads/fantasy-novel.pdf",
    },
    {
      id: "science-fiction-novel",
      title: "Galactic Echoes – Sci-Fi Thriller",
      image: "/images/science-fiction-novel-cover.jpg",
      price: 6.99,
      description: "A suspenseful journey through space and time.",
      fileUrl: "/downloads/science-fiction-novel.pdf",
    },
    {
      id: "romance-novel",
      title: "Love Letters – Romance Novel",
      image: "/images/romance-novel-cover.jpg",
      price: 5.49,
      description: "A heartwarming love story to escape into.",
      fileUrl: "/downloads/romance-novel.pdf",
    },
    {
      id: "self-help-book",
      title: "Unlock You – Self-Help Book",
      image: "/images/self-help-personal-development-book-cover.jpg",
      price: 7.25,
      description: "Practical wisdom to improve your life and mindset.",
      fileUrl: "/downloads/self-help-book.pdf",
    },
    {
      id: "the-code-of-success",
      title: "The Code of Success",
      image: "/images/the-code-of-success-cover.jpg",
      price: 8.49,
      description: "A strategic guide for achieving success in any field.",
      fileUrl: "/downloads/the-code-of-success.pdf",
    },
    {
      id: "true-crime-novel",
      title: "Whispers of Guilt – True Crime",
      image: "/images/true-crime-novel-cover.jpg",
      price: 5.95,
      description: "A chilling exploration of real-life mystery and justice.",
      fileUrl: "/downloads/true-crime.pdf",
    },
  ];

  const structuredData = ebooks.map((ebook) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: ebook.title,
    image: `https://digitalproductsartisan.com${ebook.image}`,
    description: ebook.description,
    sku: ebook.id,
    offers: {
      "@type": "Offer",
      url: `https://digitalproductsartisan.com/categories/ebooks`,
      priceCurrency: "EUR",
      price: ebook.price.toFixed(2),
      availability: "https://schema.org/InStock",
    },
  }));

  return (
    <>
      <Head>
        <title>eBooks Collection | Digital Products Artisan</title>
        <meta name="description" content="Browse our premium collection of downloadable eBooks across genres — fantasy, self-help, sci-fi and more." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10">📚 eBooks Collection</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {ebooks.map((ebook) => (
            <div
              key={ebook.id}
              className="border rounded-xl p-4 shadow hover:shadow-lg transition"
            >
              <img
                src={ebook.image}
                alt={ebook.title}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{ebook.title}</h2>
              <p className="text-gray-600 text-sm mb-2">{ebook.description}</p>
              <p className="text-lg font-bold mb-3">€{ebook.price.toFixed(2)}</p>
              <button
                className="snipcart-add-item bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                data-item-id={ebook.id}
                data-item-name={ebook.title}
                data-item-price={ebook.price}
                data-item-url="/categories/ebooks"
                data-item-description={ebook.description}
                data-item-image={ebook.image}
                data-item-file-guid={ebook.fileUrl}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
