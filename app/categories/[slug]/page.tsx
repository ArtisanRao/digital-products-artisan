'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  slug: string;
  category_id: string;
}

export default function CategoryProductsPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      // Get the category ID first
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id, name')
        .eq('slug', slug)
        .single();

      if (categoryError || !categoryData) {
        console.error(categoryError);
        return;
      }

      setCategoryName(categoryData.name);

      // Now get products in that category
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryData.id);

      if (productsError) {
        console.error(productsError);
      } else {
        setProducts(productsData || []);
      }
    }

    if (slug) {
      fetchProducts();
    }
  }, [slug]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">{categoryName}</h1>
      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 bg-white">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-600">${product.price.toFixed(2)}</p>
                <button
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                  data-item-id={product.id}
                  data-item-price={product.price}
                  data-item-url={`/products/${product.slug}`}
                  data-item-name={product.name}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 text-center">
        <Link href="/categories" className="text-blue-600 hover:underline">
          ← Back to Categories
        </Link>
      </div>
    </main>
  );
}
