'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabaseClient';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string;
  category_slug: string;
}

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const supabase = getSupabaseClient();

    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from('products') // no generic to prevent TS errors
          .select('*')
          .eq('slug', slug)
          .single(); // fetch one product

        if (error) {
          console.error(error);
          setProduct(null);
        } else {
          setProduct(data);
        }
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  if (loading) return <p className="text-center py-12">Loading product…</p>;
  if (!product) return <p className="text-center py-12">Product not found.</p>;

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">{product.name}</h1>
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full h-96 object-cover rounded-lg mb-6"
      />
      <p className="text-gray-700 mb-4">{product.description}</p>
      <p className="text-2xl font-semibold">${product.price}</p>
    </main>
  );
}
