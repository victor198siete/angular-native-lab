import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID } from '@angular/core';
import { loadTranslations } from '@angular/localize';
import { provideNativeRouter } from '@ng-native/router';
import { render, screen } from '@ng-native/testing';
import { beforeAll, expect, it } from 'vitest';
import { routes } from '../../../../app.routes.ts';
import { TRANSLATIONS } from '../../../../core/i18n/language.ts';
import { MOCK_MEMBER } from '../../core/mocks/index.ts';
import { ANIMATE_NUMBERS } from '../../shared/animated-number.ts';
import { WalletScreen } from './wallet.screen.ts';

// Template messages are cached for the runtime's lifetime, so Spanish gets a test file of its own.
// The app registers the es locale data in localization.ts; this file does it by hand.
beforeAll(() => {
  registerLocaleData(localeEs);
  loadTranslations(TRANSLATIONS['es']);
});

it('renders the wallet in Spanish, with Spanish number formatting', async () => {
  await render(WalletScreen, {
    providers: [
      { provide: LOCALE_ID, useValue: 'es' },
      { provide: ANIMATE_NUMBERS, useValue: false },
      provideNativeRouter(routes),
    ],
  });

  expect(screen.getByText(`Hola, ${MOCK_MEMBER.name}`)).toBeTruthy();
  expect(screen.getByText('Tus puntos de hoy')).toBeTruthy();
  expect(screen.getByText('Nivel Plata')).toBeTruthy();
  expect(screen.getByText('Te faltan 680 pts para Oro')).toBeTruthy();
  expect(screen.getByText('12.480')).toBeTruthy();
  expect(screen.getByText('Movimientos recientes')).toBeTruthy();
  expect(screen.getByRole('switch', { name: 'Modo oscuro' })).toBeTruthy();
});
