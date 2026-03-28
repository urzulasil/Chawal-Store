'use client';

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { updateOrderStatus } from '@/app/actions/orders';
import type { Order } from '@/types/database';
import { formatPrice } from '@/lib/format';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'payment_submitted', label: 'Payment submitted' },
  { value: 'verified', label: 'Verified' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

function OrderRow({ order }: { order: Order }) {
  const [state, formAction] = useActionState(
    async (_: unknown, formData: FormData) => {
      const id = formData.get('orderId') as string;
      const status = formData.get('status') as string;
      const notes = formData.get('admin_notes') as string;
      return await updateOrderStatus(id, status, notes || undefined);
    },
    null as { error?: string; success?: boolean } | null
  );

  useEffect(() => {
    if (state?.success) toast.success('Order updated');
    if (state?.error) toast.error(state.error);
  }, [state?.success, state?.error]);

  const items = (order.items as { name: string; price: number }[]) || [];

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100 overflow-hidden">
      <div className="flex flex-wrap justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-gray-500 truncate">Order ID: {order.id.slice(0, 8)}…</p>
          <p className="text-xs sm:text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
        </div>
        <span className="px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-amber-100 text-amber-800 shrink-0">
          {order.status.replace('_', ' ')}
        </span>
      </div>
      <p className="text-sm sm:text-base break-all"><strong>Phone:</strong> {order.phone}</p>
      <p className="text-sm sm:text-base break-words"><strong>Address:</strong> {order.shipping_address}</p>
      <p className="text-sm sm:text-base"><strong>Payment:</strong> {order.payment_method || '—'}</p>
      <ul className="my-2 text-gray-700 text-sm sm:text-base">
        {items.map((item, i) => (
          <li key={i}>
            {item.name} — {formatPrice(item.price)}
          </li>
        ))}
      </ul>
      <p className="font-bold text-[#27ae60] text-sm sm:text-base">
        Total: {formatPrice(order.total_amount)}
      </p>

      {order.payment_screenshot_url && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Payment screenshot:</p>
          <a
            href={order.payment_screenshot_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border rounded-lg overflow-hidden max-w-full w-full sm:max-w-xs"
          >
            <img
              src={order.payment_screenshot_url}
              alt="Payment screenshot"
              className="w-full h-auto max-h-48 object-cover"
            />
          </a>
        </div>
      )}

      <form action={formAction} className="mt-4 pt-4 border-t flex flex-col sm:flex-row flex-wrap gap-3 items-stretch sm:items-end">
        <input type="hidden" name="orderId" value={order.id} />
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select name="status" defaultValue={order.status} className="w-full sm:w-auto px-3 py-2 border rounded-lg text-base">
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-gray-700 mb-1">Admin notes (optional)</label>
          <input
            type="text"
            name="admin_notes"
            defaultValue={order.admin_notes ?? ''}
            placeholder="Note for customer"
            className="w-full px-3 py-2 border rounded-lg text-base"
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#27ae60] text-white font-medium hover:bg-[#1e7e34] transition text-base"
        >
          Update
        </button>
      </form>
      {state?.error && <p className="mt-2 text-red-600 text-sm">{state.error}</p>}
    </div>
  );
}

export default function AdminOrders({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return <p className="text-gray-600">No orders yet.</p>;
  }
  return (
    <div>
      {orders.map((order) => (
        <OrderRow key={order.id} order={order} />
      ))}
    </div>
  );
}
