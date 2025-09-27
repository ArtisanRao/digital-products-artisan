// app/bundles/[slug]/page.tsx
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import InlineMore from "@/components/ui/inline-more";
import Link from "next/link";
import SimpleGallery from "@/components/ui/simple-gallery";

type Bundle = {
  slug: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  images?: string[];
  items: string[];
  rating: number;
  reviews: number;
};

const BUNDLES: Bundle[] = [
  {
    slug: "complete-creator-bundle",
    title: "Complete Creator Bundle",
    description: "Everything you need to start and grow your creative business.",
    price: 79.99,
    originalPrice: 149.99,
    image: "/images/bundles/complete-creator-bundle-cover.jpg",
    images: ["/images/bundles/complete-creator-bundle-cover.jpg"],
    items: [
      "Ultimate AI Prompt Pack",
      "Canva Template Bundle",
      "Digital Marketing Ebook",
      "Notion Productivity System",
      "Instagram Story Templates",
      "Brand Identity Kit",
      "Content Calendar Template",
      "Email Marketing Templates",
    ],
    rating: 4.9,
    reviews: 156,
  },
  {
    slug: "social-media-master-pack",
    title: "Social Media Master Pack",
    description: "Templates and guides for dominating social media platforms.",
    price: 49.99,
    originalPrice: 89.99,
    image: "/images/bundles/social-media-master-pack-cover.jpg",
    images: ["/images/bundles/social-media-master-pack-cover.jpg"],
    items: [
      "Instagram Story Templates",
      "Facebook Post Templates",
      "LinkedIn Content Kit",
      "Social Media Strategy Guide",
      "Hashtag Research Tool",
    ],
    rating: 4.8,
    reviews: 203,
  },
  {
    slug: "business-starter-bundle",
    title: "Business Starter Bundle",
    description: "Essential tools and resources for new entrepreneurs.",
    price: 59.99,
    originalPrice: 119.99,
    image: "/images/bundles/business-starter-bundle-cover.jpg",
    images: ["/images/bundles/business-starter-bundle-cover.jpg"],
    items: [
      "Business Plan Template",
      "Financial Planning Spreadsheet",
      "Legal Document Templates",
      "Marketing Strategy Guide",
      "Pitch Deck Template",
      "Brand Guidelines Template",
    ],
    rating: 4.7,
    reviews: 134,
  },
  {
    slug: "ai-productivity-suite",
    title: "AI Productivity Suite",
    description: "Harness the power of AI for maximum productivity.",
    price: 39.99,
    originalPrice: 79.99,
    image: "/images/bundles/ai-productivity-suite-cover.jpg",
    images: ["/images/bundles/ai-productivity-suite-cover.jpg"],
    items: [
      "Ultimate AI Prompt Pack",
      "ChatGPT Workflow Templates",
      "AI Writing Assistant Guide",
      "Automation Setup Templates",
    ],
    rating: 4.9,
    reviews: 298,
  },
];

export function generateStaticParams() {
  return BUNDLES.map((b) => ({ slug: b.slug }));
}

type Params = { slug: string };

const formatEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

export default async function BundleDetailsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const bundle = BUNDLES.find((b) => b.slug === slug);
  if (!bundle) return notFound();

  const gallery = bundle.images?.length ? bundle.images : [bundle.image];

  // Same GET checkout endpoint used by products (Klarna/PayPal when enabled in Stripe)
  const checkoutHref = `/api/checkout?slug=${encodeURIComponent(
    `bundle:${bundle.slug}`
  )}&qty=1&currency=EUR`;

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SimpleGallery
          images={gallery}
          alt={bundle.title}
          className="rounded-xl border bg-white p-2"
          ratioClass="aspect-[3/2]"
          object="contain"
        />

        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{bundle.title}</h1>
          <div className="text-sm text-gray-600 mb-2">
            ⭐ {bundle.rating} ({bundle.reviews} reviews)
          </div>

          <InlineMore
            text={bundle.description}
            lines={2}
            minChars={1}
            className="text-gray-700 text-sm mb-4"
          />

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold">{formatEUR(bundle.price)}</span>
            <span className="text-lg text-gray-500 line-through">
              {formatEUR(bundle.originalPrice)}
            </span>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold mb-2">What’s included</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {bundle.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            {/* Checkout */}
            <Button asChild className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
              <Link href={checkoutHref} prefetch={false}>
                Get This Bundle
              </Link>
            </Button>

            {/* Violet Back button (force override) */}
            <Button
              asChild
              className="flex-1 !bg-violet-600 !text-white hover:!bg-violet-700 !border-0"
            >
              <Link href="/bundles">Back to Bundles</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
