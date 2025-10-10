"use client";

import CatLink from "@/components/ui/CatLink";
import SafeCategoryImage from "@/components/categories/SafeCategoryImage";

export type CategoryLike = {
  label: string;
  slug: string;
  image?: string;
};

type Props = {
  category: CategoryLike;
  hrefBase?: string;
  className?: string;
};

export default function CategoryCard({ category, hrefBase = "/categories", className }: Props) {
  const href = `${hrefBase}/${category.slug}`;

  return (
    <CatLink
      href={href}
      aria-label={`Browse ${category.label}`}
      className={[
        "group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm",
        "transition-shadow hover:shadow-md",
        className ?? "",
      ].join(" ")}
    >
      <div className="relative w-full aspect-[4/3] bg-neutral-50 pointer-events-none select-none">
        <SafeCategoryImage
          src={category.image}
          slug={category.slug}
          alt={category.label}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          draggable={false}
        />
      </div>

      <div className="p-4 pointer-events-none select-none">
        <h3 className="text-base font-semibold leading-tight transition-colors group-hover:text-blue-600">
          {category.label}
        </h3>
      </div>
    </CatLink>
  );
}
