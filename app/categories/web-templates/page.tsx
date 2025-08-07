'use client';

export default function WebTemplatesPage() {
  const webTemplates = [
    {
      id: "portfolio-starter-kit",
      title: "Portfolio Starter Kit",
      image: "/images/web-templates-cover.jpg",
      price: 6.95,
      description: "Modern personal portfolio template (HTML, CSS, JS).",
      fileUrl: "/downloads/portfolio-starter-kit.zip",
    },
    {
      id: "business-landing-page",
      title: "Business Landing Page",
      image: "/images/business-templates-cover.jpg",
      price: 5.50,
      description: "Clean and responsive landing page for startups.",
      fileUrl: "/downloads/business-landing-page.zip",
    },
    {
      id: "ui-components-pack",
      title: "UI Components Pack",
      image: "/images/icons-cover.jpg",
      price: 4.75,
      description: "Reusable components for rapid web development.",
      fileUrl: "/downloads/ui-components-pack.zip",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">🌐 Web Templates</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {webTemplates.map((item) => (
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
