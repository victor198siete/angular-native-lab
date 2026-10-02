import { screen, userEvent } from '@ng-native/testing';
import { expect, it } from 'vitest';
import { MOCK_MEMBER, MOCK_REWARDS, MOCK_SNAPSHOT } from '../../core/mocks/index.ts';
import { REWARDS_SOURCE } from '../../core/rewards.source.ts';
import { RewardsStore } from '../../core/rewards.store.ts';
import { formatPoints } from '../../shared/format.ts';
import { renderApp } from '../testing.ts';

const affordable = MOCK_REWARDS.find((r) => r.costPoints <= MOCK_MEMBER.points && (r.stock ?? 1) > 0)!;
const expensive = MOCK_REWARDS.find((r) => r.costPoints > MOCK_MEMBER.points)!;

it('redeems: confirms in the sheet, lowers the balance and records a movement', async () => {
  const user = userEvent.setup();
  const app = await renderApp(`reward/${affordable.id}`);
  const store = app.componentRef.injector.get(RewardsStore);
  const before = store.movements().length;

  await user.press(await screen.findByTestId('redeem-button'));
  await user.press(await screen.findByTestId('confirm-redeem'));

  expect(await screen.findByText('¡Canjeado!', {}, { timeout: 3000 })).toBeTruthy();
  const expected = MOCK_MEMBER.points - affordable.costPoints;
  expect(store.member().points).toBe(expected);
  expect(store.member().lifetimePoints).toBe(MOCK_MEMBER.lifetimePoints);
  expect(store.movements()).toHaveLength(before + 1);
  expect(store.movements()[0]).toMatchObject({ type: 'redeem', points: affordable.costPoints });
  expect(screen.getByTestId('success-balance')).toBeTruthy();
  expect(screen.getByText(formatPoints(expected))).toBeTruthy();
  expect(screen.getByText(`−${formatPoints(affordable.costPoints)}`)).toBeTruthy();
  expect(screen.getByTestId('voucher-code')).toBeTruthy();
});

it('cancelling the sheet redeems nothing', async () => {
  const user = userEvent.setup();
  const app = await renderApp(`reward/${affordable.id}`);
  const store = app.componentRef.injector.get(RewardsStore);

  await user.press(await screen.findByTestId('redeem-button'));
  await user.press(await screen.findByRole('button', { name: 'Cancelar' }));

  expect(store.member().points).toBe(MOCK_MEMBER.points);
  expect(screen.queryByText('¡Canjeado!')).toBeNull();
});

it('an unaffordable reward disables the button and says how many points are missing', async () => {
  const user = userEvent.setup();
  const app = await renderApp(`reward/${expensive.id}`);
  const store = app.componentRef.injector.get(RewardsStore);
  const missing = expensive.costPoints - MOCK_MEMBER.points;

  const button = await screen.findByTestId('redeem-button');
  expect(button.props['accessibilityState']).toMatchObject({ disabled: true });
  expect(screen.getByTestId('detail-missing')).toBeTruthy();
  expect(screen.getAllByText(`Te faltan ${formatPoints(missing)} pts`)).toHaveLength(2);
  expect(screen.getByRole('button', { name: /Canjear no disponible/ })).toBeTruthy();

  await user.press(button);
  expect(screen.queryByText('¿Canjear esta recompensa?')).toBeNull();
  expect(store.member().points).toBe(MOCK_MEMBER.points);
});

it('an out-of-stock reward is not redeemable', async () => {
  const soldOut = { ...affordable, id: 'sold-out', stock: 0 };
  await renderApp('reward/sold-out', [
    { provide: REWARDS_SOURCE, useValue: { ...MOCK_SNAPSHOT, rewards: [soldOut] } },
  ]);

  const button = await screen.findByTestId('redeem-button');
  expect(button.props['accessibilityState']).toMatchObject({ disabled: true });
  expect(screen.getAllByText('Agotado').length).toBeGreaterThan(0);
  expect(screen.getByRole('button', { name: 'Canjear no disponible, agotado' })).toBeTruthy();
});

it('shows a not-found state for an unknown id', async () => {
  await renderApp('reward/nope');

  expect(await screen.findByText('Premio no encontrado')).toBeTruthy();
});
