import { screen, userEvent } from '@ng-native/testing';
import { expect, it } from 'vitest';
import { MOCK_MEMBER } from '../../core/mocks/index.ts';
import { renderScreen } from '../testing.ts';
import { WalletScreen } from './wallet.screen.ts';

it('shows the 12,480 balance, the tier and the progress to the next one', async () => {
  await renderScreen(WalletScreen);

  expect(screen.getByTestId('hero-balance')).toBeTruthy();
  expect(screen.getByText('12,480')).toBeTruthy();
  expect(screen.getByText('Silver tier')).toBeTruthy();
  // 14,320 lifetime points: Silver (5,000), 680 short of Gold (15,000).
  expect(screen.getByText('680 pts to Gold')).toBeTruthy();
  expect(screen.getByText(`Hi, ${MOCK_MEMBER.name}`)).toBeTruthy();
});

it('lists the 5 most recent movements', async () => {
  await renderScreen(WalletScreen);

  expect(screen.getByText('Grocery store purchase')).toBeTruthy();
  expect(screen.getByText('Dinner at a restaurant')).toBeTruthy();
  expect(screen.queryByText('Streaming subscription')).toBeNull();
});

it('counts the balance up from zero when animations are on', async () => {
  await renderScreen(WalletScreen, { animate: true });

  expect(screen.queryByText('12,480')).toBeNull();
  expect(await screen.findByText('12,480', {}, { timeout: 3000 })).toBeTruthy();
});

it('has an accessible theme toggle', async () => {
  await renderScreen(WalletScreen);
  const toggle = screen.getByRole('switch', { name: 'Dark mode' });

  await userEvent.setup().press(toggle);

  expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeTruthy();
});
