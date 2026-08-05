'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const CROSSFADE_INTERVAL_MS = 15000;

export default function HeroCarousel({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const validImages = (images || []).filter(Boolean);

  useEffect(() => {
    if (validImages.length < 2) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % validImages.length);
    }, CROSSFADE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [validImages.length]);

  if (validImages.length === 0) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(120% 90% at 50% 15%, #3a3a3a 0%, #1a1a1a 45%, #0a0a0a 100%)'
        }}
      />
    );
  }

  return (
    <>
      {validImages.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={i === 0}
          className={`object-cover transition-opacity duration-[1500ms] ease-in-out ${
            i === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </>
  );
}