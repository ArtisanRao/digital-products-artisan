'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

const supabase = getSupabaseClient();

async function getProducts() {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    return data;
  } catch (err: any) {
    console.error('Unexpected error fetching products:', err);
    throw err;
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data || []))
      .catch((err) => setError(err.message || 'Unknown error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products: {error}</div>;
  if (products.length === 0) return <div>No products found</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">{product.name}</h2>
          {product.description && <p className="mt-2">{product.description}</p>}
          {product.price && <p className="mt-2 font-semibold">${product.price}</p>}
        </div>
      ))}
    </div>
  );
}
