'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const SORT_OPTIONS = [
  { value: 'latest', label: 'Sort by latest' },
  { value: 'price-asc', label: 'Sort by price: low to high' },
  { value: 'price-desc', label: 'Sort by price: high to low' }
];

export default function ShopControls({ categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'latest';
  const currentCategory = searchParams.get('category') || 'all';

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateParam('category', 'all')}
          className={`text-xs uppercase tracking-wide2 px-4 py-2 border ${
            currentCategory === 'all' ? 'bg-ink text-white border-ink' : 'border-neutral-300'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => updateParam('category', cat)}
            className={`text-xs uppercase tracking-wide2 px-4 py-2 border ${
              currentCategory === cat ? 'bg-ink text-white border-ink' : 'border-neutral-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <select
        value={currentSort}
        onChange={(e) => updateParam('sort', e.target.value)}
        className="border border-neutral-300 px-4 py-2 text-sm w-full md:w-auto"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
