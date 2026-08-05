'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cartContext';

function formatPrice(n) {
  return `${Number(n).toLocaleString('en-BD')}৳`;
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem, subtotal } = useCart();

  return (
    <>
      {/* backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-paper z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-line">
          <h2 className="text-sm font-bold uppercase tracking-wide2">Shopping Cart</h2>
          <button onClick={closeCart} aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <p className="text-sm text-neutral-500 text-center mt-16">No products in the cart.</p>
          ) : (
            <div className="flex flex-col gap-5">
              {items.map((line) => (
                <div key={`${line.productId}-${line.size}`} className="flex gap-3">
                  <div className="relative w-16 h-20 bg-neutral-100 flex-shrink-0 overflow-hidden">
                    {line.image ? (
                      <Image src={line.image} alt={line.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-300 font-black text-xl">
                        {line.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <p className="text-sm font-medium uppercase truncate">
                        {line.name} {line.size ? `- ${line.size}` : ''}
                      </p>
                      <button
                        onClick={() => removeItem(line.productId, line.size)}
                        className="text-neutral-400 hover:text-ink flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">{formatPrice(line.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(line.productId, line.size, line.qty - 1)}
                        className="w-6 h-6 border border-ink rounded-full text-xs"
                      >
                        −
                      </button>
                      <span className="text-xs w-4 text-center">{line.qty}</span>
                      <button
                        onClick={() => updateQty(line.productId, line.size, line.qty + 1)}
                        className="w-6 h-6 border border-ink rounded-full text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-line">
            <div className="flex justify-between text-sm font-bold mb-4">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/cart" onClick={closeCart} className="btn-outline text-center">
                View Cart
              </Link>
              <Link href="/checkout" onClick={closeCart} className="btn-primary text-center">
                Checkout
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
