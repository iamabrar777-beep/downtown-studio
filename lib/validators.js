// Shared validation rules — used on BOTH the checkout page (for instant
// feedback) and the /api/orders route (the authoritative check that
// actually decides whether an order is accepted). Keeping them in one
// file means the two can never quietly drift out of sync.

export function isValidBDPhone(input) {
  if (!input) return false;
  let digits = String(input).replace(/[\s-]/g, '');
  if (digits.startsWith('+880')) digits = '0' + digits.slice(4);
  else if (digits.startsWith('880')) digits = '0' + digits.slice(3);
  return /^01[3-9]\d{8}$/.test(digits);
}

export function isValidTransactionId(input) {
  if (!input) return false;
  return /^[A-Za-z0-9]{6,15}$/.test(String(input).trim());
}