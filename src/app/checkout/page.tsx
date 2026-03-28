import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CartView from '@/components/CartView';
import CheckoutForm from '@/components/CheckoutForm';

export default async function CheckoutPage() {
  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-[10%] min-h-[60vh]">
      <h2 className="heading-serif text-balance text-xl sm:text-2xl font-bold text-[#27ae60] text-center mb-6 sm:mb-8">
        Checkout
      </h2>
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 w-full items-start">
        <div className="col-span-12 lg:col-span-8 space-y-4 sm:space-y-6">
          <CartView />
          <PaymentDetails />
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-4 sm:space-y-6 lg:sticky lg:top-24">
          <CheckoutForm />
        </div>
      </div>
    </section>
  );
}

function PaymentDetails() {
  return (
    <div className="max-w-2xl mx-auto w-full mt-2 lg:mt-0 bg-[#fff7ea] border border-amber-200/70 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
      <h3 className="text-sm sm:text-base font-semibold text-amber-900 mb-2 flex items-center justify-between">
        <span>Payment details</span>
        <span className="text-[10px] sm:text-xs uppercase tracking-wide text-amber-700/80">
          Important
        </span>
      </h3>
      <p className="text-amber-900 mb-1.5 break-all">
        <strong>Easy Paisa:</strong> 03247240380
      </p>
      <p className="text-amber-900 mb-1.5 break-all">
        <strong>JazzCash:</strong> 03247240380
      </p>
      <p className="text-amber-900 mb-1.5 break-words">
        <strong>Bank:</strong> Add bank name, title, account number &amp; IBAN here.
      </p>
      <p className="mt-2 text-amber-800 text-[11px] sm:text-xs leading-relaxed">
        Online payment ke baad screenshot upload karen aur order place karein. Admin aapka payment
        verify karke order confirm karega.
      </p>
    </div>
  );
}
