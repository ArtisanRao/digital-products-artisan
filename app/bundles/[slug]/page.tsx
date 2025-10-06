// app/bundles/[slug]/page.tsx
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import InlineMore from "@/components/ui/inline-more";
import Link from "next/link";
import SimpleGallery from "@/components/ui/simple-gallery";
import { bundles, bundlesBySlug } from "../data";

export function generateStaticParams() {
  return bundles.map((b) => ({ slug: b.slug }));
}

const formatEUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);

export default function BundleDetailsPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const bundle = bundlesBySlug[slug];
  if (!bundle) return notFound();

  const gallery = bundle.images?.length ? bundle.images : [bundle.image];

  // Same GET checkout endpoint used by products (pricing resolved server-side)
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
          {(bundle as any).rating && (bundle as any).reviews ? (
            <div className="text-sm text-gray-600 mb-2">
              ⭐ {(bundle as any).rating} ({(bundle as any).reviews} reviews)
            </div>
          ) : null}

          <InlineMore
            text={bundle.description ?? ""}
            lines={2}
            minChars={1}
            className="text-gray-700 text-sm mb-4"
          />

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold">{formatEUR(bundle.price)}</span>
            {bundle.originalPrice ? (
              <span className="text-lg text-gray-500 line-through">
                {formatEUR(bundle.originalPrice)}
              </span>
            ) : null}
          </div>

          {Array.isArray(bundle.items) && bundle.items.length ? (
            <div className="mb-6">
              <h2 className="font-semibold mb-2">What’s included</h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {bundle.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex gap-3">
            {/* Checkout */}
            <Button asChild className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
              <Link href={checkoutHref} prefetch={false}>
                Get This Bundle
              </Link>
            </Button>

            {/* Back button */}
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
