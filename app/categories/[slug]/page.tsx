import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .single();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category_slug', params.slug);

  if (!category) return <div className="p-8">Category not found</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products?.map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`}>
            <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
              <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-600 text-sm">{product.description}</p>
                <p className="mt-2 font-bold">${product.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
