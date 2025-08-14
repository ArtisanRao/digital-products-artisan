'use client';

import { useParams } from 'next/navigation';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

// Safe Supabase client initialization
function getSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  return createClient(url, anonKey);
}

const supabase = getSupabaseClient();

export default function CategorySlugPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from<Product>('products')
          .select('*')
          .eq('category_slug', slug);

        if (error) {
          console.error('Supabase error:', error.message);
        } else {
          setProducts(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProducts();
    }
  }, [slug]);

  if (loading) {
    return <p className="text-center py-12">Loading products...</p>;
  }

  if (products.length === 0) {
    return <p className="text-center py-12">No products found in this category.</p>;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Category: {slug}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="p-4 bg-white">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="mt-2 font-bold">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
