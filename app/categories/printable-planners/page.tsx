'use client';

export default function PrintablePlannersPage() {
  const planners = [
    {
      id: "daily-productivity",
      title: "Daily Productivity Planner",
      image: "/images/printable-planners-cover.jpg",
      price: 4.25,
      description: "Plan your day efficiently and boost your productivity.",
      fileUrl: "/downloads/daily-productivity.pdf",
    },
    {
      id: "fitness-tracker",
      title: "Fitness & Meal Tracker",
      image: "/images/health-and-fitness-book.jpg",
      price: 3.95,
      description: "Track workouts, meals, and progress all in one place.",
      fileUrl: "/downloads/fitness-meal-tracker.pdf",
    },
    {
      id: "goal-journal",
      title: "Goal Setting & Vision Journal",
      image: "/images/self-help-personal-development-book.jpg",
      price: 4.75,
      description: "Set meaningful goals and visualize success.",
      fileUrl: "/downloads/goal-vision-journal.pdf",
    },
    {
      id: "monthly-budget",
      title: "Monthly Budget Organizer",
      image: "/images/excel-tracker-pro.jpg",
      price: 5.25,
      description: "Easily manage your finances with this editable tracker.",
      fileUrl: "/downloads/monthly-budget-tracker.xlsx",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">🗓️ Printable Planners</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {planners.map((planner) => (
          <div
            key={planner.id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={planner.image}
              alt={planner.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{planner.title}</h2>
            <p className="text-gray-600 text-sm mb-2">{planner.description}</p>
            <p className="text-lg font-bold mb-3">€{planner.price.toFixed(2)}</p>
            <button
              className="snipcart-add-item bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              data-item-id={planner.id}
              data-item-name={planner.title}
              data-item-price={planner.price}
              data-item-url="/categories/printable-planners"
              data-item-description={planner.description}
              data-item-image={planner.image}
              data-item-file-guid={planner.fileUrl}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
