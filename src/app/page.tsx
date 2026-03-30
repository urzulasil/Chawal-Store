import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ProductGrid from '@/components/ProductGrid';
import Reviews from '@/components/Reviews';
import type { Product } from '@/types/database';

export default async function HomePage() {
  let products: Product[] | null = null;
  let productsError: string | null = null;
  try {
    const supabase = await createClient();
    const result = await supabase.from('products').select('*').order('created_at');
    products = result.data as Product[] | null;
    if (result.error) productsError = result.error.message;
  } catch (e) {
    productsError = e instanceof Error ? e.message : 'Could not connect to database';
  }

  return (
    <>
      <section id="home" className="min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-center items-center text-center text-white bg-cover bg-center bg-no-repeat px-4 py-12" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.45)), url("/rice.jpeg")' }}>
        <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-xs sm:text-sm font-semibold tracking-widest uppercase">
          100% Natural · Export Quality
        </span>
        <h1 className="heading-serif text-balance text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold max-w-3xl leading-tight">
          Premium Basmati Rice
        </h1>
        <p className="mt-4 mb-8 text-base sm:text-lg text-white/90 max-w-xl">Quality you can trust, Purity you can taste — straight from Sheikhupura&apos;s finest fields.</p>
        <Link href="#products" className="bg-[#27ae60] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#1e7e34] transition-all hover:shadow-lg hover:shadow-green-900/40 text-sm sm:text-base">
          Shop Now
        </Link>
      </section>

      <section id="about" className="py-16 sm:py-20 px-4 sm:px-6 md:px-[10%] bg-gradient-to-b from-white via-[#f8f9fa] to-white">
        <div className="max-w-4xl mx-auto">
          {/* Section label */}
          <div className="flex flex-col items-center text-center mb-10">
            <span className="text-xs font-bold tracking-widest uppercase text-[#27ae60] mb-2">Our Story</span>
            <h2 className="heading-serif text-balance text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
              About <span className="text-[#27ae60]">URUZ UL ASIL</span>
            </h2>
            <div className="mt-3 w-16 h-1 rounded-full bg-[#27ae60]" />
          </div>
          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {/* Farm Fresh */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-xl bg-[#27ae60]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#27ae60]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M3 12h1m16 0h1M4.927 19.073l.707-.707M18.364 5.636l.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3C8 7 6 10 6 13a6 6 0 0012 0c0-3-2-6-6-10z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Farm Fresh</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Sourced directly from Sheikhupura — Pakistan&apos;s most fertile rice-growing region.</p>
            </div>
            {/* Modern Processing */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-xl bg-[#27ae60]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#27ae60]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Modern Processing</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Every grain is processed in a state-of-the-art facility under strict quality control.</p>
            </div>
            {/* Safe Packaging */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-xl bg-[#27ae60]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#27ae60]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Safe Packaging</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Carefully packaged from field to your doorstep to preserve freshness and aroma.</p>
            </div>
          </div>
          <div className="text-sm sm:text-base text-gray-600 leading-relaxed text-center max-w-2xl mx-auto space-y-3">
            <p>
              From its rich aroma to its long, perfectly separated grains — every bite of URUZ UL ASIL is a testament to uncompromised quality. Sourced from the fertile lands of Sheikhupura, our rice is the product of years of expertise and dedication, resulting in a grain that truly stands in a class of its own.
            </p>
            <p>
              From the fields to your dining table, every step is handled with utmost care and love — ensuring that only the finest rice, worthy of your family, reaches your home. Because you deserve nothing less than the best.
            </p>
          </div>
        </div>
      </section>

      <section id="products" className="py-16 sm:py-20 px-4 sm:px-6 md:px-[10%]">
        <div className="flex flex-col items-center text-center mb-10">
          <span className="text-xs font-bold tracking-widest uppercase text-[#27ae60] mb-2">What We Offer</span>
          <h2 className="heading-serif text-balance text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
            Our <span className="text-[#27ae60]">Products</span>
          </h2>
          <div className="mt-3 w-16 h-1 rounded-full bg-[#27ae60]" />
        </div>
        {productsError && (
          <p className="text-center text-amber-700 bg-amber-50 border border-amber-200 rounded-lg py-3 px-4 max-w-xl mx-auto mb-6 text-sm">
            Could not load products: {productsError}. Check <a href="/api/supabase-health" className="underline font-medium" target="_blank" rel="noopener noreferrer">/api/supabase-health</a> and your Supabase setup.
          </p>
        )}
        <ProductGrid products={products ?? []} />
      </section>

      <section id="reviews" className="py-16 sm:py-20 px-4 sm:px-6 md:px-[10%] bg-gradient-to-b from-white via-[#f8f9fa] to-white">
        <div className="flex flex-col items-center text-center mb-10">
          <span className="text-xs font-bold tracking-widest uppercase text-[#27ae60] mb-2">Testimonials</span>
          <h2 className="heading-serif text-balance text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
            What Our <span className="text-[#27ae60]">Customers</span> Say
          </h2>
          <div className="mt-3 w-16 h-1 rounded-full bg-[#27ae60]" />
        </div>
        <Reviews />
      </section>
    </>
  );
}
