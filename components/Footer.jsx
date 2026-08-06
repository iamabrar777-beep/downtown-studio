'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname === '/') return null;

  return (
    <footer className="border-t border-line mt-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-neutral-500 uppercase tracking-wide2">
          &copy; {new Date().getFullYear()} Downtown Studio — Chattogram, Bangladesh
        </p>
        <div className="flex gap-6">
          <Link href="/shop" className="text-xs uppercase tracking-wide2 hover:opacity-60">Shop</Link>
          <Link href="/terms" className="text-xs uppercase tracking-wide2 hover:opacity-60">Terms</Link>
          <Link href="/about" className="text-xs uppercase tracking-wide2 hover:opacity-60">About</Link>
        </div>
      </div>
    </footer>
  );
}