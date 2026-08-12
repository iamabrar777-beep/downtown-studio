export const SHIPPING_RATES = { inside: 70, outside: 130 };

const CTG_KEYWORDS = ['chattogram', 'chittagong', 'ctg', 'চট্টগ্রাম'];

export function detectZone(city, district) {
  const text = `${city || ''} ${district || ''}`.toLowerCase();
  return CTG_KEYWORDS.some((k) => text.includes(k)) ? 'inside' : 'outside';
}