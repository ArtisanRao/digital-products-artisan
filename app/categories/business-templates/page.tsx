'use client';

export default function TemplatesPage() {
  const templates = [
    {
      id: "canva-mega-pack",
      title: "Canva Templates Mega Pack",
      image: "/images/business-templates-cover.jpg",
      price: 9.99,
      description: "Over 100 business, social, and branding templates for Canva.",
      fileUrl: "/downloads/canva-mega-pack.zip",
    },
    {
      id: "excel-tracker-pro",
      title: "Excel Tracker Pro",
      image: "/images/the-code-of-success-cover.jpg", // ✅ updated with -cover
      price: 4.99,
      description: "Advanced Excel template for project & habit tracking.",
      fileUrl: "/downloads/excel-tracker-pro.xlsx",
    },
    {
      id: "notion-planner-bundle",
      title: "Notion Productivity Planner",
      image: "/images/50-powerful-prompts-notion-format.jpg",
      price: 6.49,
      description: "Organize tasks, goals, and routines inside Notion.",
      fileUrl: "/downloads/notion-planner.zip",
    },
    {
      id: "resume-kit-pro",
      title: "Professional Resume Kit",
      image: "/images/resume-templates-cover.jpg",
      price: 5.75,
      description: "Clean and modern CV templates in Word and PDF.",
      fileUrl: "/downloads/resume-kit.zip",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">🧾 Business & Creative Templates</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={template.image}
              alt={template.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{template.title}</h2>
            <p className="text-gray-600 text-sm mb-2">{template.description}</p>
            <p className="text-lg font-bold mb-3">€{template.price.toFixed(2)}</p>
            <button
              className="snipcart-add-item bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              data-item-id={template.id}
              data-item-name={template.title}
              data-item-price={template.price}
              data-item-url="/categories/templates"
              data-item-description={template.description}
              data-item-image={template.image}
              data-item-custom1-name="download_url"
              data-item-custom1-value={template.fileUrl}
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
