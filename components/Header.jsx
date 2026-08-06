'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cartContext';

export default function Header() {
  const { itemCount, openCart } = useCart();
  const pathname = usePathname();
  const isHome = pathname === '/';

  const headerClass = isHome
    ? 'absolute top-0 left-0 right-0 z-40 bg-transparent'
    : 'sticky top-0 z-40 bg-paper border-b border-line';

  const textClass = isHome ? 'text-white' : 'text-ink';

  return (
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <nav className={`hidden md:flex items-center gap-8 ${textClass}`}>
          <Link href="/shop" className="nav-link">Shop</Link>
          <Link href="/terms" className="nav-link">Terms</Link>
          <Link href="/about" className="nav-link">About</Link>
        </nav>

        <nav className={`flex md:hidden items-center gap-4 ${textClass}`}>
          <Link href="/shop" className="nav-link">Shop</Link>
        </nav>

        <Link
          href="/"
          className={`text-lg md:text-xl font-extrabold tracking-wide2 absolute left-1/2 -translate-x-1/2 ${textClass}`}
        >
          DOWNTOWN STUDIO<sup className="text-[10px]">&reg;</sup>
        </Link>

        <button onClick={openCart} aria-label="Open cart" className={`relative flex items-center ${textClass}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M6 7h12l-1 13H7L6 7Z" />
            <path d="M9 7a3 3 0 0 1 6 0" />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-ink text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}