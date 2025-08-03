'use client';

export default function BestSellersPage() {
  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">🔥 Best-Selling Digital Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Product 1 */}
        <div className="border rounded-xl p-4 shadow-md">
          <img
            src="/products/chatgpt-guide.jpg"
            alt="Mastering ChatGPT"
            className="rounded mb-4"
          />
          <h2 className="text-xl font-semibold mb-1">Mastering ChatGPT for Business</h2>
          <p className="text-gray-600 mb-2">A detailed PDF guide to unlock AI productivity.</p>
          <p className="text-lg font-bold mb-3">€9.99</p>
          <button
            className="snipcart-add-item bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            data-item-id="chatgpt-business"
            data-item-name="Mastering ChatGPT for Business"
            data-item-price="9.99"
            data-item-url="/bestsellers"
            data-item-description="PDF guide to using ChatGPT effectively"
            data-item-image="/products/chatgpt-guide.jpg"
            data-item-file-guid="your-download-url-1"
          >
            Add to Cart
          </button>
        </div>

        {/* Product 2 */}
        <div className="border rounded-xl p-4 shadow-md">
          <img
            src="/products/canva-pack.jpg"
            alt="Canva Templates Mega Pack"
            className="rounded mb-4"
          />
          <h2 className="text-xl font-semibold mb-1">Canva Templates Mega Pack</h2>
          <p className="text-gray-600 mb-2">100+ drag-and-drop templates for social media.</p>
          <p className="text-lg font-bold mb-3">€14.99</p>
          <button
            className="snipcart-add-item bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            data-item-id="canva-pack"
            data-item-name="Canva Templates Mega Pack"
            data-item-price="14.99"
            data-item-url="/bestsellers"
            data-item-description="Social media Canva templates"
            data-item-image="/products/canva-pack.jpg"
            data-item-file-guid="your-download-url-2"
          >
            Add to Cart
          </button>
        </div>

        {/* Product 3 */}
        <div className="border rounded-xl p-4 shadow-md">
          <img
            src="/products/excel-tracker.jpg"
            alt="Excel Tracker Pro"
            className="rounded mb-4"
          />
          <h2 className="text-xl font-semibold mb-1">Excel Tracker Pro</h2>
          <p className="text-gray-600 mb-2">Track expenses, projects, and habits like a pro.</p>
          <p className="text-lg font-bold mb-3">€7.99</p>
          <button
            className="snipcart-add-item bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            data-item-id="excel-tracker"
            data-item-name="Excel Tracker Pro"
            data-item-price="7.99"
            data-item-url="/bestsellers"
            data-item-description="All-in-one Excel productivity tracker"
            data-item-image="/products/excel-tracker.jpg"
            data-item-file-guid="your-download-url-3"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}
