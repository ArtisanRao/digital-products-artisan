"use client";

import Link from "next/link";
import CoverImage from "@/components/ui/cover-image";

type Item = {
  src: string;
  title?: string;
  href?: string;
};

export default function CategoryGallery({ items }: { items: Item[] }) {
  if (!items?.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((it, i) => {
        const frame = (
          <>
            <CoverImage
              src={it.src}
              alt={it.title || "Cover"}
              ratio="3/2"
              fit="contain"
              hover
              paddingClass="p-2"
              roundedClass="rounded-xl"
              sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 100vw"
            />
            {it.title && (
              <div className="px-3 py-2">
                <div className="text-sm font-medium line-clamp-1">{it.title}</div>
              </div>
            )}
          </>
        );

        return it.href ? (
          <Link
            key={it.src + i}
            href={it.href}
            className="block rounded-xl border bg-white hover:shadow-lg transition"
          >
            {frame}
          </Link>
        ) : (
          <div key={it.src + i} className="rounded-xl border bg-white hover:shadow-lg transition">
            {frame}
          </div>
        );
      })}
    </div>
  );
}
