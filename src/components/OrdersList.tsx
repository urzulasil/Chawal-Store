import Link from 'next/link';
import type { Order } from '@/types/database';
import { formatPrice } from '@/lib/format';

const statusColors: Record<string, string> = {
  pending: 'bg-gray-200 text-gray-800',
  payment_submitted: 'bg-amber-100 text-amber-800',
  verified: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersList({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center bg-white rounded-xl shadow p-8">
        <p className="text-gray-600 mb-4">You have no orders yet.</p>
        <Link href="/#products" className="text-[#27ae60] font-semibold hover:underline">
          Shop now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 w-full">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="text-xs sm:text-sm text-gray-500">
              {new Date(order.created_at).toLocaleString()}
            </span>
            <span className={`px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${statusColors[order.status] ?? 'bg-gray-100'}`}>
              {order.status.replace('_', ' ')}
            </span>
          </div>
          <ul className="text-gray-700 mb-2 text-sm sm:text-base">
            {(order.items as { name: string; price: number }[]).map((item, i) => (
              <li key={i}>
                {item.name} — {formatPrice(item.price)}
              </li>
            ))}
          </ul>
          <p className="font-bold text-[#27ae60] text-sm sm:text-base">
            Total: {formatPrice(order.total_amount)}
          </p>
          {order.admin_notes && (
            <p className="mt-2 text-xs sm:text-sm text-gray-600">Note: {order.admin_notes}</p>
          )}
        </div>
      ))}
    </div>
  );
}
