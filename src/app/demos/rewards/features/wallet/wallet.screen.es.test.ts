import { loadTranslations } from '@angular/localize';
import { screen } from '@ng-native/testing';
import { beforeAll, expect, it } from 'vitest';
import { TRANSLATIONS } from '../../../../core/i18n/language.ts';
import { MOCK_MEMBER } from '../../core/mocks/index.ts';
import { renderScreen } from '../testing.ts';
import { WalletScreen } from './wallet.screen.ts';

// Template messages are cached for the runtime's lifetime, so Spanish gets a test file of its own.
beforeAll(() => loadTranslations(TRANSLATIONS['es']));

it('renders the Spanish greeting once the es translations are loaded', async () => {
  await renderScreen(WalletScreen);

  expect(screen.getByText(`Hola, ${MOCK_MEMBER.name}`)).toBeTruthy();
});
