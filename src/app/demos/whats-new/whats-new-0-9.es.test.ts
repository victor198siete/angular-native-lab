import { LOCALE_ID } from '@angular/core';
import { loadTranslations } from '@angular/localize';
import { withComponentInputBinding } from '@angular/router';
import { provideNativeRouter } from '@ng-native/router';
import { render, screen, userEvent } from '@ng-native/testing';
import { beforeAll, expect, it } from 'vitest';
import { routes } from '../../app.routes.ts';
import { TRANSLATIONS } from '../../core/i18n/language.ts';
import { textOf } from '../lists/testing.ts';
import { VersionScreen } from './features/version/version.screen.ts';

// Template messages are cached for the runtime's lifetime, so Spanish gets a test file of its own.
beforeAll(() => {
  loadTranslations(TRANSLATIONS['es']);
});

it('A9-1 in Spanish: the plural and the select take their Spanish cases, and the label is translated', async () => {
  await render(VersionScreen, {
    inputs: { version: '0.9' },
    providers: [{ provide: LOCALE_ID, useValue: 'es' }, provideNativeRouter(routes, withComponentInputBinding())],
  });
  const user = userEvent.setup();
  await user.press(await screen.findByTestId('whats-new-a9-1-show'));
  expect(await screen.findByTestId('whats-new-a9-1-count')).toBeTruthy();

  expect(textOf('whats-new-a9-1-count')).toBe('Sin recompensas');
  expect(screen.getByTestId('whats-new-a9-1-count').props.accessibilityLabel).toBe('Recompensas en la cesta');
  await user.press(screen.getByTestId('whats-new-a9-1-plus'));
  expect(textOf('whats-new-a9-1-count')).toBe('1 recompensa');
  for (let i = 0; i < 4; i++) await user.press(screen.getByTestId('whats-new-a9-1-plus'));
  expect(textOf('whats-new-a9-1-count')).toBe('5 recompensas');

  expect(textOf('whats-new-a9-1-tier')).toBe('Miembro oro');
  await user.press(screen.getByTestId('whats-new-a9-1-tier-next'));
  expect(textOf('whats-new-a9-1-tier')).toBe('Miembro plata');
});
