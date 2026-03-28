export function formatPrice(amount: number): string {
  if (!Number.isFinite(amount)) return 'PKR 0';
  const formatter = new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
}

