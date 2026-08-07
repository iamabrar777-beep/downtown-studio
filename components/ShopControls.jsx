'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const SORT_OPTIONS = [
  { value: 'latest', label: 'Sort by latest' },
  { value: 'price-asc', label: 'Sort by price: low to high' },
  { value: 'price-desc', label: 'Sort by price: high to low' }
];

export default function ShopControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'latest';

  function updateSort(value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'latest') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <div className="flex justify-end mb-8">
      <select
        value={currentSort}
        onChange={(e) => updateSort(e.target.value)}
        className="text-sm text-ink border border-line px-4 py-2 bg-transparent focus:outline-none"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}