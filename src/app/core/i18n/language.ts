import es from '../../../locale/messages.es.json';

/** The language the source text is written in. There is nothing to load for it. */
export const SOURCE_LANGUAGE = 'en';

/** Key in secure storage for the in-app language choice; read synchronously before the first frame. */
export const LANGUAGE_KEY = 'language';

/** Translations bundled with the app, by language code. Imported, so Metro bundles them. */
export const TRANSLATIONS: Record<string, Record<string, string>> = {
  es: es.translations,
};

/** The first language in the list that this app has, or the source language. */
export function chooseLanguage(preferred: readonly (string | null | undefined)[]): string {
  return (
    preferred.find(
      (code): code is string => code === SOURCE_LANGUAGE || (code != null && code in TRANSLATIONS),
    ) ?? SOURCE_LANGUAGE
  );
}
