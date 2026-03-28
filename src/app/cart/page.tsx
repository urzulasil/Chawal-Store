import CartView from '@/components/CartView';

export default function CartPage() {
  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-[10%] min-h-[60vh]">
      <h2 className="text-xl sm:text-2xl font-bold text-[#27ae60] text-center mb-6 sm:mb-8">Your Cart</h2>
      <CartView />
    </section>
  );
}
