'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { placeOrder } from '@/app/actions/orders';
import type { CartItem } from '@/types/database';
import { formatPrice } from '@/lib/format';

export default function CheckoutForm() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
    setCart(raw ? JSON.parse(raw) : []);
    setMounted(true);
  }, []);

  const [state, formAction] = useActionState(
    async (_: unknown, formData: FormData) => {
      const result = await placeOrder(formData);
      if (result?.error) return { error: result.error };
      if (result?.success) return { success: true };
      return null;
    },
    null as { error?: string; success?: boolean } | null
  );

  useEffect(() => {
    if (state?.success) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cart-updated'));
      }
      toast.success('Order placed! We will verify your payment shortly.');
    }
  }, [state?.success]);

  useEffect(() => {
    if (state?.error) toast.error(state.error);
  }, [state?.error]);

  if (!mounted) return <p className="text-center">Loading...</p>;

  if (state?.success) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 flex flex-col items-center justify-center text-center border-t-8 border-[#27ae60] w-full">
        <div className="w-20 h-20 bg-green-100 text-[#27ae60] rounded-full flex items-center justify-center mb-6 shadow-sm">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Order Placed Successfully!</h3>
        <p className="text-gray-600 mb-8 max-w-md text-sm sm:text-base leading-relaxed">
          Thank you for choosing URUZ UL ASIL! We have received your order details and will verify your payment shortly. An email confirmation has been sent to you.
        </p>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="bg-[#27ae60] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#1e7e34] transition shadow-lg hover:shadow-xl text-sm sm:text-base"
        >
          Return to Home Page
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-10 flex flex-col items-center">
        <p className="text-center text-gray-500 mb-4">Your cart is empty.</p>
        <button onClick={() => router.push('/#products')} className="text-[#27ae60] font-bold py-2 px-6 border-2 border-[#27ae60] rounded-full hover:bg-[#27ae60] hover:text-white transition">
          Shop Now
        </button>
      </div>
    );
  }

  const total = cart.reduce((sum, i) => sum + (i.price * (i.quantity ?? 1)), 0);

  return (
    <form
      action={formAction}
      className="bg-white rounded-xl shadow-lg p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 w-full"
    >
      <input type="hidden" name="items" value={JSON.stringify(cart)} />

      {/* Cart summary */}
      <div className="border border-gray-100 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-3 sm:px-4 py-2.5 sm:py-3">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800">
            Cart Summary
          </h3>
        </div>
        <ul className="divide-y divide-gray-100">
          {cart.map((item, index) => {
            const qty = item.quantity ?? 1;
            const lineTotal = item.price * qty;
            return (
              <li
                key={index}
                className="px-3 sm:px-4 py-2.5 sm:py-3 flex items-start justify-between gap-3 sm:gap-4 text-xs sm:text-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-gray-600">
                    Qty: <span className="font-medium">{qty}</span> × {formatPrice(item.price)} / kg
                  </p>
                </div>
                <p className="shrink-0 font-semibold text-[#27ae60]">
                  {formatPrice(lineTotal)}
                </p>
              </li>
            );
          })}
        </ul>
        <div className="bg-gray-50 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
          <span className="text-sm sm:text-base font-semibold text-gray-800">
            Order Total
          </span>
          <span className="text-base sm:text-lg font-bold text-[#27ae60]">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* Shipping + payment */}
      <div className="grid gap-3 sm:gap-4">
        <input
          type="text"
          name="customer_name"
          placeholder="Full Name"
          required
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] text-base"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] text-base"
        />
        <input
          type="text"
          name="shipping_address"
          placeholder="Delivery Address"
          required
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] text-base"
        />
        <input
          type="text"
          name="city"
          placeholder="City / Location"
          required
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] text-base"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          required
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] text-base"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment method
          </label>
          <select
            name="payment_method"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] text-base"
          >
            <option value="cod">Cash on Delivery (COD)</option>
            <option value="easypaisa">Easy Paisa</option>
            <option value="jazzcash">JazzCash</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment screenshot (required for online payments)
          </label>
          <input
            type="file"
            name="payment_screenshot"
            accept="image/*"
            className="w-full text-xs sm:text-sm text-gray-600 file:mr-2 sm:file:mr-4 file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:bg-[#27ae60] file:text-white file:font-medium file:text-sm"
          />
        </div>
        <textarea
          name="order_notes"
          placeholder="Order notes (optional)"
          rows={3}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27ae60] text-base resize-none"
        />
      </div>

      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}

      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-[#27ae60] text-white font-semibold hover:bg-[#1e7e34] transition text-base"
      >
        Place Order
      </button>
    </form>
  );
}
