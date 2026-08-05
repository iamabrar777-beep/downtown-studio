'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cartContext';

function formatPrice(n) {
  return `${Number(n).toLocaleString('en-BD')}৳`;
}

export default function ProductDetail({ product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [error, setError] = useState('');
  const [showSize, setShowSize] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const images = product.images?.length ? product.images : [null];
  const outOfStock = product.stock <= 0;

  function requireSize() {
    if (!selectedSize) {
      setError('Please select a size.');
      return false;
    }
    setError('');
    return true;
  }

  function handleAddToCart() {
    if (!requireSize()) return;
    addItem(product, selectedSize, 1);
  }

  function handleBuyNow() {
    if (!requireSize()) return;
    addItem(product, selectedSize, 1);
    router.push('/checkout');
  }

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-8 grid md:grid-cols-2 gap-10">
      {/* Gallery */}
      <div>
        <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
          {images[activeImage] ? (
            <Image src={images[activeImage]} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-black text-8xl text-neutral-300">{product.name.charAt(0)}</span>
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 mt-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative w-16 h-20 bg-neutral-100 flex-shrink-0 overflow-hidden border ${
                  activeImage === i ? 'border-ink' : 'border-transparent'
                }`}
              >
                {img ? (
                  <Image src={img} alt="" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-300 font-black">
                    {product.name.charAt(0)}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <h1 className="text-xl font-bold uppercase">{product.name}</h1>
        <p className="text-lg mt-2">{formatPrice(product.price)}</p>

        {product.bullet_points?.length > 0 && (
          <ul className="mt-6 space-y-2">
            {product.bullet_points.map((point, i) => (
              <li key={i} className="text-sm flex gap-2">
                <span>&bull;</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}

        {product.description && (
          <p className="text-sm text-neutral-600 mt-4">{product.description}</p>
        )}

        <div className="flex gap-2 mt-6">
          {product.sizes?.map((size) => (
            <button
              key={size}
              onClick={() => { setSelectedSize(size); setError(''); }}
              className={`w-12 h-12 border text-sm ${
                selectedSize === size ? 'bg-ink text-white border-ink' : 'border-neutral-300'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

        <div className="flex flex-col gap-3 mt-6">
          <button onClick={handleAddToCart} disabled={outOfStock} className="btn-outline">
            {outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <button onClick={handleBuyNow} disabled={outOfStock} className="btn-primary">
            Buy Now
          </button>
        </div>

        <div className="mt-8 border-t border-line">
          <button
            onClick={() => setShowSize(!showSize)}
            className="w-full flex items-center justify-between py-4 text-xs font-bold uppercase tracking-wide2"
          >
            Size Guide <span>{showSize ? '−' : '+'}</span>
          </button>
          {showSize && (
            <div className="pb-4 text-sm text-neutral-600">
              Refer to the size chart below for measurements (in cm). If between sizes, we recommend sizing up for an oversized fit.
            </div>
          )}
        </div>
        <div className="border-t border-line">
          <button
            onClick={() => setShowShipping(!showShipping)}
            className="w-full flex items-center justify-between py-4 text-xs font-bold uppercase tracking-wide2"
          >
            Shipping <span>{showShipping ? '−' : '+'}</span>
          </button>
          {showShipping && (
            <div className="pb-4 text-sm text-neutral-600">
              Cash on Delivery available nationwide. ৳70 flat rate shipping across Bangladesh via Pathao/RedX, 2-5 business days.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
