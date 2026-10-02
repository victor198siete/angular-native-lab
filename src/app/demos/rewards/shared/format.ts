import { formatDate, formatNumber } from '@angular/common';

// Numbers and dates follow LOCALE_ID through Angular's locale data, which does not depend on
// Intl being complete on-device. Callers pass `inject(LOCALE_ID)`; 'en' is the source language.

/** 12480 -> "12,480" in English, "12.480" in Spanish. */
export function formatPoints(value: number, locale = 'en'): string {
  return formatNumber(Math.round(value), locale, '1.0-0');
}

/** 2500 -> "+2,500" / "−2,500" (a real minus sign, not a hyphen). */
export function formatSigned(value: number, sign: '+' | '−', locale = 'en'): string {
  return `${sign}${formatPoints(value, locale)}`;
}

/** Points to an approximate money value, at 1 point = 0.01. 12480 -> "124.80". */
export function pointsToMoney(points: number, locale = 'en'): string {
  return formatNumber(Math.round(points) / 100, locale, '1.2-2');
}

/**
 * `YYYY-MM-DD` (UTC day) -> "TODAY", "YESTERDAY" or "12 SEP", relative to `now`'s UTC day.
 * With `caps: false`, the inline form: "Today", "Yesterday", "12 Sep" ("Hoy", "12 sept").
 */
export function dayLabel(day: string, locale = 'en', now: Date = new Date(), caps = true): string {
  const [year, month, date] = day.split('-').map(Number);
  const target = Date.UTC(year, month - 1, date);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const diff = Math.round((today - target) / 86_400_000);
  if (diff === 0 || diff === 1) {
    const word = diff === 0 ? $localize`:@@day.today:TODAY` : $localize`:@@day.yesterday:YESTERDAY`;
    return caps ? word : word.charAt(0) + word.slice(1).toLowerCase();
  }
  const label = formatDate(target, 'd MMM', locale, 'UTC').replace('.', '');
  return caps ? label.toUpperCase() : label;
}

/** ISO timestamp -> "18:40" in the device's time zone. */
export function timeLabel(iso: string, locale = 'en'): string {
  return formatDate(iso, 'HH:mm', locale);
}
