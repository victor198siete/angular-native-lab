/** Number and date formatting that does not depend on Intl/locale data being present on-device. */

/** 12480 -> "12,480". */
export function formatPoints(value: number): string {
  const rounded = Math.round(value);
  const digits = String(Math.abs(rounded)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return rounded < 0 ? `-${digits}` : digits;
}

/** 2500 -> "+2,500" / "−2,500" (a real minus sign, not a hyphen). */
export function formatSigned(value: number, sign: '+' | '−'): string {
  return `${sign}${formatPoints(value)}`;
}

/** Points to an approximate money value, at 1 point = 0.01. 12480 -> "124.80". */
export function pointsToMoney(points: number): string {
  const cents = Math.round(points);
  const whole = formatPoints(Math.floor(cents / 100));
  return `${whole}.${String(cents % 100).padStart(2, '0')}`;
}

const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

/** `YYYY-MM-DD` (UTC day) -> "HOY", "AYER" or "12 SEP", relative to `now`'s UTC day. */
export function dayLabel(day: string, now: Date = new Date()): string {
  const [year, month, date] = day.split('-').map(Number);
  const target = Date.UTC(year, month - 1, date);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const diff = Math.round((today - target) / 86_400_000);
  if (diff === 0) return 'HOY';
  if (diff === 1) return 'AYER';
  return `${date} ${MONTHS[month - 1]}`;
}

/** ISO timestamp -> "18:40" in the device's time zone. */
export function timeLabel(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
