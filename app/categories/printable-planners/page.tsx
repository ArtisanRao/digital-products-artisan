'use client';

export default function PrintablePlannersPage() {
  const planners = [
    {
      id: "daily-productivity-planner",
      title: "Daily Productivity Planner",
      image: "/images/daily-productivity-planner-cover.jpg",
      price: 9.99,
      description: "Stay organized and focused with this printable daily planner.",
      fileUrl: "/downloads/daily-productivity-planner.zip",
    },
    {
      id: "weekly-family-organizer",
      title: "Weekly Family Organizer",
      image: "/images/weekly-family-organizer-cover.jpg",
      price: 8.99,
      description: "Coordinate your family's weekly activities with ease.",
      fileUrl: "/downloads/weekly-family-organizer.zip",
    },
    {
      id: "health-wellness-tracker",
      title: "Health & Wellness Tracker",
      image: "/images/health-&-wellness-tracker-cover.jpg",
      price: 6.75,
      description: "Track your fitness, meals, water intake and mental health.",
      fileUrl: "/downloads/health-wellness-tracker.zip",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">🗓️ Printable Planners</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {planners.map((item) => (
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
              data-item-url="/categories/printable-planners"
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
