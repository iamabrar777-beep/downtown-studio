import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import ProductDetail from '@/components/ProductDetail';

export const revalidate = 0;

async function getProduct(slug) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return <ProductDetail product={product} />;
}
