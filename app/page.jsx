import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import ProductCard from '@/components/ProductCard';

export const revalidate = 0; // always fetch fresh product data

// Paste a real photo URL here to use it as the hero background (e.g. a
// lifestyle/product shot uploaded to Supabase Storage, or any hosted
// image link). Leave it as null to use the styled gradient fallback
// below instead.
const HERO_IMAGE_URL = null;

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
      <section className="relative h-[70vh] min-h-[420px] flex items-end justify-center pb-16 overflow-hidden">
        {HERO_IMAGE_URL ? (
          <Image
            src={HERO_IMAGE_URL}
            alt="Downtown Studio"
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(120% 90% at 50% 15%, #3a3a3a 0%, #1a1a1a 45%, #0a0a0a 100%)'
            }}
          />
        )}
        <div
          className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
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