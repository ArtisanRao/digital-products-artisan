'use client';

export default function VideoResourcesPage() {
  const videos = [
    {
      id: "broll-pack",
      title: "B-Roll Video Backgrounds Pack",
      image: "/images/video-resources-cover.jpg",
      price: 6.99,
      description: "High-quality loopable clips for transitions and visual fillers.",
      fileUrl: "/downloads/broll-pack.zip",
    },
    {
      id: "youtube-templates",
      title: "YouTube Intro/Outro Templates",
      image: "/images/marketing-tools-cover.jpg",
      price: 5.49,
      description: "Customizable intro/outro clips to boost your brand identity.",
      fileUrl: "/downloads/youtube-templates.zip",
    },
    {
      id: "animated-titles",
      title: "Animated Titles & Transitions",
      image: "/images/animated-titles-&-animations-cover.jpg",
      price: 5.95,
      description: "Smooth text animations and video transitions for editing pros.",
      fileUrl: "/downloads/animated-titles.zip",
    },
    {
      id: "stock-footage",
      title: "Stock Footage Mega Bundle",
      image: "/images/stock-footage-mega-bundle-cover.jpg",
      price: 7.25,
      description: "A complete bundle of stock clips across categories & moods.",
      fileUrl: "/downloads/stock-footage.zip",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">🎥 Video Resources</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((item) => (
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
              data-item-url="/categories/video-resources"
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
