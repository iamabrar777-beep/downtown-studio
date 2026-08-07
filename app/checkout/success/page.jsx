import Link from 'next/link';

export default function CheckoutSuccessPage({ searchParams }) {
  const order = searchParams?.order || 'N/A';
  const total = searchParams?.total;

  return (
    <main className="max-w-xl mx-auto px-5 py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-green-700 text-white flex items-center justify-center mx-auto mb-6 text-2xl">
        ✓
      </div>
      <h1 className="text-2xl font-bold uppercase mb-3">Order Placed!</h1>
      <p className="text-sm text-neutral-400 mb-8">
        Thank you for your order. We'll contact you shortly to confirm delivery details.
      </p>
      <div className="border border-dashed border-ink p-6 text-left mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span>Order Number</span>
          <span className="font-bold">{order}</span>
        </div>
        {total && (
          <div className="flex justify-between text-sm">
            <span>Total</span>
            <span className="font-bold">{Number(total).toLocaleString('en-BD')}৳</span>
          </div>
        )}
      </div>
      <Link href="/shop" className="btn-primary inline-block max-w-xs mx-auto">
        Continue Shopping
      </Link>
    </main>
  );
}
