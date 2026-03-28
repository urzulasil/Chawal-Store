import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminOrders from '@/components/AdminOrders';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { data: admin } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).single();
  if (!admin) {
    return (
      <div className="py-16 px-6 text-center">
        <p className="text-red-600 font-medium">You are not authorized to view the admin panel.</p>
      </div>
    );
  }

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-[10%] min-h-[60vh]">
      <h2 className="text-xl sm:text-2xl font-bold text-[#27ae60] mb-2">Admin — Orders</h2>
      <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">Verify payment screenshots and update order status.</p>
      <AdminOrders orders={orders ?? []} />
    </section>
  );
}
