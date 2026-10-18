import { screen } from '@ng-native/testing';
import { expect, it } from 'vitest';
import { renderApp } from '../rewards/features/testing.ts';
import { textOf } from '../lists/testing.ts';

it('the list says "1 case" for a release with one case and "N cases" for the others', async () => {
  await renderApp('whats-new');
  await screen.findByTestId('whats-new-heading');
  expect(textOf('whats-new-count-0.16')).toBe('1 case');
  expect(textOf('whats-new-count-0.15')).toBe('10 cases');
});
