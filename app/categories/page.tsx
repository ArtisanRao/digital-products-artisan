import Link from "next/link";

const categories = [
  {
    title: "📚 eBooks",
    image: "/images/ebooks-cover.jpg",
    slug: "ebooks",
  },
  {
    title: "🎨 Digital Art",
    image: "/images/digital-art-cover.jpg",
    slug: "digital-art",
  },
  {
    title: "🧾 Templates",
    image: "/images/business-templates-cover.jpg",
    slug: "templates",
  },
  {
    title: "📥 Marketing Tools",
    image: "/images/marketing-tools-cover.jpg",
    slug: "marketing-tools",
  },
  {
    title: "🗓️ Printable Planners",
    image: "/images/printable-planners-cover.jpg",
    slug: "printable-planners",
  },
  {
    title: "📸 Photography Prints",
    image: "/images/photography-prints-cover.jpg",
    slug: "photography-prints",
  },
  {
    title: "🔤 Fonts",
    image: "/images/fonts-cover.jpg",
    slug: "fonts",
  },
  {
    title: "🔌 Software Plugins",
    image: "/images/software-plugins-cover.jpg",
    slug: "software-plugins",
  },
  {
    title: "🎥 Video Resources",
    image: "/images/video-resources-cover.jpg",
    slug: "video-resources",
  },
  {
    title: "🎵 Audio Samples",
    image: "/images/audio-samples-cover.jpg",
    slug: "audio-samples",
  },
  {
    title: "🌐 Web Templates",
    image: "/images/web-templates-cover.jpg",
    slug: "web-templates",
  },
  {
    title: "📱 Social Media Kits",
    image: "/images/social-media-kits-cover.jpg",
    slug: "social-media-kits",
  },
  {
    title: "📄 Resume Templates",
    image: "/images/resume-templates-cover.jpg",
    slug: "resume-templates",
  },
  {
    title: "🔘 Icons",
    image: "/images/icons-cover.jpg",
    slug: "icons",
  },
];

export default function CategoriesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">Browse by Category</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link
            href={`/categories/${category.slug}`}
            key={category.slug}
            className="block overflow-hidden border rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={category.image}
              alt={category.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{category.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
