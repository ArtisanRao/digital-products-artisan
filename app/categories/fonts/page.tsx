'use client';

export default function FontsPage() {
  const fonts = [
    {
      id: "display-fonts",
      title: "Creative Display Fonts",
      image: "/images/fonts-cover.jpg",
      price: 4.95,
      description: "Bold, eye-catching fonts for headlines and posters.",
      fileUrl: "/downloads/display-fonts.zip",
    },
    {
      id: "script-fonts",
      title: "Handwritten Script Pack",
      image: "/images/romance-novel1.jpg",
      price: 5.25,
      description: "Elegant handwriting fonts perfect for branding & quotes.",
      fileUrl: "/downloads/script-fonts.zip",
    },
    {
      id: "sans-serif-set",
      title: "Modern Sans Serif Set",
      image: "/images/romance-novel.jpg",
      price: 3.99,
      description: "Clean and versatile fonts for professional use.",
      fileUrl: "/downloads/sans-serif-fonts.zip",
    },
    {
      id: "vintage-typewriter",
      title: "Vintage Typewriter Font",
      image: "/images/historical-fiction-novel.jpg",
      price: 4.75,
      description: "Retro typewriter-style font for classic vibes.",
      fileUrl: "/downloads/vintage-font.zip",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">🔤 Font Packs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {fonts.map((font) => (
          <div
            key={font.id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={font.image}
              alt={font.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{font.title}</h2>
            <p className="text-gray-600 text-sm mb-2">{font.description}</p>
            <p className="text-lg font-bold mb-3">€{font.price.toFixed(2)}</p>
            <button
              className="snipcart-add-item bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              data-item-id={font.id}
              data-item-name={font.title}
              data-item-price={font.price}
              data-item-url="/categories/fonts"
              data-item-description={font.description}
              data-item-image={font.image}
              data-item-file-guid={font.fileUrl}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
