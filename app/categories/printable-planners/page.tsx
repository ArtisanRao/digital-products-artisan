'use client';

import Head from 'next/head';
import HoverableCover from '@/components/ui/hoverable-cover';

export default function PrintablePlannersPage() {
  const items = [
    {
      id: 'daily-planner-minimal',
      title: 'Daily Planner (Minimal)',
      image: '/images/printable-planners/daily-planner-minimal-cover.jpg',
      price: 4.49,
      description: 'Clean daily layout with priorities, schedule, and notes.',
      fileUrl: '/downloads/daily-planner-minimal.zip',
    },
    {
      id: 'weekly-planner-focus',
      title: 'Weekly Planner (Focus)',
      image: '/images/printable-planners/weekly-planner-focus-cover.jpg',
      price: 4.99,
      description: 'Plan your week with goals, habits, and tasks at a glance.',
      fileUrl: '/downloads/weekly-planner-focus.zip',
    },
    {
      id: 'undated-monthly-planner',
      title: 'Undated Monthly Planner',
      image: '/images/printable-planners/undated-monthly-planner-cover.jpg',
      price: 5.49,
      description: 'Flexible, undated monthly pages with trackers.',
      fileUrl: '/downloads/undated-monthly-planner.zip',
    },
    {
      id: 'budget-planner-bundle',
      title: 'Budget Planner Bundle',
      image: '/images/printable-planners/budget-planner-bundle-cover.jpg',
      price: 6.99,
      description: 'Income/expense, sinking funds, debt snowball sheets.',
      fileUrl: '/downloads/budget-planner-bundle.zip',
    },
    {
      id: 'fitness-wellness-journal',
      title: 'Fitness & Wellness Journal',
      image: '/images/printable-planners/fitness-wellness-journal-cover.jpg',
      price: 5.99,
      description: 'Workout logs, meal plans, hydration & mood trackers.',
      fileUrl: '/downloads/fitness-wellness-journal.zip',
    },
    {
      id: 'student-academic-planner',
      title: 'Student Academic Planner',
      image: '/images/printable-planners/student-academic-planner-cover.jpg',
      price: 5.49,
      description: 'Assignments, study schedule, grades, and deadlines.',
      fileUrl: '/downloads/student-academic-planner.zip',
    },
  ];

  const structuredData = items.map((p) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    image: `https://digitalproductsartisan.com${p.image}`,
    description: p.description,
    sku: p.id,
    offers: {
      '@type': 'Offer',
      url: 'https://digitalproductsartisan.com/categories/printable-planners',
      priceCurrency: 'EUR',
      price: p.price.toFixed(2),
      availability: 'https://schema.org/InStock',
    },
  }));

  return (
    <>
      <Head>
        <title>Printable Planners | Digital Products Artisan</title>
        <meta
          name="description"
          content="Downloadable daily, weekly, monthly, budgeting, fitness, and academic planners."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10">🗓️ Printable Planners</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border bg-white overflow-hidden shadow transition hover:shadow-lg group"
            >
              {/* ✅ Hoverable, perfectly-fit cover. Try ratio="4/5" if your covers are very tall. */}
              <HoverableCover
                src={item.image}
                alt={item.title}
                ratio="3/2"
                fit="contain"
              />

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <p className="text-lg font-bold mb-3">€{item.price.toFixed(2)}</p>

                <button
                  className="snipcart-add-item bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  data-item-id={item.id}
                  data-item-name={item.title}
                  data-item-price={item.price}
                  data-item-url="/categories/printable-planners"
                  data-item-description={item.description}
                  data-item-image={item.image}
                  data-item-file-guid={item.fileUrl}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
