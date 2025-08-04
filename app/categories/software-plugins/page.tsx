'use client';

export default function SoftwarePluginsPage() {
  const plugins = [
    {
      id: "productivity-extensions-bundle",
      title: "Productivity Extensions Bundle",
      image: "/images/software-plugins-cover.jpg",
      price: 6.95,
      description: "Chrome extensions and tools to boost workflow and efficiency.",
      fileUrl: "/downloads/productivity-extensions.zip",
    },
    {
      id: "creative-tools-designer",
      title: "Creative Tools for Designers",
      image: "/images/digital-art-cover.jpg",
      price: 5.75,
      description: "Design-focused plugins and mockup generators.",
      fileUrl: "/downloads/creative-designer-tools.zip",
    },
    {
      id: "notion-automation-pack",
      title: "Notion Automation Plugins",
      image: "/images/50-powerful-prompts-notion-format.jpg",
      price: 4.95,
      description: "Custom integrations and scripts for Notion workflows.",
      fileUrl: "/downloads/notion-automation-pack.zip",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">🧩 Software Plugins</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {plugins.map((item) => (
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
              data-item-url="/categories/software-plugins"
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
