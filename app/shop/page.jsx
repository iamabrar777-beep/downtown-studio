import { supabase } from '@/lib/supabaseClient';
import ProductCard from '@/components/ProductCard';
import ShopControls from '@/components/ShopControls';

export const revalidate = 0;

async function getProducts({ sort, category }) {
  let query = supabase.from('products').select('*');

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  if (sort === 'price-asc') {
    query = query.order('price', { ascending: true });
  } else if (sort === 'price-desc') {
    query = query.order('price', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error loading products:', error.message);
    return [];
  }
  return data || [];
}

async function getCategories() {
  const { data } = await supabase.from('products').select('category');
  const set = new Set((data || []).map((p) => p.category).filter(Boolean));
  return Array.from(set);
}

export default async function ShopPage({ searchParams }) {
  const sort = searchParams?.sort || 'latest';
  const category = searchParams?.category || 'all';

  const [products, categories] = await Promise.all([
    getProducts({ sort, category }),
    getCategories()
  ]);

  return (
    <main className="max-w-7xl mx-auto px-5 md:px-8 py-10">
      <ShopControls categories={categories} />

      {products.length === 0 ? (
        <p className="text-center text-sm text-neutral-500 py-20">
          No products found. Add some from the Admin Dashboard.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
