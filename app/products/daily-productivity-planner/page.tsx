// app/products/daily-productivity-planner/page.tsx
import Image from "next/image";
import Link from "next/link";

const previews = [
  {
    alt: "Daily Productivity Planner — Cover",
    src: "/images/daily-productivity-planner/cover.webp",
    thumb: "/images/daily-productivity-planner/thumbs/cover_thumb.webp",
    w: 1600,
    h: 2070, // safe ratio; Next will autosize fine if unknown
  },
];

export default function PlannerLanding() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 grid gap-10 md:grid-cols-2 items-center">
        <div>
          <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm text-teal-700">
            New • Fillable PDF
          </span>
          <h1 className="mt-4 text-4xl/tight font-semibold tracking-tight text-gray-900">
            Daily Productivity Planner
          </h1>
          <p className="mt-4 text-gray-600">
            A clean, modern planner to help you plan days, track habits, and stay focused.
            Built in your brand colors (teal • white • subtle gold).
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/downloads/daily-productivity-planner.pdf"
              prefetch={false}
              className="inline-flex items-center rounded-xl bg-teal-600 px-5 py-3 text-white hover:bg-teal-700 transition"
            >
              Download Free (Test)
            </Link>
            <a
              href="#preview"
              className="inline-flex items-center rounded-xl border border-gray-200 px-5 py-3 text-gray-700 hover:bg-gray-50 transition"
            >
              See Preview
            </a>
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Fillable PDF
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-500" /> Print-friendly
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-500" /> Minimal load impact
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Commercial use
            </li>
          </ul>
        </div>

        {/* Hero preview sheet (single image for speed) */}
        <div className="relative aspect-[4/3] rounded-2xl border border-gray-200 bg-teal-50/40 p-3">
          <Image
            src="/images/daily-productivity-planner/planner_preview_sheet.webp"
            alt="Planner preview"
            fill
            className="object-contain rounded-xl"
            priority
          />
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
        </div>
      </section>

      {/* Preview Gallery */}
      <section id="preview" className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <h2 className="text-2xl font-semibold text-gray-900">Inside the planner</h2>
        <p className="mt-2 text-gray-600">
          Optimized previews (WebP + lazy-loading) keep this page fast.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {previews.map((p) => (
            <figure
              key={p.src}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white"
            >
              {/* Use thumb as placeholder via blur-up technique */}
              <div className="relative aspect-[4/5]">
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={p.thumb}
                  className="object-contain"
                />
              </div>
              <figcaption className="px-4 py-3 text-sm text-gray-600">{p.alt}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-200 bg-gradient-to-br from-teal-50 to-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 text-center">
          <h3 className="text-2xl font-semibold text-gray-900">
            Ready to test the planner?
          </h3>
          <p className="mt-2 text-gray-600">
            Download it free for now. We’ll add checkout when you’re ready.
          </p>
          <div className="mt-6">
            <Link
              href="/downloads/daily-productivity-planner.pdf"
              prefetch={false}
              className="inline-flex items-center rounded-xl bg-amber-500 px-6 py-3 text-white hover:bg-amber-600 transition"
            >
              Download the PDF
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
