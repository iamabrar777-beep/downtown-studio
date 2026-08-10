import HeroCarousel from '@/components/HeroCarousel';

// Add one or two real photo URLs here (landscape orientation works best
// for desktop). With two images, they'll crossfade every 15 seconds.
// With zero, it falls back to a styled gradient automatically.
const HERO_IMAGES = [{ src: 'https://i.pinimg.com/736x/d6/5f/77/d65f77865ec0b6f2b08cc43d59fd2bad.jpg', position: '50% 30%' },
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