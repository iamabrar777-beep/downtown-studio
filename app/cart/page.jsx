'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cartContext';

function formatPrice(n) {
  return `${Number(n).toLocaleString('en-BD')}৳`;
}

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-bold uppercase mb-4">Cart</h1>
        <p className="text-sm text-neutral-500 mb-8">Your cart is empty.</p>
        <Link href="/shop" className="btn-primary inline-block max-w-xs mx-auto">Continue Shopping</Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-5 md:px-8 py-10">
      <h1 className="text-2xl font-bold uppercase mb-8">Cart</h1>
      <div className="flex flex-col gap-6">
        {items.map((line) => (
          <div key={`${line.productId}-${line.size}`} className="flex gap-4 border-b border-line pb-6">
            <div className="relative w-24 h-28 bg-neutral-100 flex-shrink-0 overflow-hidden">
              {line.image ? (
                <Image src={line.image} alt={line.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-300 font-black text-2xl">
                  {line.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium uppercase">{line.name}{line.size ? ` - ${line.size}` : ''}</p>
                  <p className="text-sm text-neutral-500 mt-1">{formatPrice(line.price)}</p>
                </div>
                <button
                  onClick={() => removeItem(line.productId, line.size)}
                  className="text-neutral-400 hover:text-ink self-start"
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => updateQty(line.productId, line.size, line.qty - 1)}
                  className="w-7 h-7 border border-ink"
                >
                  −
                </button>
                <span className="w-6 text-center">{line.qty}</span>
                <button
                  onClick={() => updateQty(line.productId, line.size, line.qty + 1)}
                  className="w-7 h-7 border border-ink"
                >
                  +
                </button>
                <span className="ml-auto font-medium">{formatPrice(line.price * line.qty)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-4">
        <div className="flex justify-between w-full md:w-72 text-lg font-bold">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <Link href="/checkout" className="btn-primary w-full md:w-72 text-center">
          Proceed to Checkout
        </Link>
      </div>
    </main>
  );
}
