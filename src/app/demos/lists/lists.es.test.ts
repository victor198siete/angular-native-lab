import { LOCALE_ID } from '@angular/core';
import { loadTranslations } from '@angular/localize';
import { provideNativeRouter } from '@ng-native/router';
import { render, screen } from '@ng-native/testing';
import { beforeAll, expect, it } from 'vitest';
import { routes } from '../../app.routes.ts';
import { TRANSLATIONS } from '../../core/i18n/language.ts';

import { textOf } from './testing.ts';
import { ListsScreen } from './features/lists/lists.screen.ts';

// Template messages are cached for the runtime's lifetime, so Spanish gets a test file of its own.
beforeAll(() => {
  loadTranslations(TRANSLATIONS['es']);
});

it('renders the lists demo in Spanish', async () => {
  await render(ListsScreen, {
    providers: [{ provide: LOCALE_ID, useValue: 'es' }, provideNativeRouter(routes)],
  });

  expect(await screen.findByText('Listas largas, de dos formas')).toBeTruthy();
  expect(textOf('lists-mounted')).toMatch(/ de 200 montadas$/);
  expect(screen.getByText(/Vistas de fila creadas: [0-9.,]+, recicladas/)).toBeTruthy();
  expect(screen.getAllByText('Hizo check-in en recepción').length).toBeGreaterThan(0); // the mock rows are in Spanish too
});
