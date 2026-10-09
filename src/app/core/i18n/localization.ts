import {
  LOCALE_ID,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
  type EnvironmentProviders,
} from '@angular/core';
import { loadTranslations } from '@angular/localize';
import { Locale } from '@ng-native/expo/locale';
import { reloadAppAsync } from 'expo';
import { getItem, setItemAsync } from 'expo-secure-store';
import { DevSettings } from 'react-native';
import { LANGUAGE_RESTART, reloadWithFallback } from './language-switcher.ts';
import { LANGUAGE_KEY, TRANSLATIONS, chooseLanguage } from './language.ts';

/**
 * Picks LOCALE_ID (in-app choice first, then the device's languages in order, then English) and
 * loads its translations synchronously, before the root component renders. Also provides the
 * native half of LanguageSwitcher: store the choice, then restart the JavaScript (through Expo, and
 * through React Native where Expo's reload does nothing: Expo Go on Android).
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
    {
      provide: LANGUAGE_RESTART,
      useValue: {
        save: (code: string) => setItemAsync(LANGUAGE_KEY, code),
        reload: (reason: string) => reloadWithFallback(reloadAppAsync, (why) => DevSettings.reload(why), reason),
      },
    },
    provideAppInitializer(() => {
      const messages = TRANSLATIONS[inject(LOCALE_ID)];
      if (messages) loadTranslations(messages);
    }),
  ]);
}
