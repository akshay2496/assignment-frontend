export function formatPrice(amount) {
  const num = Number(amount) || 0;
  return `₹${num.toFixed(2)}`;
}
