import { supabase } from '@/lib/supabaseClient';
import ProductCard from '@/components/ProductCard';
import HeroCarousel from '@/components/HeroCarousel';

export const revalidate = 0;

// Add one or two real photo URLs here (portrait orientation, 1600x2000px
// or larger works best). With two images, they'll crossfade every 15
// seconds. With zero, it falls back to a styled gradient automatically.
const HERO_IMAGES = [
  'https://images.pexels.com/photos/16831788/pexels-photo-16831788.jpeg',
  'https://images.pexels.com/photos/25745245/pexels-photo-25745245.jpeg'
];

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
      <section className="relative h-screen overflow-hidden">
        <HeroCarousel images={HERO_IMAGES} />
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