import { screen } from '@ng-native/testing';
import { expect, it } from 'vitest';
import { MOCK_REWARDS } from '../core/mocks/index.ts';
import { renderApp } from './testing.ts';

it('opens on the wallet tab of the real route config', async () => {
  await renderApp();

  expect(await screen.findByText('Recent activity')).toBeTruthy();
});

it('binds the :id param to the reward detail screen', async () => {
  const target = MOCK_REWARDS[0];
  await renderApp(`reward/${target.id}`);

  expect(await screen.findByText(target.title)).toBeTruthy();
});
