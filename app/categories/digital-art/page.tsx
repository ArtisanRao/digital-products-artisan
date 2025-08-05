'use client';

export default function DigitalArtPage() {
  const artworks = [
    {
      id: "abstract-prints",
      title: "Abstract Print Series",
      image: "/images/digital-art-cover.jpg",
      price: 4.99,
      description: "Modern wall art bundle for printing or digital use.",
      fileUrl: "/downloads/abstract-print-series.zip",
    },
    {
      id: "fantasy-concept-art",
      title: "Fantasy Concept Art Collection",
      image: "/images/fantasy-novel-cover.jpg", // ✅ updated with -cover
      price: 6.49,
      description: "Epic fantasy artworks for creatives and storytellers.",
      fileUrl: "/downloads/fantasy-art.zip",
    },
    {
      id: "motivational-prompts",
      title: "Motivational Prompt Posters",
      image: "/images/motivational-prompt-pack.jpg", // already okay
      price: 3.99,
      description: "Printable affirmations and quotes for your wall or feed.",
      fileUrl: "/downloads/motivational-prompts.pdf",
    },
    {
      id: "print-designs",
      title: "Creative Print Design Set",
      image: "/images/print-designs-cover.jpg",
      price: 5.99,
      description: "Professionally designed printable artworks.",
      fileUrl: "/downloads/print-designs.zip",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">🎨 Digital Art Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {artworks.map((art) => (
          <div
            key={art.id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={art.image}
              alt={art.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{art.title}</h2>
            <p className="text-gray-600 text-sm mb-2">{art.description}</p>
            <p className="text-lg font-bold mb-3">€{art.price.toFixed(2)}</p>
            <button
              className="snipcart-add-item bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              data-item-id={art.id}
              data-item-name={art.title}
              data-item-price={art.price}
              data-item-url="/categories/digital-art"
              data-item-description={art.description}
              data-item-image={art.image}
              data-item-file-guid={art.fileUrl}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
