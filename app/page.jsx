import HeroCarousel from '@/components/HeroCarousel';

// Add one or two real photo URLs here (landscape orientation works best
// for desktop). With two images, they'll crossfade every 15 seconds.
// With zero, it falls back to a styled gradient automatically.
const HERO_IMAGES = ['https://i.pinimg.com/736x/98/b7/a3/98b7a370341b7a86776325682ac6e7b4.jpg',
  'https://i.pinimg.com/736x/72/d9/6e/72d96e37cb6bc6bf14228b01e37fda73.jpg'
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