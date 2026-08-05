import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import ProductCard from '@/components/ProductCard';

export const revalidate = 0; // always fetch fresh product data

async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .order('sort_order', { ascending: true })
    .limit(4);

  if (error) {
    console.error('Error loading featured products:', error.message);
    return [];
  }
  return data || [];
}

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[420px] bg-neutral-900 flex items-end justify-center pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
        <div className="relative z-10 text-center text-white px-6">
          <p className="text-xs uppercase tracking-wide2 mb-3 opacity-80">Contemporary Streetwear</p>
          <h1 className="text-4xl md:text-6xl font-black uppercase mb-6">Wear Confidence</h1>
          <Link href="/shop" className="inline-block bg-white text-ink px-8 py-3 text-xs font-bold uppercase tracking-wide2">
            Shop All
          </Link>
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 md:px-8 py-16">
          <h2 className="text-center text-xs font-bold uppercase tracking-wide2 mb-8">Featured</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
