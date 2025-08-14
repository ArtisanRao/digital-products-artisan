'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabaseClient';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  category_slug: string;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();

    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category_slug', slug);

        if (error) {
          console.error(error);
          setProducts([]);
        } else {
          setProducts(data || []);
        }
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [slug]);

  if (loading) return <p className="text-center py-12">Loading products…</p>;
  if (!products.length) return <p className="text-center py-12">No products in this category.</p>;

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Category: {slug}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="block group border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="p-4 bg-white">
              <h2 className="text-xl font-semibold group-hover:text-blue-600">
                {product.name}
              </h2>
              <p className="text-gray-700">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
