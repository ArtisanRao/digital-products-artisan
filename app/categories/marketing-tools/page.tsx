'use client';

export default function MarketingToolsPage() {
  const tools = [
    {
      id: "marketing-toolkit",
      title: "Ultimate Marketing Toolkit",
      image: "/images/marketing-tools-cover.jpg",
      price: 8.99,
      description: "Email templates, launch planners, checklists, and more.",
      fileUrl: "/downloads/marketing-toolkit.zip",
    },
    {
      id: "email-swipes",
      title: "Email Copy Swipe File",
      image: "/images/email-swipe-file.jpg",
      price: 4.49,
      description: "High-converting copywriting examples for every niche.",
      fileUrl: "/downloads/email-swipes.pdf",
    },
    {
      id: "pinterest-templates",
      title: "Pinterest Pin Templates",
      image: "/images/pinterest-templates.jpg",
      price: 3.99,
      description: "Attractive Canva designs to boost Pinterest traffic.",
      fileUrl: "/downloads/pinterest-templates.zip",
    },
    {
      id: "ig-post-scheduler",
      title: "Instagram Post Scheduler (Editable)",
      image: "/images/instagram-calendar.jpg",
      price: 5.49,
      description: "Plan your content calendar week by week in advance.",
      fileUrl: "/downloads/ig-scheduler.zip",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">📥 Marketing Tools</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((item) => (
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
              data-item-url="/categories/marketing-tools"
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
