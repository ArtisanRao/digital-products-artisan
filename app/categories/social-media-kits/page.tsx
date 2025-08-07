
'use client';

export default function SocialMediaKitsPage() {
  const products = [
    {
      id: "instagram-branding-kit",
      title: "Instagram Branding Kit",
      image: "/images/instagram-branding-kit-cover.jpg",
      price: 9.99,
      description: "Editable templates optimized for Instagram branding.",
      fileGuid: "GUID1",
    },
    {
      id: "pinterest-growth-pack",
      title: "Pinterest Growth Pack",
      image: "/images/pinterest-growth-pack-cover.jpg",
      price: 8.99,
      description: "Styled Pinterest pins and templates to boost traffic.",
      fileGuid: "GUID2",
    },
    {
      id: "facebook-ad-templates",
      title: "Facebook Ad Templates",
      image: "/images/facebook-ad-templates-cover.jpg",
      price: 7.99,
      description: "Ready-for-use Facebook ad templates in PNG format.",
      fileGuid: "GUID3",
    },
    {
      id: "canva-social-media-bundle",
      title: "Canva Social Media Bundle",
      image: "/images/canva-social-media-bundle-cover.jpg",
      price: 12.99,
      description: "A bundle of Canva templates for multiple platforms.",
      fileGuid: "GUID4",
    },
    {
      id: "instagram-story-templates",
      title: "Instagram Story Templates",
      image: "/images/instagram-story-templates-cover.jpg",
      price: 6.99,
      description: "Stylish Stories designs for promotions or engagement.",
      fileGuid: "GUID5",
    },
    {
      id: "youtube-channel-kit",
      title: "YouTube Channel Kit",
      image: "/images/youtube-channel-kit-cover.jpg",
      price: 10.0,
      description: "Cover art, thumbnails, and banner templates included.",
      fileGuid: "GUID6",
    },
    {
      id: "chatgpt-guide",
      title: "ChatGPT Guide for Social Media",
      image: "/images/chatgpt-guide-cover.jpg",
      price: 11.99,
      description: "Learn how to use ChatGPT to generate content ideas, captions, and ads.",
      fileGuid: "GUID7",
    },
    {
      id: "excel-social-tracker",
      title: "Excel Tracker for Social Media",
      image: "/images/excel-tracker-cover.jpg",
      price: 5.99,
      description: "Simple Excel tracker for posts, analytics, and performance.",
      fileGuid: "GUID8",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-10">Social Media Kits</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((item) => (
          <div key={item.id} className="border rounded-xl p-4 shadow hover:shadow-lg transition">
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
              data-item-url="/categories/social-media-kits"
              data-item-description={item.description}
              data-item-image={item.image}
              data-item-file-guid={item.fileGuid}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
