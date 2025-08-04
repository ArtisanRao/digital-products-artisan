'use client';

export default function AudioSamplesPage() {
  const samples = [
    {
      id: "lofi-beats",
      title: "Lo-Fi Chill Beat Pack",
      image: "/images/audio-samples-cover.jpg",
      price: 5.75,
      description: "Smooth lo-fi tracks perfect for backgrounds, reels, and vlogs.",
      fileUrl: "/downloads/lofi-beats.zip",
    },
    {
      id: "cinematic-sfx",
      title: "Cinematic Sound Effects Pack",
      image: "/images/mystery-thriller-novel.jpg",
      price: 6.25,
      description: "Booms, risers, drones, and FX for cinematic impact.",
      fileUrl: "/downloads/sfx-pack.zip",
    },
    {
      id: "podcast-kit",
      title: "Royalty-Free Podcast Kit",
      image: "/images/memoir-autobiography.jpg",
      price: 4.95,
      description: "Intro/outro music, transitions, and effects for podcasters.",
      fileUrl: "/downloads/podcast-kit.zip",
    },
    {
      id: "nature-soundscapes",
      title: "Ambient Nature Soundscapes",
      image: "/images/health-and-fitness-book.jpg",
      price: 5.49,
      description: "Relaxing forest, ocean, and rain audio for meditation or focus.",
      fileUrl: "/downloads/nature-audio.zip",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">🎵 Audio Samples</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {samples.map((item) => (
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
              data-item-url="/categories/audio-samples"
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
