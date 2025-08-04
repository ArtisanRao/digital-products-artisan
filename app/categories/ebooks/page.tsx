'use client';

export default function EbooksPage() {
  const products = [
    {
      id: 'code-of-success',
      title: 'The Code of Success',
      image: '/images/the-code-of-success.jpg',
      price: 4.99,
      description: 'Success strategies & motivation prompts',
      fileUrl: '/downloads/the-code-of-success.zip',
    },
    {
      id: 'science-fiction-novel',
      title: 'Science Fiction Novel',
      image: '/images/science-fiction-novel.jpg',
      price: 3.99,
      description: 'A thrilling science fiction adventure.',
      fileUrl: '/downloads/science-fiction-novel.zip',
    },
    {
      id: 'self-help-book',
      title: 'Self-Help & Personal Development',
      image: '/images/self-help-personal-development-book.jpg',
      price: 5.49,
      description: 'Guides for improving yourself and your mindset.',
      fileUrl: '/downloads/self-help-book.zip',
    },
    {
      id: 'romance-novel',
      title: 'Romance Novel',
      image: '/images/romance-novel.jpg',
      price: 3.49,
      description: 'A heartwarming romantic tale.',
      fileUrl: '/downloads/romance-novel.zip',
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">📚 eBooks</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-gray-600 text-sm mb-2">{item.description}</p>
            <p className="text-lg font-bold mb-3">€{item.price.toFixed(2)}</p>
            <button
              className="snipcart-add-item bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              data-item-id={item.id}
              data-item-name={item.title}
              data-item-price={item.price}
              data-item-url="/categories/ebooks"
              data-item-description={item.description}
              data-item-image={item.image}
              data-item-custom1-name="download_url"
              data-item-custom1-value={item.fileUrl}
              data-item-custom1-type="hidden"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
