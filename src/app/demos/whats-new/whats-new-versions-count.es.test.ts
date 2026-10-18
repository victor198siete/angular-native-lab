import { LOCALE_ID } from '@angular/core';
import { loadTranslations } from '@angular/localize';
import { provideNativeRouter } from '@ng-native/router';
import { render, screen } from '@ng-native/testing';
import { beforeAll, expect, it } from 'vitest';
import { TRANSLATIONS } from '../../core/i18n/language.ts';
import { textOf } from '../lists/testing.ts';
import { VersionsScreen } from './features/versions/versions.screen.ts';

// Template messages are cached for the runtime's lifetime, so Spanish gets a test file of its own.
beforeAll(() => {
  loadTranslations(TRANSLATIONS['es']);
});

it('the list says "1 caso" and "N casos" in Spanish', async () => {
  await render(VersionsScreen, { providers: [{ provide: LOCALE_ID, useValue: 'es' }, provideNativeRouter([])] });
  await screen.findByTestId('whats-new-heading');
  expect(textOf('whats-new-count-0.16')).toBe('1 caso');
  expect(textOf('whats-new-count-0.15')).toBe('10 casos');
});
