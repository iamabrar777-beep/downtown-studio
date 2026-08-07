'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cartContext';

function formatPrice(n) {
  return `${Number(n).toLocaleString('en-BD')}৳`;
}

const SHIPPING_RATES = { inside: 70, outside: 130 };

const BKASH_NUMBER = '01885624604';
const NAGAD_NUMBER = '01885624604';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', city: '', district: '', notes: ''
  });
  const [deliveryZone, setDeliveryZone] = useState('inside');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [payerNumber, setPayerNumber] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const shipping = SHIPPING_RATES[deliveryZone];
  const total = subtotal + shipping;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setError('');

    if (!agreed) {
      setError('Please agree to the terms and conditions.');
      return;
    }
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((l) => ({ productId: l.productId, size: l.size, qty: l.qty })),
          customer: form,
          deliveryZone,
          paymentMethod,
          payerNumber: paymentMethod !== 'cod' ? payerNumber : null,
          paymentReference: paymentMethod !== 'cod' ? paymentReference : null
        })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      clearCart();
      router.push(`/checkout/success?order=${data.orderNumber}&total=${data.total}`);
    } catch (err) {
      console.error(err);
      setError('Network error. Please check your connection and try again.');
      setSubmitting(false);
    }
  }

  const paymentMethodMeta = {
    bkash: { label: 'bKash', number: BKASH_NUMBER },
    nagad: { label: 'Nagad', number: NAGAD_NUMBER }
  };

  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-5 py-20 text-center">
        <h1 className="text-2xl font-bold uppercase mb-4">Checkout</h1>
        <p className="text-sm text-neutral-500">Your cart is empty. Add something before checking out.</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-5 md:px-8 py-10">
      <h1 className="text-2xl font-bold uppercase mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid md:grid-cols-2 gap-10">
        {/* Billing details */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide2 mb-4">Billing Details</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="label-text">Full Name *</label>
              <input required value={form.name} onChange={(e) => update('name', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-text">Phone *</label>
              <input required value={form.phone} onChange={(e) => update('phone', e.target.value)} className="input-field" placeholder="01XXXXXXXXX" />
            </div>
            <div>
              <label className="label-text">Email (optional)</label>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-text">Street Address *</label>
              <input required value={form.address} onChange={(e) => update('address', e.target.value)} className="input-field" placeholder="House number and street name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text">Town / City *</label>
                <input required value={form.city} onChange={(e) => update('city', e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="label-text">District</label>
                <input value={form.district} onChange={(e) => update('district', e.target.value)} className="input-field" placeholder="e.g. Chattogram" />
              </div>
            </div>

            <div>
              <label className="label-text">Delivery Area *</label>
              <select
                value={deliveryZone}
                onChange={(e) => setDeliveryZone(e.target.value)}
                className="input-field"
              >
                <option value="inside">Inside Chattogram — {formatPrice(SHIPPING_RATES.inside)}</option>
                <option value="outside">Outside Chattogram — {formatPrice(SHIPPING_RATES.outside)}</option>
              </select>
            </div>

            <div>
              <label className="label-text">Order Notes (optional)</label>
              <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} className="input-field" rows={3} placeholder="Notes about your order, e.g. special delivery instructions." />
            </div>
          </div>
        </div>

        {/* Order summary + payment */}
        <div>
          <div className="border border-line p-5">
            <h2 className="text-sm font-bold uppercase tracking-wide2 mb-4">Your Order</h2>
            <div className="flex flex-col gap-2 mb-4">
              {items.map((line) => (
                <div key={`${line.productId}-${line.size}`} className="flex justify-between text-sm">
                  <span>{line.name}{line.size ? ` - ${line.size}` : ''} &times; {line.qty}</span>
                  <span>{formatPrice(line.price * line.qty)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-line pt-3 flex flex-col gap-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between">
                <span>Shipment</span>
                <span className="font-bold">
                  Flat Rate: {formatPrice(shipping)} ({deliveryZone === 'inside' ? 'Inside Ctg' : 'Outside Ctg'})
                </span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-line pt-2"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <label className={`border p-3 cursor-pointer ${paymentMethod === 'cod' ? 'border-ink' : 'border-neutral-300'}`}>
                <div className="flex items-center gap-2">
                  <input type="radio" name="paymentMethod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                  <span className="text-sm font-bold uppercase">Cash on Delivery</span>
                </div>
                {paymentMethod === 'cod' && (
                  <p className="text-xs text-neutral-500 mt-2">Pay with cash upon delivery.</p>
                )}
              </label>

              {['bkash', 'nagad'].map((methodId) => {
                const meta = paymentMethodMeta[methodId];
                const active = paymentMethod === methodId;
                return (
                  <label key={methodId} className={`border p-3 cursor-pointer ${active ? 'border-ink' : 'border-neutral-300'}`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" name="paymentMethod" checked={active} onChange={() => setPaymentMethod(methodId)} />
                      <span className="text-sm font-bold uppercase">{meta.label}</span>
                    </div>

                    {active && (
                      <div className="mt-3 bg-neutral-50 p-4 -mx-3 -mb-3 border-t border-line">
                        <p className="text-xs text-neutral-600 mb-3">
                          Please complete your {meta.label} payment at first, then fill up the form below.
                        </p>
                        <p className="text-xs mb-4">
                          <span className="font-bold">{meta.label} Personal Number:</span> {meta.number}
                        </p>

                        <div className="mb-3">
                          <label className="label-text">{meta.label} Number *</label>
                          <input
                            value={payerNumber}
                            onChange={(e) => setPayerNumber(e.target.value)}
                            className="input-field bg-white"
                            placeholder="017XXXXXXXX"
                            required={active}
                          />
                        </div>
                        <div>
                          <label className="label-text">{meta.label} Transaction ID *</label>
                          <input
                            value={paymentReference}
                            onChange={(e) => setPaymentReference(e.target.value)}
                            className="input-field bg-white"
                            placeholder="8N7A6D5EE7M"
                            required={active}
                          />
                        </div>
                      </div>
                    )}
                  </label>
                );
              })}
            </div>

            <label className="flex items-start gap-2 mt-6 text-xs">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5" />
              <span>I have read and agree to the website terms and conditions. *</span>
            </label>

            {error && <p className="text-xs text-red-600 mt-3">{error}</p>}

            <button type="submit" disabled={submitting} className="btn-primary mt-4">
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}