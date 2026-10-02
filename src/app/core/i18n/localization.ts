import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import {
  LOCALE_ID,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
  type EnvironmentProviders,
} from '@angular/core';
import { loadTranslations } from '@angular/localize';
import { Locale } from '@ng-native/expo/locale';
import { getItem } from 'expo-secure-store';
import { LANGUAGE_KEY, TRANSLATIONS, chooseLanguage } from './language.ts';

registerLocaleData(localeEs);

/**
 * Picks LOCALE_ID (in-app choice first, then the device's languages in order, then English) and
 * loads its translations synchronously, before the root component renders.
 */
export function provideLocalization(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: LOCALE_ID,
      useFactory: () =>
        chooseLanguage([
          getItem(LANGUAGE_KEY),
          ...inject(Locale)
            .locales()
            .map((locale) => locale.languageCode),
        ]),
    },
    provideAppInitializer(() => {
      const messages = TRANSLATIONS[inject(LOCALE_ID)];
      if (messages) loadTranslations(messages);
    }),
  ]);
}
