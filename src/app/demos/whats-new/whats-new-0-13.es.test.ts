import { LOCALE_ID } from '@angular/core';
import { loadTranslations } from '@angular/localize';
import { provideNativeRouter } from '@ng-native/router';
import { render, screen, userEvent } from '@ng-native/testing';
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

it('renders the 0.13 cases in Spanish, with their readouts and badges', async () => {
  await render(VersionScreen, {
    inputs: { version: '0.13' },
    providers: [{ provide: LOCALE_ID, useValue: 'es' }, provideNativeRouter(routes, withComponentInputBinding())],
  });

  expect(await screen.findByText('Iconos con mask, clipPath y use')).toBeTruthy();
  expect(textOf('whats-new-a13-1-status')).toBe('Verificado · iOS · Android');
  expect(textOf('whats-new-a13-8-status')).toBe('Verificado · Android');
  expect(textOf('whats-new-a13-3-readout')).toBe('Dibujados: 0 / 0 puntos');
  expect(textOf('whats-new-a13-4-readout')).toBe('Cargador consultado 0 veces: -');
  const user = userEvent.setup();
  await user.press(screen.getByTestId('whats-new-a13-2-next'));
  expect(textOf('whats-new-a13-2-readout')).toBe('--accent es #0369a1');
});
