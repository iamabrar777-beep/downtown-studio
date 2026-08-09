import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { isValidBDPhone, isValidTransactionId } from '@/lib/validators';

const SHIPPING_RATES = { inside: 70, outside: 130 };

function generateOrderNumber() {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DS-${y}${m}${d}-${rand}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, customer, deliveryZone, paymentMethod, payerNumber, paymentReference } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }
    if (!customer?.name || !customer?.phone || !customer?.address || !customer?.city) {
      return NextResponse.json({ error: 'Missing required customer details.' }, { status: 400 });
    }
    if (!isValidBDPhone(customer.phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid Bangladeshi phone number.' },
        { status: 400 }
      );
    }
    if (!['inside', 'outside'].includes(deliveryZone)) {
      return NextResponse.json({ error: 'Please select a valid delivery area.' }, { status: 400 });
    }
    if (!['cod', 'bkash', 'nagad'].includes(paymentMethod)) {
      return NextResponse.json({ error: 'Invalid payment method.' }, { status: 400 });
    }
    if (paymentMethod !== 'cod' && !isValidBDPhone(payerNumber)) {
      return NextResponse.json(
        { error: 'Please enter a valid bKash/Nagad number.' },
        { status: 400 }
      );
    }
    if (paymentMethod !== 'cod' && !isValidTransactionId(paymentReference)) {
      return NextResponse.json(
        { error: 'Please enter a valid Transaction ID.' },
        { status: 400 }
      );
    }

    // Re-fetch real product data server-side — never trust prices sent
    // from the browser. This also confirms every product still exists.
    const productIds = items.map((i) => i.productId);
    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('id, name, price, stock, images')
      .in('id', productIds);

    if (productsError) throw productsError;

    const productMap = new Map(products.map((p) => [p.id, p]));
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `A product in your cart is no longer available.` },
          { status: 400 }
        );
      }
      const sizeStock = Number(product.stock?.[item.size] ?? 0);
      if (sizeStock < item.qty) {
        return NextResponse.json(
          { error: `Only ${sizeStock} left in size ${item.size} for "${product.name}".` },
          { status: 400 }
        );
      }
      const lineTotal = product.price * item.qty;
      subtotal += lineTotal;
      orderItems.push({
        product_id: product.id,
        name: product.name,
        price: product.price,
        size: item.size,
        qty: item.qty,
        image: product.images?.[0] || null
      });
    }

    const shipping = SHIPPING_RATES[deliveryZone];
    const total = subtotal + shipping;
    const orderNumber = generateOrderNumber();

    const { error: insertError } = await supabaseAdmin.from('orders').insert({
      order_number: orderNumber,
      customer_name: customer.name,
      phone: customer.phone,
      email: customer.email || null,
      address: customer.address,
      city: customer.city,
      district: customer.district || null,
      notes: customer.notes || null,
      items: orderItems,
      subtotal,
      shipping,
      total,
      delivery_zone: deliveryZone,
      payment_method: paymentMethod,
      payment_number: payerNumber || null,
      payment_reference: paymentReference || null,
      status: 'pending'
    });

    if (insertError) throw insertError;

    // Decrement stock for each purchased item, for the specific size
    // ordered only. Merge all changes per product FIRST (in case the
    // same product appears twice with different sizes in one order),
    // then write once per product — writing separately per line item
    // would let a second update silently overwrite the first's change,
    // since each write would otherwise be computed from the same stale
    // pre-order stock snapshot.
    const stockUpdates = new Map(); // product_id -> updated stock object
    for (const item of orderItems) {
      const product = productMap.get(item.product_id);
      const base = stockUpdates.get(item.product_id) || { ...product.stock };
      const currentSizeStock = Number(base[item.size] ?? 0);
      base[item.size] = currentSizeStock - item.qty;
      stockUpdates.set(item.product_id, base);
    }
    for (const [productId, updatedStock] of stockUpdates.entries()) {
      await supabaseAdmin.from('products').update({ stock: updatedStock }).eq('id', productId);
    }

    return NextResponse.json({ orderNumber, total });
  } catch (err) {
    console.error('Order creation failed:', err);
    return NextResponse.json(
      { error: 'Something went wrong placing your order. Please try again.' },
      { status: 500 }
    );
  }
}