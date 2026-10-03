/** Deterministic voucher code derived from the movement id: LAB-XXXX-XXXX. */
export function voucherCode(seed: string): string {
  let hash = 7;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 8; i++) {
    out += chars[hash % chars.length];
    hash = (Math.imul(hash, 1103515245) + 12345) >>> 0;
  }
  return `LAB-${out.slice(0, 4)}-${out.slice(4)}`;
}
