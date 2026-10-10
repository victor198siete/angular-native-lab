import { LOCALE_ID } from '@angular/core';
import { loadTranslations } from '@angular/localize';
import { provideNativeRouter } from '@ng-native/router';
import { render, screen } from '@ng-native/testing';
import { beforeAll, expect, it, vi } from 'vitest';
import { routes } from '../../app.routes.ts';
import { TRANSLATIONS } from '../../core/i18n/language.ts';
import { textOf } from '../lists/testing.ts';
import { GesturesScreen } from './features/gestures/gestures.screen.ts';

vi.mock('@ng-native/components/animations', () => import('./animations-fake.ts'));

// Template messages are cached for the runtime's lifetime, so Spanish gets a test file of its own.
beforeAll(() => {
  loadTranslations(TRANSLATIONS['es']);
});

it('renders the gestures demo in Spanish', async () => {
  await render(GesturesScreen, {
    providers: [{ provide: LOCALE_ID, useValue: 'es' }, provideNativeRouter(routes)],
  });

  expect(await screen.findByText('Gestos y animación')).toBeTruthy();
  expect(textOf('gestures-rows-count')).toBe('Filas restantes: 8 de 8');
  expect(screen.getByText('Hilo de JavaScript')).toBeTruthy();
  expect(screen.getByTestId('gestures-block-js').props.accessibilityLabel).toBe('Bloquear JS 3 s');
  expect(screen.getByTestId('gestures-restore').props.accessibilityLabel).toBe('Restaurar filas');
});
