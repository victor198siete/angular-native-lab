/** Languages the mock data is written in. Anything else falls back to English. */
export type MockLanguage = 'en' | 'es';

export type Translated = Readonly<Record<MockLanguage, string>>;

/** 'es', 'es-MX' -> 'es'; everything else -> 'en'. */
export function mockLanguage(localeId: string): MockLanguage {
  return localeId.toLowerCase().startsWith('es') ? 'es' : 'en';
}
