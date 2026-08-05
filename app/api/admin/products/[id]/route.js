import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// PATCH — update an existing product.
export async function PATCH(request, { params }) {
  const { id } = params;
  const body = await request.json();

  const allowedFields = [
    'name', 'price', 'category', 'description', 'stock', 'featured',
    'sizes', 'images', 'sort_order'
  ];
  // map camelCase -> snake_case for the two special fields
  const updates = {};
  for (const key of allowedFields) {
    if (key in body) updates[key] = body[key];
  }
  if ('bulletPoints' in body) updates.bullet_points = body.bulletPoints;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update.' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

// DELETE — remove a product entirely.
export async function DELETE(request, { params }) {
  const { id } = params;
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
