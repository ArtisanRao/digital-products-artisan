import Image from "next/image";

export default function SocialMediaKitsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Social Media Kits</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Instagram Branding Kit",
            price: "9.99",
            image: "/images/instagram-branding-kit-cover.jpg",
            url: "/products/instagram-branding-kit",
            guid: "GUID1"
          },
          {
            title: "Pinterest Growth Pack",
            price: "8.99",
            image: "/images/pinterest-growth-pack-cover.jpg",
            url: "/products/pinterest-growth-pack",
            guid: "GUID2"
          },
          {
            title: "Facebook Ad Templates",
            price: "7.99",
            image: "/images/facebook-ad-templates-cover.jpg",
            url: "/products/facebook-ad-templates",
            guid: "GUID3"
          },
          {
            title: "Canva Social Media Bundle",
            price: "12.99",
            image: "/images/canva-social-media-bundle-cover.jpg",
            url: "/products/canva-social-media-bundle",
            guid: "GUID4"
          },
          {
            title: "Instagram Story Templates",
            price: "6.99",
            image: "/images/instagram-story-templates-cover.jpg",
            url: "/products/instagram-story-templates",
            guid: "GUID5"
          },
          {
            title: "YouTube Channel Kit",
            price: "10.00",
            image: "/images/youtube-channel-kit-cover.jpg",
            url: "/products/youtube-channel-kit",
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
