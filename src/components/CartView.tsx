'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import type { CartItem } from '@/types/database';
import { formatPrice } from '@/lib/format';

export default function CartView() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
    setCart(raw ? JSON.parse(raw) : []);
    setMounted(true);
  }, []);

  function sync(next: CartItem[]) {
    setCart(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(next));
      window.dispatchEvent(new Event('cart-updated'));
    }
  }

  function removeItem(index: number) {
    const item = cart[index];
    const next = cart.filter((_, i) => i !== index);
    sync(next);
    toast.success(`${item?.name ?? 'Item'} removed from cart`);
  }

  function increaseQuantity(index: number) {
    const next = cart.map((item, i) =>
      i === index ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item,
    );
    sync(next);
  }

  function decreaseQuantity(index: number) {
    const current = cart[index];
    const currentQty = current?.quantity ?? 1;
    if (currentQty <= 1) return; // prevent going below 1
    const next = cart.map((item, i) =>
      i === index ? { ...item, quantity: currentQty - 1 } : item,
    );
    sync(next);
  }

  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity ?? 1)), 0);

  if (!mounted) {
    return <p className="text-center text-gray-500">Loading cart...</p>;
  }

  if (cart.length === 0) {
    return (
      <div className="text-center max-w-md mx-auto bg-white rounded-xl shadow p-8">
        <p className="text-gray-600 mb-4">Your cart is empty.</p>
        <Link href="/#products" className="text-[#27ae60] font-semibold hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {cart.map((item, index) => (
            <li key={index} className="flex items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base truncate">{item.name}</p>
                <p className="text-[#27ae60] font-semibold text-xs sm:text-sm">
                  {formatPrice(item.price)} / kg
                </p>
                <p className="mt-0.5 text-xs sm:text-sm text-gray-600">
                  Line total: {formatPrice(item.price * (item.quantity ?? 1))}
                </p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={() => decreaseQuantity(index)}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md border border-gray-300 text-gray-700 text-sm sm:text-base disabled:opacity-40"
                  disabled={(item.quantity ?? 1) <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center text-sm sm:text-base">
                  {item.quantity ?? 1}
                </span>
                <button
                  type="button"
                  onClick={() => increaseQuantity(index)}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md border border-gray-300 text-gray-700 text-sm sm:text-base"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="shrink-0 text-red-600 hover:text-red-700 text-xs sm:text-sm font-medium py-1 px-2"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

      </div>
    </div>
    
  );
}
