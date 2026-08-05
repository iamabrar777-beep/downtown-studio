'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'downtown_studio_cart_v1';

function lineKey(productId, size) {
  return `${productId}::${size}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load cart from localStorage once, on mount (browser only)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      console.warn('Could not read cart from localStorage', e);
    }
    setHydrated(true);
  }, []);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [items, hydrated]);

  function addItem(product, size, qty = 1) {
    setItems((prev) => {
      const key = lineKey(product.id, size);
      const existing = prev.find((l) => lineKey(l.productId, l.size) === key);
      if (existing) {
        return prev.map((l) =>
          lineKey(l.productId, l.size) === key ? { ...l, qty: l.qty + qty } : l
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || null,
          size,
          qty
        }
      ];
    });
    setIsOpen(true);
  }

  function updateQty(productId, size, qty) {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((l) => lineKey(l.productId, l.size) !== lineKey(productId, size))
        : prev.map((l) =>
            lineKey(l.productId, l.size) === lineKey(productId, size) ? { ...l, qty } : l
          )
    );
  }

  function removeItem(productId, size) {
    setItems((prev) => prev.filter((l) => lineKey(l.productId, l.size) !== lineKey(productId, size)));
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = useMemo(
    () => items.reduce((sum, l) => sum + l.price * l.qty, 0),
    [items]
  );

  const itemCount = useMemo(() => items.reduce((sum, l) => sum + l.qty, 0), [items]);

  const value = {
    items,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    subtotal,
    itemCount,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false)
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
