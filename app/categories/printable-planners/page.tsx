<!-- Printable Planners Page -->

import Image from "next/image";

export default function PrintablePlannersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Printable Planners</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Daily Productivity Planner",
            price: "9.99",
            image: "/images/daily-productivity-planner-cover.jpg",
            url: "/products/daily-productivity-planner",
            guid: "GUID1"
          },
          {
            title: "Weekly Family Organizer",
            price: "8.99",
            image: "/images/weekly-family-organizer-cover.jpg",
            url: "/products/weekly-family-organizer",
            guid: "GUID2"
          },
          {
            title: "Student Study Planner",
            price: "6.99",
            image: "/images/student-study-planner-cover.jpg",
            url: "/products/student-study-planner",
            guid: "GUID7"
          },
          {
            title: "2025 Business Planner",
            price: "11.99",
            image: "/images/2025-business-planner-cover.jpg",
            url: "/products/2025-business-planner",
            guid: "GUID8"
          },
          {
            title: "Animated Titles & Animations",
            price: "12.00",
            image: "/images/animated-titles-&-animations-cover.jpg",
            url: "/products/animated-titles-and-animations",
            guid: "GUID5"
          },
          {
            title: "Stock Footage Mega Bundle",
            price: "29.00",
            image: "/images/stock-footage-mega-bundle-cover.jpg",
            url: "/products/stock-footage-mega-bundle",
            guid: "GUID6"
          }
        ].map((product) => (
          <div key={product.title} className="bg-white rounded-xl shadow-md overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
              <p className="text-gray-700 mb-4">${product.price}</p>
              <button
                className="snipcart-add-item bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                data-item-id={product.title.replace(/\s+/g, '-').toLowerCase()}
                data-item-name={product.title}
                data-item-price={product.price}
                data-item-url={product.url}
                data-item-file-guid={product.guid}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
