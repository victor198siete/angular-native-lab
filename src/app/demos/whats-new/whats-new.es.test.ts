import { LOCALE_ID } from '@angular/core';
import { loadTranslations } from '@angular/localize';
import { provideNativeRouter } from '@ng-native/router';
import { render, screen } from '@ng-native/testing';
import { withComponentInputBinding } from '@angular/router';
import { beforeAll, expect, it } from 'vitest';
import { routes } from '../../app.routes.ts';
import { TRANSLATIONS } from '../../core/i18n/language.ts';
import { textOf } from '../lists/testing.ts';
import { VersionScreen } from './features/version/version.screen.ts';

// Template messages are cached for the runtime's lifetime, so Spanish gets a test file of its own.
beforeAll(() => {
  loadTranslations(TRANSLATIONS['es']);
});

it('renders the 0.10 cases in Spanish', async () => {
  await render(VersionScreen, {
    inputs: { version: '0.10' },
    providers: [{ provide: LOCALE_ID, useValue: 'es' }, provideNativeRouter(routes, withComponentInputBinding())],
  });

  expect(await screen.findByText('Borde sin color')).toBeTruthy();
  expect(textOf('whats-new-a10-1-status')).toBe('Verificado · iOS');
  expect(textOf('whats-new-a10-1-result')).toBe('Aún sin preguntar');
  expect(screen.getByTestId('whats-new-a10-1-open').props.accessibilityLabel).toBe('Abrir la hoja');
});
