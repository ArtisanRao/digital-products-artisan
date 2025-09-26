"use client";

import CatLink from "@/components/ui/CatLink"; // no-prefetch wrapper
import SafeCategoryImage from "@/components/categories/SafeCategoryImage";

export type CategoryLike = {
  label: string;
  slug: string;
  image?: string; // "/images/categories/<slug>/card.jpg"
};

type Props = {
  category: CategoryLike;
  hrefBase?: string; // defaults to "/categories"
  className?: string;
};

export default function CategoryCard({ category, hrefBase = "/categories", className }: Props) {
  const href = `${hrefBase}/${category.slug}`;

  return (
    <CatLink
      href={href}
      aria-label={`Browse ${category.label}`}
      className={`group block overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 ${className ?? ""}`}
    >
      <div className="relative w-full aspect-[4/3] bg-neutral-50">
        <SafeCategoryImage
          src={category.image}
          slug={category.slug}
          alt={category.label}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>

      <div className="p-4">
        <h3 className="text-base font-semibold leading-tight group-hover:text-blue-600 transition-colors">
          {category.label}
        </h3>
        {/* Optional: add a short description if you add it to your data later */}
      </div>
    </CatLink>
  );
}
