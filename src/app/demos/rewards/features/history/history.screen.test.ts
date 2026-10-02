import { screen } from '@ng-native/testing';
import { expect, it } from 'vitest';
import { renderScreen } from '../testing.ts';
import { HistoryScreen } from './history.screen.ts';

it('groups movements under date headers, with signs on the amounts', async () => {
  await renderScreen(HistoryScreen);

  expect(screen.getByText('History')).toBeTruthy();
  expect(screen.getAllByRole('header').length).toBeGreaterThan(0);
  expect(screen.getByText('+420')).toBeTruthy();
});

it('shows redeems with a real minus sign', async () => {
  await renderScreen(HistoryScreen);

  expect(screen.getByText('−1,500')).toBeTruthy();
});
