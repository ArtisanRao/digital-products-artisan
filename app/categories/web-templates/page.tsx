'use client';

export default function WebTemplatesPage() {
  const templates = [
    {
      id: "landing-pages",
      title: "Landing Page Template Kit",
      image: "/images/web-templates-cover.jpg",
      price: 6.75,
      description: "Modern and responsive landing pages in HTML, Figma & Canva.",
      fileUrl: "/downloads/landing-pages.zip",
    },
    {
      id: "portfolio-template",
      title: "Portfolio Website Template",
      image: "/images/memoir-autobiography.jpg",
      price: 5.25,
      description: "Showcase your skills and work with this elegant portfolio design.",
      fileUrl: "/downloads/portfolio-template.zip",
    },
    {
      id: "business-ui-kit",
      title: "Business Website UI Kit",
      image: "/images/mystery-thriller-novel.jpg",
      price: 7.49,
      description: "Complete UI elements and layouts for business websites.",
      fileUrl: "/downloads/ui-kit.zip",
    },
    {
      id: "blog-starter",
      title: "Personal Blog Starter Pack",
      image: "/images/ebooks-cover.jpg",
      price: 4.95,
      description: "Quick-start blog setup with styles, layouts, and assets.",
      fileUrl: "/downloads/blog-template.zip",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">🌐 Web Templates</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((item) => (
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
              data-item-url="/categories/web-templates"
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
