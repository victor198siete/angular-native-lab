import { LOCALE_ID } from '@angular/core';
import { loadTranslations } from '@angular/localize';
import { provideNativeRouter } from '@ng-native/router';
import { render, screen } from '@ng-native/testing';
import { beforeAll, expect, it } from 'vitest';
import { routes } from '../../app.routes.ts';
import { TRANSLATIONS } from '../../core/i18n/language.ts';
import { DeviceScreen } from './features/device/device.screen.ts';
import { fakeColorScheme, fakeLocation, fakeNetwork, fakeScreen, permissions } from './testing.ts';

// Template messages are cached for the runtime's lifetime, so Spanish gets a test file of its own.
beforeAll(() => {
  loadTranslations(TRANSLATIONS['es']);
});

it('renders the device panel in Spanish', async () => {
  await render(DeviceScreen, {
    providers: [
      { provide: LOCALE_ID, useValue: 'es' },
      fakeColorScheme('dark').provider,
      fakeScreen().provider,
      fakeNetwork().provider,
      fakeLocation({ permission: permissions.granted }).provider,
      provideNativeRouter(routes),
    ],
  });

  expect(await screen.findByText('Tu dispositivo, en vivo')).toBeTruthy();
  expect(screen.getByText('TEMA Y PANTALLA')).toBeTruthy();
  expect(screen.getByText('Oscuro')).toBeTruthy();
  expect(screen.getByText('Vertical')).toBeTruthy();
  expect(screen.getByText('ÁREAS SEGURAS')).toBeTruthy();
  expect(screen.getByText('RED')).toBeTruthy();
  expect(screen.getByText('UBICACIÓN')).toBeTruthy();
  expect(await screen.findByText('Iniciar seguimiento')).toBeTruthy();
});
