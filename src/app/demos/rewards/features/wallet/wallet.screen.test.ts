import { screen, userEvent } from '@ng-native/testing';
import { expect, it } from 'vitest';
import { MOCK_MEMBER } from '../../core/mocks/index.ts';
import { renderScreen } from '../testing.ts';
import { WalletScreen } from './wallet.screen.ts';

it('shows the 12,480 balance, the tier and the progress to the next one', async () => {
  await renderScreen(WalletScreen);

  expect(screen.getByTestId('hero-balance')).toBeTruthy();
  expect(screen.getByText('12,480')).toBeTruthy();
  expect(screen.getByText('Nivel Plata')).toBeTruthy();
  // 14,320 lifetime points: Plata (5,000), 680 short of Oro (15,000).
  expect(screen.getByText('Te faltan 680 pts para Oro')).toBeTruthy();
  expect(screen.getByText(`Hola, ${MOCK_MEMBER.name}`)).toBeTruthy();
});

it('lists the 5 most recent movements', async () => {
  await renderScreen(WalletScreen);

  expect(screen.getByText('Compra en supermercado')).toBeTruthy();
  expect(screen.getByText('Cena en restaurante')).toBeTruthy();
  expect(screen.queryByText('Suscripción de streaming')).toBeNull();
});

it('counts the balance up from zero when animations are on', async () => {
  await renderScreen(WalletScreen, { animate: true });

  expect(screen.queryByText('12,480')).toBeNull();
  expect(await screen.findByText('12,480', {}, { timeout: 3000 })).toBeTruthy();
});

it('has an accessible theme toggle', async () => {
  await renderScreen(WalletScreen);
  const toggle = screen.getByRole('switch', { name: 'Modo oscuro' });

  await userEvent.setup().press(toggle);

  expect(screen.getByRole('switch', { name: 'Modo oscuro' })).toBeTruthy();
});
