import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import InlineMore from "@/components/ui/inline-more";
import Link from "next/link";

type Bundle = {
  slug: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
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

// Next 15: params is a Promise
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

  // Build a GET checkout URL (public, no auth)
  // Your /api/checkout GET handler should:
  //  - parse these query params
  //  - create a checkout session
  //  - 303 redirect to the provider URL
  const checkoutUrl =
    `/api/checkout?` +
    new URLSearchParams({
      // treat bundle as a single line item
      id: `bundle:${bundle.slug}`,
      name: bundle.title,
      price: String(bundle.price),
      image: bundle.image,
      quantity: "1",
      currency: "eur",
      // optional: you can add a successUrl/cancelUrl if your route supports them
      // success: `/bundles/${bundle.slug}?success=1`,
      // cancel:  `/bundles/${bundle.slug}?canceled=1`,
    }).toString();

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-gray-100">
          <Image
            src={bundle.image}
            alt={bundle.title}
            fill
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{bundle.title}</h1>
          <div className="text-sm text-gray-600 mb-4">
            ⭐ {bundle.rating} ({bundle.reviews} reviews)
          </div>

          {/* Tiny InlineMore directly under the subtitle */}
          <InlineMore text={bundle.description} lines={2} className="text-gray-700 text-sm mb-4" />

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

          {/* Actions side-by-side */}
          <div className="flex gap-3">
            {/* Get This Bundle → public checkout GET (no auth redirect) */}
            <Button
              asChild
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Link href={checkoutUrl}>Get This Bundle</Link>
            </Button>

            {/* Back to list */}
            <Button variant="outline" asChild className="flex-1">
              <Link href="/bundles">Back to Bundles</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
