import { describe, expect, it } from 'vitest';
import '../../../core/i18n/language.ts';
import { dayLabel, formatPoints, pointsToMoney } from './format.ts';

const now = new Date('2026-09-30T12:00:00Z');

describe('format', () => {
  it.each([
    ['en', '12,480', '124.80'],
    ['es', '12.480', '124,80'],
  ])('formats points and money in %s', (locale, points, money) => {
    expect(formatPoints(12_480, locale)).toBe(points);
    expect(pointsToMoney(12_480, locale)).toBe(money);
  });

  // "Today" comes from the loaded translations (English here); the date from the locale data.
  it('labels today and yesterday as a header and inline', () => {
    expect(dayLabel('2026-09-30', 'en', now)).toBe('TODAY');
    expect(dayLabel('2026-09-30', 'en', now, false)).toBe('Today');
    expect(dayLabel('2026-09-29', 'en', now, false)).toBe('Yesterday');
  });

  it.each([
    ['en', '28 SEP', '28 Sep'],
    ['es', '28 SEPT', '28 sept'],
  ])('labels older days in %s', (locale, caps, inline) => {
    expect(dayLabel('2026-09-28', locale, now)).toBe(caps);
    expect(dayLabel('2026-09-28', locale, now, false)).toBe(inline);
  });
});
