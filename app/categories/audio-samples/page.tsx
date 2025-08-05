'use client';

export default function AudioSamplesPage() {
  const audioPacks = [
    {
      id: "cinematic-sound-pack",
      title: "Cinematic Sound Effects Pack",
      image: "/images/audio-samples-cover.jpg",
      price: 5.99,
      description: "High-quality sounds for film, games, and trailers.",
      fileUrl: "/downloads/cinematic-sound-pack.zip",
    },
    {
      id: "motivational-intros",
      title: "Motivational Podcast Intros",
      image: "/images/the-code-of-success-cover.jpg", // ✅ updated with -cover
      price: 3.75,
      description: "Uplifting intros and transitions for audio creators.",
      fileUrl: "/downloads/motivational-intros.zip",
    },
    {
      id: "calm-ambient-kit",
      title: "Calm Ambient Background Kit",
      image: "/images/mystery-thriller-novel-cover.jpg", // ✅ updated with -cover
      price: 4.25,
      description: "Peaceful audio beds for mindfulness and meditation.",
      fileUrl: "/downloads/calm-ambient-kit.zip",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">🎵 Audio Samples</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {audioPacks.map((audio) => (
          <div
            key={audio.id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={audio.image}
              alt={audio.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{audio.title}</h2>
            <p className="text-gray-600 text-sm mb-2">{audio.description}</p>
            <p className="text-lg font-bold mb-3">€{audio.price.toFixed(2)}</p>
            <button
              className="snipcart-add-item bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              data-item-id={audio.id}
              data-item-name={audio.title}
              data-item-price={audio.price}
              data-item-url="/categories/audio-samples"
              data-item-description={audio.description}
              data-item-image={audio.image}
              data-item-custom1-name="download_url"
              data-item-custom1-value={audio.fileUrl}
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
