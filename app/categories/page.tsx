'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();

    async function fetchCategories() {
      try {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) {
          console.error(error);
          setCategories([]);
        } else {
          setCategories(data || []);
        }
      } catch (err) {
        console.error(err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) return <p className="text-center py-12">Loading categories…</p>;
  if (!categories.length) return <p className="text-center py-12">No categories found.</p>;

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">🗂️ All Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="block group border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >
            <img
              src={category.image_url}
              alt={category.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="p-4 bg-white">
              <h2 className="text-xl font-semibold group-hover:text-blue-600">
                {category.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
