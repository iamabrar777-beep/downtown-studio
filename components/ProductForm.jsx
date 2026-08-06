'use client';

import { useState } from 'react';

const ALL_SIZES = ['M', 'L', 'XL', 'XXL'];

export default function ProductForm({ initialProduct, onSaved, onCancel }) {
  const isEdit = !!initialProduct;

  const [name, setName] = useState(initialProduct?.name || '');
  const [price, setPrice] = useState(initialProduct?.price || '');
  const [category, setCategory] = useState(initialProduct?.category || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [bulletText, setBulletText] = useState((initialProduct?.bullet_points || []).join('\n'));
  const [sizes, setSizes] = useState(initialProduct?.sizes || ['S', 'M', 'L', 'XL']);
  const [stock, setStock] = useState(initialProduct?.stock ?? 10);
  const [featured, setFeatured] = useState(initialProduct?.featured || false);
  const [images, setImages] = useState(initialProduct?.images || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function toggleSize(size) {
    setSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setError('');

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed.');
        setImages((prev) => [...prev, data.url]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  function removeImage(url) {
    setImages((prev) => prev.filter((i) => i !== url));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name || !price) {
      setError('Name and price are required.');
      return;
    }

    setSaving(true);
    const payload = {
      name,
      price: Number(price),
      category: category || 'uncategorized',
      description,
      bulletPoints: bulletText.split('\n').map((b) => b.trim()).filter(Boolean),
      sizes,
      images,
      stock: Number(stock),
      featured
    };

    try {
      const url = isEdit ? `/api/admin/products/${initialProduct.id}` : '/api/admin/products';
      const method = isEdit ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed.');
      onSaved(data.product);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-paper w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-lg font-bold uppercase mb-6">{isEdit ? 'Edit Product' : 'Add Product'}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">Product Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="label-text">Price (৳) *</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="input-field" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">Category</label>
              <input value={category} onChange={(e) => setCategory(e.target.value)} className="input-field" placeholder="e.g. Graphic, Vintage" />
            </div>
            <div>
              <label className="label-text">Stock Quantity</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="input-field" />
            </div>
          </div>

          <div>
            <label className="label-text">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" rows={2} />
          </div>

          <div>
            <label className="label-text">Bullet Points (one per line)</label>
            <textarea
              value={bulletText}
              onChange={(e) => setBulletText(e.target.value)}
              className="input-field"
              rows={4}
              placeholder={'100% COTTON\nOVERSIZED FIT\nMACHINE WASHABLE'}
            />
          </div>

          <div>
            <label className="label-text">Available Sizes</label>
            <div className="flex gap-2">
              {ALL_SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                  className={`w-10 h-10 border text-sm ${sizes.includes(s) ? 'bg-ink text-white border-ink' : 'border-neutral-300'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-text">Product Images</label>
            <input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={handleImageUpload} disabled={uploading} className="text-sm" />
            {uploading && <p className="text-xs text-neutral-500 mt-1">Uploading...</p>}
            {images.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {images.map((url) => (
                  <div key={url} className="relative w-16 h-16">
                    {/* using plain img here since these are arbitrary uploaded URLs in an admin-only form */}
                    <img src={url} alt="" className="w-16 h-16 object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-ink text-white text-[10px] rounded-full"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Feature on homepage
          </label>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onCancel} className="btn-outline">Cancel</button>
            <button type="submit" disabled={saving || uploading} className="btn-primary">
              {saving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
