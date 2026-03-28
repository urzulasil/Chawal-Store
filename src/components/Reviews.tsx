'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

const reviews = [
  {
    name: 'Ali Raza',
    text: 'The rice quality is amazing! the flavor is incredible. Highly recommend!',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    name: 'Fatima Khan',
    text: 'Packaging aur delivery dono excellent the.',
    avatar: 'https://ui-avatars.com/api/?name=Fatima+Khan&background=8B5E3C&color=fff&size=200',
  },
  {
    name: 'Usman Ahmed',
    text: 'پکنے کے بعد دانہ دانہ الگ رہتا ہے، واقعی بہترین چاول ہیں۔',
    avatar: 'https://images.pexels.com/photos/35565655/pexels-photo-35565655.jpeg',
  },
];

export default function Reviews() {
  // Duplicate items for seamless marquee
  const marqueeItems = useMemo(() => [...reviews, ...reviews], []);

  return (
    <div className="relative max-w-5xl mx-auto overflow-hidden">
      <motion.div
        className="flex gap-4 sm:gap-6 md:gap-8 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: -300, right: 0 }}
        initial={{ x: 0 }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          repeat: Infinity,
          duration: 40,
          ease: 'linear',
        }}
      >
        {marqueeItems.map((r, idx) => (
          <div
            key={`${r.name}-${idx}`}
            className="min-w-[260px] max-w-xs bg-white/90 backdrop-blur rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-4 sm:p-5 text-center"
          >
            <img
              src={r.avatar}
              alt={r.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-[#27ae60] mx-auto mb-3 object-cover"
            />
            <h3 className="font-semibold text-sm sm:text-base text-gray-900">{r.name}</h3>
            <p className="mt-2 text-xs sm:text-sm text-gray-600">&ldquo;{r.text}&rdquo;</p>
            <div className="text-yellow-500 mt-2 text-sm">★★★★★</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
