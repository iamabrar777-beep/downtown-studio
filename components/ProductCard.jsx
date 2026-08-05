import Link from 'next/link';
import Image from 'next/image';

function formatPrice(n) {
  return `${Number(n).toLocaleString('en-BD')}৳`;
}

export default function ProductCard({ product }) {
  const image = product.images?.[0];
  const outOfStock = product.stock <= 0;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-black text-6xl text-neutral-300 select-none">
              {product.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {outOfStock && (
          <div className="absolute bottom-3 left-3 bg-paper px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide2">
            Out of Stock
          </div>
        )}
      </div>
      <div className="pt-3 text-center">
        <h3 className="text-sm font-medium uppercase">{product.name}</h3>
        <p className="text-sm text-neutral-500 mt-1">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
