'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="bg-white relative">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
          {/* Text Content */}
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:leading-none sm:text-5xl lg:text-6xl">
              Discover Premium{' '}
              <span className="text-indigo-600">Digital Products</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 sm:mt-8 sm:text-xl sm:max-w-xl sm:mx-auto lg:mx-0">
              Explore our curated collection of eBooks, templates, art, and
              digital tools designed to elevate your projects.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
              <Link
                href="/categories"
                className="px-6 py-3 text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow"
              >
                Browse Categories
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 text-lg font-medium text-indigo-600 border border-indigo-600 rounded-md shadow hover:bg-indigo-50"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Image Content */}
          <div className="relative mt-8 lg:mt-0 lg:col-span-6">
            <Image
              src="/images/hero-image.jpg"
              alt="Digital products showcase"
              width={600}
              height={400}
              className="w-full h-auto rounded-md shadow-lg object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
