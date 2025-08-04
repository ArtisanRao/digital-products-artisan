'use client';

export default function PhotographyPrintsPage() {
  const prints = [
    {
      id: "nature-landscapes",
      title: "Nature Landscapes Pack",
      image: "/images/photography-prints-cover.jpg",
      price: 6.75,
      description: "A stunning collection of printable scenic landscape shots.",
      fileUrl: "/downloads/nature-landscapes.zip",
    },
    {
      id: "urban-aesthetic",
      title: "Urban Aesthetic Print Set",
      image: "/images/digital-art-cover.jpg",
      price: 5.25,
      description: "Explore city life through a modern, artistic lens.",
      fileUrl: "/downloads/urban-aesthetic.zip",
    },
    {
      id: "monochrome-moods",
      title: "Monochrome Mood Collection",
      image: "/images/true-crime-novel.jpg",
      price: 4.95,
      description: "Black & white photo art prints for minimalist lovers.",
      fileUrl: "/downloads/monochrome-moods.zip",
    },
    {
      id: "bokeh-pack",
      title: "Abstract Bokeh Photography Pack",
      image: "/images/print-designs-cover.jpg",
      price: 5.99,
      description: "Colorful light-blur textures for background art or decor.",
      fileUrl: "/downloads/bokeh-pack.zip",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">📸 Photography Prints</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {prints.map((item) => (
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
              data-item-url="/categories/photography-prints"
              data-item-description={item.description}
              data-item-image={item.image}
              data-item-file-guid={item.fileUrl}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
