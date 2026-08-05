import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="max-w-xl mx-auto px-5 py-24 text-center">
      <h1 className="text-2xl font-bold uppercase mb-4">Page Not Found</h1>
      <p className="text-sm text-neutral-500 mb-8">The page you&rsquo;re looking for doesn&rsquo;t exist.</p>
      <Link href="/" className="btn-primary inline-block max-w-xs mx-auto">Back to Home</Link>
    </main>
  );
}
