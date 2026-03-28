'use client';

import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion, type Variants } from 'framer-motion';
import type { Product } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/format';

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
      transition: {
        staggerChildren: 0.08,
        duration: 0.4,
        ease: 'easeOut',
      },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ProductGrid({ products }: { products: Product[] }) {
  const router = useRouter();

  function addToCart(product: Product) {
    const existing: {
      product_id: string;
      name: string;
      price: number;
      quantity?: number;
    }[] = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart') || '[]') : [];

    const index = existing.findIndex((item) => item.product_id === product.id);
    let updated = existing;

    if (index === -1) {
      updated = [
        ...existing,
        {
          product_id: product.id,
          name: product.name,
          price: product.price_per_kg,
          quantity: 1,
        },
      ];
    } else {
      const current = existing[index];
      updated = [
        ...existing.slice(0, index),
        { ...current, quantity: (current.quantity ?? 1) + 1 },
        ...existing.slice(index + 1),
      ];
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(updated));
      toast.success(`${product.name} added to cart`);
      window.dispatchEvent(new Event('cart-updated'));
      window.dispatchEvent(new Event('open-cart'));
    }
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 max-w-md mx-auto">
        <p>No products at the moment. Check back soon or run the Supabase schema to seed products.</p>
      </div>
    );
  }

  const sortedProducts = [...products].sort((a, b) => b.price_per_kg - a.price_per_kg);
  const maxPrice = Math.max(...products.map(p => p.price_per_kg));

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 max-w-3xl mx-auto place-items-center"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      {sortedProducts.map((product) => (
        <motion.div
          key={product.id}
          variants={cardVariants}
          className="group relative flex flex-col bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(0,0,0,0.08)] w-full max-w-sm"
        >
          <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
            <Image
              src={product.image_url || '/1.jpeg'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          <div className="flex flex-col flex-1 items-stretch px-4 pt-4 pb-5 gap-2">
            <h3 className="heading-serif text-balance text-base sm:text-lg md:text-xl text-gray-900 text-center">
              {product.name}
            </h3>
            <p className="text-[#27ae60] font-semibold text-sm sm:text-base text-center">
              {formatPrice(product.price_per_kg)} {product.price_per_kg === maxPrice ? '/ 5kg' : '/ kg'}
            </p>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => addToCart(product)}
              className="mt-3 inline-flex items-center justify-center px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-[#27ae60] text-white text-sm sm:text-base font-semibold shadow-[0_8px_20px_rgba(39,174,96,0.35)] hover:bg-[#1e7e34] transition-colors w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#27ae60]"
            >
              Add to Cart
            </motion.button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
