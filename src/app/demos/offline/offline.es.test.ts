import { LOCALE_ID } from '@angular/core';
import { loadTranslations } from '@angular/localize';
import { screen } from '@ng-native/testing';
import { beforeAll, expect, it } from 'vitest';
import { TRANSLATIONS } from '../../core/i18n/language.ts';
import { renderApp } from '../rewards/features/testing.ts';
import { textOf } from '../lists/testing.ts';
import { fakeDialogs, fakeNetwork, fastConfig, NO_NETWORK, steppingClock, useMemoryDatabase } from './testing.ts';

useMemoryDatabase();

// Template messages are cached for the runtime's lifetime, so Spanish gets a test file of its own.
beforeAll(() => {
  loadTranslations(TRANSLATIONS['es']);
});

it('renders the offline demo in Spanish', async () => {
  await renderApp('offline', [
    { provide: LOCALE_ID, useValue: 'es' },
    fakeNetwork(NO_NETWORK).provider,
    fakeDialogs().provider,
    steppingClock().provider,
    fastConfig(),
  ]);

  expect(await screen.findByText('Funciona sin conexión')).toBeTruthy();
  expect(textOf('offline-state')).toBe('Sin conexión');
  expect(textOf('offline-pending')).toBe('Pendientes: 0');
  expect(textOf('offline-synced')).toMatch(/^Aún no hay nada guardado/);
  expect(screen.getByText('Simular sin conexión')).toBeTruthy();
});
