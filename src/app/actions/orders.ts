'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { sendAdminOrderEmail, sendCustomerOrderEmail } from '@/lib/email';
import type { CartItem } from '@/types/database';

export async function placeOrder(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Creates an admin client capable of bypassing RLS if key is provided
  const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
    : supabase;

  const itemsJson = formData.get('items') as string;
  const items: CartItem[] = JSON.parse(itemsJson || '[]');
  if (items.length === 0) {
    return { error: 'Cart is empty' };
  }

  const total = items.reduce((sum, i) => sum + (i.price * (i.quantity ?? 1)), 0);
  const customer_name = formData.get('customer_name') as string;
  const city = formData.get('city') as string;
  const raw_address = formData.get('shipping_address') as string;
  const order_notes = (formData.get('order_notes') as string) || '';
  const shipping_address = [
    customer_name && `Name: ${customer_name}`,
    city && `City: ${city}`,
    raw_address && `Address: ${raw_address}`,
    order_notes && `Notes: ${order_notes}`,
  ]
    .filter(Boolean)
    .join('\n');
  const phone = formData.get('phone') as string;
  const payment_method = (formData.get('payment_method') as string) || 'cod';
  const file = formData.get('payment_screenshot') as File | null;
  const email = formData.get('email') as string || user?.email || 'guest@example.com';

  let payment_screenshot_url: string | null = null;
  if (payment_method !== 'cod' && file && file.size > 0) {
    const ext = file.name.split('.').pop() || 'jpg';
    const folderId = user?.id || 'guest';
    const path = `${folderId}/${Date.now()}.${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from('payment-screenshots')
      .upload(path, buf, { contentType: file.type, upsert: false });
    if (uploadError) {
      return { error: 'Failed to upload screenshot: ' + uploadError.message };
    }
    const { data: urlData } = supabase.storage.from('payment-screenshots').getPublicUrl(path);
    payment_screenshot_url = urlData.publicUrl;
  }

  const status =
    payment_method === 'cod'
      ? 'pending'
      : payment_screenshot_url
        ? 'payment_submitted'
        : 'pending';

  const orderData: any = {
    items,
    total_amount: total,
    status,
    shipping_address,
    phone,
    payment_method: payment_method || null,
    payment_screenshot_url,
  };

  if (user?.id) {
    orderData.user_id = user.id;
  } else {
    // Fill the required NOT NULL field with a generated UUID for guest
    orderData.user_id = crypto.randomUUID();
  }

  // Use the admin client to insert the order to bypass strict RLS for anonymous guests
  const { data: insertedOrder, error } = await supabaseAdmin
    .from('orders')
    .insert(orderData)
    .select('*')
    .single();

  if (error || !insertedOrder) {
    return { error: error?.message ?? 'Could not create order' };
  }

  // Fire-and-forget emails; do not block order creation on email issues
  try {
    await Promise.allSettled([
      sendCustomerOrderEmail({
        to: email,
        // cast because Supabase type is unknown; shape matches Order
        order: insertedOrder as unknown as import('@/types/database').Order,
      }),
      sendAdminOrderEmail({
        order: insertedOrder as unknown as import('@/types/database').Order,
        customerEmail: email,
      }),
    ]);
  } catch {
    // ignore email errors
  }
  revalidatePath('/orders');
  revalidatePath('/admin');
  return { success: true };
}

export async function updateOrderStatus(orderId: string, status: string, adminNotes?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const { data: admin } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).single();
  if (!admin) {
    return { error: 'Not authorized' };
  }

  const updates: { status: string; updated_at: string; admin_notes?: string } = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (adminNotes !== undefined) updates.admin_notes = adminNotes;

  const { error } = await supabase.from('orders').update(updates).eq('id', orderId);
  if (error) return { error: error.message };
  revalidatePath('/admin');
  revalidatePath('/orders');
  return { success: true };
}
