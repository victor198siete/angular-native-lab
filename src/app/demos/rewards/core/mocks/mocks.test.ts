import { describe, expect, it } from 'vitest';
import { mockLanguage, mockSnapshot } from './index.ts';

describe('bilingual mock data', () => {
  const en = mockSnapshot('en');
  const es = mockSnapshot('es');

  it('keeps ids, points, categories, stock and dates identical across languages', () => {
    const shape = (s: typeof en) => ({
      rewards: s.rewards.map(({ id, category, costPoints, stock, icon, partner }) => ({ id, category, costPoints, stock, icon, partner })),
      movements: s.movements.map(({ id, type, points, date }) => ({ id, type, points, date })),
    });
    expect(shape(es)).toEqual(shape(en));
  });

  it('translates every title, description and movement', () => {
    expect(es.rewards.filter((r, i) => r.title === en.rewards[i].title)).toEqual([]);
    expect(es.movements[0].description).toBe('Compra en supermercado');
    expect(en.movements[0].description).toBe('Grocery store purchase');
  });

  it.each([
    ['es', 'es'],
    ['es-MX', 'es'],
    ['en-US', 'en'],
    ['fr', 'en'],
  ])('maps LOCALE_ID %s to %s data', (localeId, expected) => {
    expect(mockLanguage(localeId)).toBe(expected);
  });
});
