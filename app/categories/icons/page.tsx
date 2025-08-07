'use client';

export default function IconsPage() {
  const icons = [
    {
      id: "minimal-icons",
      title: "Minimal Line Icon Pack",
      image: "/images/icons-cover.jpg",
      price: 4.25,
      description: "Clean and versatile line icons for modern interfaces.",
      fileUrl: "/downloads/minimal-icons.zip",
    },
    {
      id: "gradient-ui-icons",
      title: "Gradient UI Icons",
      image: "/images/software-plugins-cover.jpg",
      price: 4.95,
      description: "Stylish gradient icons perfect for apps and web UIs.",
      fileUrl: "/downloads/gradient-icons.zip",
    },
    {
      id: "finance-icons",
      title: "Business & Finance Icons",
      image: "/images/business-&-finance-icons-cover.jpg",
      price: 3.99,
      description: "Icons representing analytics, currency, and finance tools.",
      fileUrl: "/downloads/finance-icons.zip",
    },
    {
      id: "social-icons",
      title: "Social Media Icon Set",
      image: "/images/social-media-kits-cover.jpg",
      price: 4.49,
      description: "Flat and colorful icons for social platforms and sharing.",
      fileUrl: "/downloads/social-icons.zip",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">🔘 Icon Sets</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {icons.map((icon) => (
          <div
            key={icon.id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={icon.image}
              alt={icon.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{icon.title}</h2>
            <p className="text-gray-600 text-sm mb-2">{icon.description}</p>
            <p className="text-lg font-bold mb-3">€{icon.price.toFixed(2)}</p>
            <button
              className="snipcart-add-item bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              data-item-id={icon.id}
              data-item-name={icon.title}
              data-item-price={icon.price}
              data-item-url="/categories/icons"
              data-item-description={icon.description}
              data-item-image={icon.image}
              data-item-custom1-name="download_url"
              data-item-custom1-value={icon.fileUrl}
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
