"use client";  // <-- Add this at the very top

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import type { CartItem } from '@/types/database';
import { formatPrice } from '@/lib/format';

// ...rest of your Header component

export default function Header({ user }: { user: User | null }) {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const supabase = createClient();
  const router = useRouter();

  const loadCart = () => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
    setCart(raw ? JSON.parse(raw) : []);
  };

  useEffect(() => {
    document.body.style.overflow = (open || cartOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open, cartOpen]);

  useEffect(() => {
    loadCart();
    const handleStorage = () => loadCart();
    const handleOpenCart = () => { loadCart(); setCartOpen(true); };
    
    window.addEventListener('storage', handleStorage);
    window.addEventListener('cart-updated', handleStorage);
    window.addEventListener('open-cart', handleOpenCart);
    const onEscape = (e: KeyboardEvent) => { 
      if (e.key === 'Escape') { setOpen(false); setCartOpen(false); }
    };
    window.addEventListener('keydown', onEscape);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('cart-updated', handleStorage);
      window.removeEventListener('open-cart', handleOpenCart);
      window.removeEventListener('keydown', onEscape);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/');
  };

  const cartCount = cart.reduce((acc, item) => acc + (item.quantity ?? 1), 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * (item.quantity ?? 1)), 0);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-2 bg-white shadow-md md:px-10">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex items-center h-14">
          <Image
            src="/logo.png"
            alt="URUZ UL ASIL Logo"
            width={400}
            height={200}
            className="h-14 w-auto object-contain scale-125"
            priority
          />
        </div>
        <span className="text-sm sm:text-base font-bold tracking-wide text-[#27ae60]">
          URUZ UL ASIL
        </span>
      </Link>

      {/* Mobile backdrop */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      />

      <div className="flex items-center gap-4 md:gap-8">
        <nav className={`fixed top-[52px] sm:top-[57px] right-0 z-50 w-[85%] max-w-[280px] min-h-[calc(100vh-52px)] bg-white flex flex-col items-center gap-5 py-8 shadow-xl transition-transform duration-300 ease-out md:static md:min-h-0 md:w-auto md:max-w-none md:flex-row md:gap-4 lg:gap-6 md:shadow-none md:py-0 ${open ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
          <Link href="/#home" onClick={() => setOpen(false)} className="font-semibold text-gray-700 hover:text-[#27ae60]">Home</Link>
          <Link href="/#about" onClick={() => setOpen(false)} className="font-semibold text-gray-700 hover:text-[#27ae60]">About</Link>
          <Link href="/#products" onClick={() => setOpen(false)} className="font-semibold text-gray-700 hover:text-[#27ae60]">Products</Link>
          <Link href="/#reviews" onClick={() => setOpen(false)} className="font-semibold text-gray-700 hover:text-[#27ae60]">Reviews</Link>
          <Link href="/#contact" onClick={() => setOpen(false)} className="font-semibold text-gray-700 hover:text-[#27ae60]">Contact</Link>

          {user && (
            <>
              <Link href="/orders" onClick={() => setOpen(false)} className="font-semibold text-gray-700 hover:text-[#27ae60]">My Orders</Link>
              <Link href="/admin" onClick={() => setOpen(false)} className="font-semibold text-amber-600 hover:text-amber-700">Admin</Link>
              <button onClick={() => { handleSignOut(); setOpen(false); }} className="font-semibold text-red-600 hover:text-red-700">Sign out</button>
            </>
          )}
        </nav>

        {/* Cart Icon */}
        <button onClick={() => setCartOpen(true)} className="relative p-2 text-gray-700 hover:text-[#27ae60] transition-colors" aria-label="Open Cart">
          <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute 0 top-0.5 right-0 bg-[#27ae60] text-white text-[10px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
              {cartCount}
            </span>
          )}
        </button>

        <button
          type="button"
          className="p-2 text-2xl md:hidden -ml-2 text-gray-700"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Cart Side Drawer */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${cartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setCartOpen(false)}></div>
        <div className={`absolute top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
            <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-red-500 text-2xl transition-colors">✕</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-3">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center mt-8">Your cart is empty.</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex-1 pr-3">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{item.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{formatPrice(item.price)} x {item.quantity ?? 1}</p>
                  </div>
                  <p className="font-bold text-[#27ae60] shrink-0 text-sm sm:text-base">{formatPrice(item.price * (item.quantity ?? 1))}</p>
                </div>
              ))
            )}
          </div>
          
          {cart.length > 0 && (
             <div className="p-4 sm:p-5 border-t border-gray-100 bg-white">
               <div className="flex justify-between items-center mb-4 sm:mb-5">
                 <span className="font-semibold text-gray-600">Total</span>
                 <span className="font-bold text-xl text-[#27ae60]">{formatPrice(cartTotal)}</span>
               </div>
               <button 
                 onClick={() => { setCartOpen(false); router.push('/checkout'); }}
                 className="w-full flex items-center justify-center gap-2 bg-[#27ae60] hover:bg-[#1e7e34] text-white font-bold py-3.5 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
               >
                 Proceed to Checkout
               </button>
             </div>
          )}
        </div>
      </div>
    </header>
  );
}