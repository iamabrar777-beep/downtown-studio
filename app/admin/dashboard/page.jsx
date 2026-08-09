'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/ProductForm';

function formatPrice(n) {
  return `${Number(n).toLocaleString('en-BD')}৳`;
}

const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminDashboardPage() {
  const [tab, setTab] = useState('products');
  const router = useRouter();

  return (
    <main className="max-w-6xl mx-auto px-5 md:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold uppercase">Admin Dashboard</h1>
        <button
          onClick={async () => {
            await fetch('/api/admin/logout', { method: 'POST' });
            router.push('/admin/login');
          }}
          className="text-xs uppercase tracking-wide2 underline"
        >
          Log Out
        </button>
      </div>

      <div className="flex gap-2 mb-8 border-b border-line">
        <button
          onClick={() => setTab('products')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wide2 border-b-2 ${
            tab === 'products' ? 'border-ink' : 'border-transparent text-neutral-400'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setTab('orders')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wide2 border-b-2 ${
            tab === 'orders' ? 'border-ink' : 'border-transparent text-neutral-400'
          }`}
        >
          Orders
        </button>
      </div>

      {tab === 'products' ? <ProductsPanel /> : <OrdersPanel />}
    </main>
  );
}

function ProductsPanel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  async function loadProducts() {
    setLoading(true);
    const res = await fetch('/api/admin/products', { cache: 'no-store' });
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }

  useEffect(() => { loadProducts(); }, []);

  function handleSaved() {
    setFormOpen(false);
    setEditingProduct(null);
    loadProducts();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    loadProducts();
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => { setEditingProduct(null); setFormOpen(true); }} className="btn-primary w-auto px-6">
          + Add Product
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-neutral-500">No products yet. Add your first one above.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide2 text-neutral-500">
                <th className="py-3 pr-4">Image</th>
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Category</th>
                <th className="py-3 pr-4">Price</th>
                <th className="py-3 pr-4">Stock</th>
                <th className="py-3 pr-4">Featured</th>
                <th className="py-3 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-line">
                  <td className="py-3 pr-4">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt="" className="w-12 h-14 object-cover" />
                    ) : (
                      <div className="w-12 h-14 bg-neutral-100 flex items-center justify-center text-neutral-300 font-black">
                        {p.name.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td className="py-3 pr-4">{p.name}</td>
                  <td className="py-3 pr-4">{p.category}</td>
                  <td className="py-3 pr-4">{formatPrice(p.price)}</td>
                  <td className="py-3 pr-4">
                    {(() => {
                      const sizes = p.sizes || [];
                      const total = sizes.reduce((sum, s) => sum + Number(p.stock?.[s] ?? 0), 0);
                      return (
                        <span className={total <= 0 ? 'text-red-600 font-bold' : ''}>
                          {sizes.length > 0
                            ? sizes.map((s) => `${s}:${p.stock?.[s] ?? 0}`).join(' ')
                            : '—'}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="py-3 pr-4">{p.featured ? '★' : ''}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <button
                      onClick={() => { setEditingProduct(p); setFormOpen(true); }}
                      className="text-xs underline mr-3"
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-xs underline text-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <ProductForm
          initialProduct={editingProduct}
          onSaved={handleSaved}
          onCancel={() => { setFormOpen(false); setEditingProduct(null); }}
        />
      )}
    </div>
  );
}

function OrdersPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  async function loadOrders() {
    setLoading(true);
    const res = await fetch('/api/admin/orders', { cache: 'no-store' });
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }

  useEffect(() => { loadOrders(); }, []);

  async function updateStatus(id, status) {
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    loadOrders();
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={loadOrders} className="text-xs uppercase tracking-wide2 underline">
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-neutral-500">No orders yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div key={order.id} className="border border-line p-4">
              <div
                className="flex flex-wrap items-center justify-between gap-2 cursor-pointer"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <div>
                  <p className="font-bold text-sm">{order.order_number}</p>
                  <p className="text-xs text-neutral-500">
                    {order.customer_name} · {order.phone} · {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold">{formatPrice(order.total)}</span>
                  <select
                    value={order.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="appearance-none border border-neutral-300 text-xs px-2 py-1 uppercase bg-paper text-ink"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {expandedId === order.id && (
                <div className="mt-4 pt-4 border-t border-line grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-bold uppercase text-xs tracking-wide2 mb-2">Items</p>
                    {order.items.map((item, i) => (
                      <p key={i} className="text-neutral-400">
                        {item.name} {item.size ? `- ${item.size}` : ''} &times; {item.qty} — {formatPrice(item.price * item.qty)}
                      </p>
                    ))}
                    <p className="mt-2 text-neutral-400">Shipping: {formatPrice(order.shipping)}</p>
                  </div>
                  <div>
                    <p className="font-bold uppercase text-xs tracking-wide2 mb-2">Delivery &amp; Payment</p>
                    <p className="text-neutral-400">{order.address}, {order.city}{order.district ? `, ${order.district}` : ''}</p>
                    {order.email && <p className="text-neutral-400">{order.email}</p>}
                    {order.notes && <p className="text-neutral-400 italic mt-1">Note: {order.notes}</p>}
                    <p className="mt-2 text-neutral-400">
                      Delivery Area: <span className="uppercase">{order.delivery_zone === 'outside' ? 'Outside Ctg' : 'Inside Ctg'}</span>
                    </p>
                    <p className="mt-2 text-neutral-400 uppercase">
                      {order.payment_method}
                      {order.payment_number ? ` — From: ${order.payment_number}` : ''}
                      {order.payment_reference ? ` — Ref: ${order.payment_reference}` : ''}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}