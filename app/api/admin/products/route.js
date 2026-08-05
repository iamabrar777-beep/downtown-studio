import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// GET — list every product (admin view, unlike the public storefront
// this includes everything regardless of stock).
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

// POST — create a new product.
export async function POST(request) {
  const body = await request.json();
  const { name, price, category, description, bulletPoints, sizes, images, stock, featured } = body;

  if (!name || !price) {
    return NextResponse.json({ error: 'Name and price are required.' }, { status: 400 });
  }

  let slug = slugify(name);

  // Ensure slug uniqueness by appending a short suffix if needed.
  const { data: existing } = await supabaseAdmin.from('products').select('id').eq('slug', slug);
  if (existing && existing.length > 0) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const { data, error } = await supabaseAdmin
    .from('products')
    .insert({
      name,
      slug,
      price,
      category: category || 'uncategorized',
      description: description || '',
      bullet_points: bulletPoints || [],
      sizes: sizes?.length ? sizes : ['S', 'M', 'L', 'XL'],
      images: images || [],
      stock: stock ?? 10,
      featured: !!featured
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}
