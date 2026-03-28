import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import OrdersList from '@/components/OrdersList';

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in?redirect=/orders');

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-[10%] min-h-[60vh]">
      <h2 className="text-xl sm:text-2xl font-bold text-[#27ae60] text-center mb-6 sm:mb-8">My Orders</h2>
      <OrdersList orders={orders ?? []} />
    </section>
  );
}
