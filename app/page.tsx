import Header from "@/components/header";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-white py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
              Your Marketplace for Premium Digital Products
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              Browse, purchase, and download instantly from our curated
              collection of templates, art, resources, and more.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <a
                href="/products"
                className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
              >
                Explore Products
              </a>
              <a
                href="/bundles"
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100"
              >
                View Bundles
              </a>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">Best Sellers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Product Card */}
              <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <img
                  src="/images/product-1.jpg"
                  alt="Product 1"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold">Self-Help Success Guide</h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    A comprehensive guide to personal and professional growth.
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-indigo-600 font-bold">$15.00</span>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Add more product cards as needed */}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
