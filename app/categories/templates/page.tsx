'use client';

export default function TemplatesPage() {
  const templates = [
    {
      id: "business-template-pack",
      title: "Business Template Pack",
      image: "/images/business-templates-cover.jpg",
      price: 6.99,
      description: "Essential business documents and tools in editable formats.",
      fileUrl: "/downloads/business-templates.zip",
    },
    {
      id: "resume-bundle",
      title: "Resume Template Bundle",
      image: "/images/resume-templates-cover.jpg",
      price: 4.49,
      description: "Polished, ATS-friendly resume formats for every profession.",
      fileUrl: "/downloads/resume-templates.zip",
    },
    {
      id: "social-media-kit",
      title: "Social Media Content Kit",
      image: "/images/social-media-kits-cover.jpg",
      price: 5.25,
      description: "Pre-made templates for social growth across platforms.",
      fileUrl: "/downloads/social-media-kit.zip",
    },
    {
      id: "notion-dashboard",
      title: "Notion Project Dashboard",
      image: "/images/50-powerful-prompts-notion-format.jpg",
      price: 3.99,
      description: "Organize tasks, ideas, and timelines with ease.",
      fileUrl: "/downloads/notion-dashboard.zip",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">🧾 Templates Collection</h1>
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
              data-item-url="/categories/templates"
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
