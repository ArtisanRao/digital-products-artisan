// components/BundleCard.tsx
import Image from "next/image";
import Link from "next/link";
import type { Bundle } from "@/lib/bundles";

type Props = { bundle: Bundle };

export default function BundleCard({ bundle }: Props) {
  const discount = bundle.discountPct;

  return (
    <div className="group rounded-2xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition">
      {/* Top media */}
      <div className="relative w-full aspect-[16/9] bg-neutral-100">
        <Image
          src={bundle.cover}               // e.g. "/images/bundles/ai-productivity-suite-cover.jpg"
          alt={bundle.title}
          fill
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          className="object-cover"
          priority={false}
        />
        {bundle.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-fuchsia-600/90 text-white text-xs font-semibold px-3 py-1">
            {bundle.badge}
          </span>
        )}
        {typeof discount === "number" && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 text-white text-xs font-bold px-2 py-1">
            -{discount}%
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="mb-1 text-sm text-neutral-500 flex items-center gap-2">
          <span className="inline-flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-70"><path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14l4-4h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2"/></svg>
            {bundle.productsCount} Products
          </span>
        </div>

        <h3 className="text-xl font-semibold leading-snug">{bundle.title}</h3>
        <p className="mt-1 text-neutral-600">{bundle.blurb}</p>

        <div className="mt-3 flex items-center gap-2 text-sm text-neutral-600">
          <span className="text-amber-500">â˜…</span>
          <span className="font-medium">{bundle.rating.toFixed(1)}</span>
          <span>({bundle.reviews})</span>
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            href={`/bundles/${bundle.id}`}
            className="flex-1 rounded-lg bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white text-center py-2 font-medium hover:opacity-95"
          >
            Get This Bundle
          </Link>
          <Link
            href={`/bundles/${bundle.id}`}
            className="flex-1 rounded-lg border text-center py-2 font-medium hover:bg-neutral-50"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
