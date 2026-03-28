import nodemailer from 'nodemailer';
import type { Order, CartItem } from '@/types/database';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const fromEmail = process.env.SMTP_FROM_EMAIL ?? smtpUser ?? '';
const fromName = process.env.SMTP_FROM_NAME ?? 'URUZ UL ASIL';
const adminEmail = process.env.ORDER_ADMIN_EMAIL ?? '';

function getTransport() {
  if (!smtpHost || !smtpUser || !smtpPass || !fromEmail) {
    throw new Error('SMTP not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL.');
  }
  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function renderItems(items: CartItem[]) {
  return items
    .map((item) => {
      const qty = item.quantity ?? 1;
      const lineTotal = item.price * qty;
      return `• ${item.name} — ${qty} × Rs ${item.price} = ${formatCurrency(lineTotal)}`;
    })
    .join('\n');
}

export async function sendCustomerOrderEmail(args: {
  to: string;
  order: Order;
}) {
  const { to, order } = args;
  const transporter = getTransport();

  const subject = `Your order confirmation — ${formatCurrency(order.total_amount)}`;

  const text = [
    'Thank you for your order at URUZ UL ASIL!',
    '',
    'Order details:',
    renderItems(order.items),
    '',
    `Total: ${formatCurrency(order.total_amount)}`,
    `Payment method: ${order.payment_method || 'Not specified'}`,
    '',
    'Shipping information:',
    order.shipping_address,
    '',
    'We will contact you shortly to confirm your order.',
  ].join('\n');

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    text,
  });
}

export async function sendAdminOrderEmail(args: {
  order: Order;
  customerEmail: string | null;
}) {
  if (!adminEmail) return;
  const { order, customerEmail } = args;
  const transporter = getTransport();

  const subject = `New order — ${formatCurrency(order.total_amount)}`;

  const text = [
    'New order received:',
    '',
    `Customer email: ${customerEmail ?? 'Unknown'}`,
    '',
    'Order details:',
    renderItems(order.items),
    '',
    `Total: ${formatCurrency(order.total_amount)}`,
    `Payment method: ${order.payment_method || 'Not specified'}`,
    '',
    'Shipping information:',
    order.shipping_address,
    '',
    `Phone: ${order.phone}`,
  ].join('\n');

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: adminEmail,
    subject,
    text,
  });
}

