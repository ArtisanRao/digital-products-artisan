'use client';

import Image from 'next/image';
import * as React from 'react';

// Solid star (uses currentColor so Tailwind color applies)
function StarSolid(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.035a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.035a1 1 0 0 0-1.176 0L6.616 16.9c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 0 0 .95-.69l1.07-3.292Z" />
    </svg>
  );
}

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-1 text-yellow-400" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <StarSolid key={i} className="h-5 w-5" />
      ))}
    </div>
  );
}

// Deep-violet decorative quote mark
function QuoteMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17 22c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5c0-9.4 7.6-15.3 15-16.9v5.1C22.1 16 17 19.6 17 22zm19 0c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5c0-9.4 7.6-15.3 15-16.9v5.1C41.1 16 36 19.6 36 22z" />
    </svg>
  );
}

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  rating?: number;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "The AI prompt pack completely transformed my content creation process. I've saved hours of brainstorming time and my engagement has increased by 300%!",
    name: 'Sarah Johnson',
    role: 'Content Creator',
    avatar: '/images/testimonials/sarah-johnson-512.webp',
    rating: 5,
  },
  {
    quote:
      "These Canva templates are incredible! Professional designs that would've cost me thousands from a designer. My social media looks amazing now.",
    name: 'Mike Chen',
    role: 'Small Business Owner',
    avatar: '/images/testimonials/mike-chen-512.webp',
    rating: 5,
  },
  {
    quote:
      "The digital marketing ebook is pure gold. Implemented the strategies and saw immediate results. Best investment I've made for my business.",
    name: 'Emily Rodriguez',
    role: 'Digital Marketer',
    avatar: '/images/testimonials/emily-rodriguez-512.webp',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-center text-4xl font-bold">What Our Customers Say</h2>
      <p className="mt-3 text-center text-lg text-muted-foreground">
        Join thousands of satisfied creators who&apos;ve transformed their work with our digital products
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <article
            key={t.name}
            className="rounded-2xl border bg-white/60 p-8 shadow-sm backdrop-blur transition hover:shadow-md"
          >
            <QuoteMark className="h-8 w-8 text-violet-700" />
            {t.rating ? (
              <div className="mt-3">
                <Stars count={t.rating} />
              </div>
            ) : null}

            <p className="mt-4 text-lg leading-8 text-slate-700">“{t.quote}”</p>

            <div className="mt-8 flex items-center gap-4">
              <Image
                src={t.avatar}
                alt={`${t.name} headshot`}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover ring-2 ring-white"
              />
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-slate-500">{t.role}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
