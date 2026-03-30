export function formatPrice(amount: number): string {
  if (!Number.isFinite(amount)) return 'PKR 0';
  const formatter = new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
}

export function getWeightSuffix(price: number): string {
  if (price === 2199) return '/ 5kg';
  if (price === 1399) return '/ 3kg';
  return '/ kg';
}
