'use client';

export default function MarketingToolsPage() {
  const tools = [
    {
      id: "social-media-kit",
      title: "Social Media Kit Pro",
      image: "/images/social-media-kits-cover.jpg", // ✅ should exist
      price: 6.99,
      description: "Editable Canva and PSD assets for Instagram, LinkedIn & more.",
      fileUrl: "/downloads/social-media-kit-pro.zip",
    },
    {
      id: "email-templates-pack",
      title: "Email Templates Pack",
      image: "/images/marketing-tools-cover.jpg", // ✅ should exist
      price: 4.50,
      description: "High-converting email layouts and swipe files.",
      fileUrl: "/downloads/email-templates-pack.zip",
    },
    {
      id: "sales-funnel-builder",
      title: "Sales Funnel Builder Toolkit",
      image: "/images/business-templates-cover.jpg", // ✅ confirm this one too
      price: 7.25,
      description: "Wireframes and templates to build landing pages and funnels.",
      fileUrl: "/downloads/sales-funnel-builder.zip",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">📥 Marketing Tools</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={tool.image}
              alt={tool.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{tool.title}</h2>
            <p className="text-gray-600 text-sm mb-2">{tool.description}</p>
            <p className="text-lg font-bold mb-3">€{tool.price.toFixed(2)}</p>
            <button
              className="snipcart-add-item bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              data-item-id={tool.id}
              data-item-name={tool.title}
              data-item-price={tool.price}
              data-item-url="/categories/marketing-tools"
              data-item-description={tool.description}
              data-item-image={tool.image}
              data-item-custom1-name="download_url"
              data-item-custom1-value={tool.fileUrl}
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
