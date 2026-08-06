import HeroCarousel from '@/components/HeroCarousel';

// Add one or two real photo URLs here (landscape orientation works best
// for desktop). With two images, they'll crossfade every 15 seconds.
// With zero, it falls back to a styled gradient automatically.
const HERO_IMAGES = [{ src: 'https://images.pexels.com/photos/16831788/pexels-photo-16831788.jpeg', position: '50% 40%' },
  'https://images.pexels.com/photos/25745245/pexels-photo-25745245.jpeg'
];

export default function HomePage() {
  return (
    <main>
      <section className="relative h-screen overflow-hidden">
        <HeroCarousel images={HERO_IMAGES} />
      </section>
    </main>
  );
}