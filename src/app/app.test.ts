import { render, screen, userEvent } from '@ng-native/testing';
import { expect, test } from 'vitest';
import { App } from './app.ts';

test('counts taps', async () => {
  await render(App);

  await userEvent.setup().press(screen.getByRole('button', { name: 'Tapped 0 times' }));

  expect(screen.getByText('Tapped 1 times')).toBeTruthy();
});
