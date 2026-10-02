import { screen, userEvent } from '@ng-native/testing';
import { expect, it } from 'vitest';
import { MOCK_REWARDS } from '../../core/mocks/index.ts';
import { renderApp, renderScreen } from '../testing.ts';
import { CatalogScreen } from './catalog.screen.ts';

it('lists reward rows and the total count', async () => {
  await renderScreen(CatalogScreen);

  expect(screen.getByText('200 rewards')).toBeTruthy();
  expect(screen.getByText(MOCK_REWARDS[0].title)).toBeTruthy();
  expect(screen.getAllByRole('button', { name: /points/ }).length).toBeGreaterThan(3);
});

it('changes the count when a category chip is pressed, and clears it with All', async () => {
  const user = userEvent.setup();
  await renderScreen(CatalogScreen);
  const viajes = MOCK_REWARDS.filter((r) => r.category === 'Viajes').length;

  await user.press(screen.getByRole('button', { name: 'Filter by Travel' }));
  expect(await screen.findByText(`${viajes} rewards`)).toBeTruthy();
  expect(screen.queryByText('200 rewards')).toBeNull();

  await user.press(screen.getByRole('button', { name: 'Show all categories' }));
  expect(await screen.findByText('200 rewards')).toBeTruthy();
});

it('opens the detail screen when a row is pressed', async () => {
  const user = userEvent.setup();
  await renderApp('catalog');
  const first = MOCK_REWARDS[0];

  await user.press(await screen.findByText(first.title));

  expect(await screen.findByTestId('detail-title')).toBeTruthy();
  expect(screen.getByText(first.description)).toBeTruthy();
});
