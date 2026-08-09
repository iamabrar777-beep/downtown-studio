import { supabase } from '@/lib/supabaseClient';
import ProductCard from '@/components/ProductCard';
import ShopControls from '@/components/ShopControls';

export const revalidate = 0;

async function getProducts({ sort }) {
  let query = supabase.from('products').select('*');

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

export default async function ShopPage({ searchParams }) {
  const sort = searchParams?.sort || 'latest';
  const products = await getProducts({ sort });

  return (
    <main className="max-w-7xl mx-auto px-5 md:px-8 py-10">
      <ShopControls />

      {products.length === 0 ? (
        <p className="text-center text-sm text-neutral-500 py-20">
          No products found. Add some from the Admin Dashboard.
        </p>
      ) : (
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory -mx-5 px-5 md:mx-0 md:px-0">
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[45vw] sm:w-52 md:w-60 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        </div>
      )}
    </main>
  );
}