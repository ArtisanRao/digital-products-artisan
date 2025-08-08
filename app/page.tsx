import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            Welcome to Digital Products Artisan
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Your one-stop shop for premium digital assets — templates, tools,
            guides, and more to help your business thrive.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <a
              href="/products"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Browse Products
            </a>
            <a
              href="/categories"
              className="px-6 py-3 bg-white text-gray-900 border border-gray-300 font-medium rounded-lg hover:bg-gray-100 transition"
            >
              Explore Categories
            </a>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-5"
              >
                <img
                  src={`/images/product-${item}.jpg`}
                  alt={`Product ${item}`}
                  className="rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">
                  Product Title {item}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Short description of the product highlighting its benefits and
                  features.
                </p>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
