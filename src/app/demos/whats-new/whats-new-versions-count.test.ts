import { screen } from '@ng-native/testing';
import { expect, it } from 'vitest';
import { renderApp } from '../rewards/features/testing.ts';
import { textOf } from '../lists/testing.ts';

it('the list says "1 case" for a release with one case and "N cases" for the others', async () => {
  await renderApp('whats-new');
  await screen.findByTestId('whats-new-heading');
  expect(textOf('whats-new-count-0.22')).toBe('3 cases');
  expect(textOf('whats-new-count-0.21')).toBe('2 cases');
  expect(textOf('whats-new-count-0.20')).toBe('5 cases');
  expect(textOf('whats-new-count-0.16')).toBe('1 case');
  expect(textOf('whats-new-count-0.15')).toBe('10 cases');
});
