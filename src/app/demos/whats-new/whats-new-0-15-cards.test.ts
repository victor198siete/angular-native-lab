import { screen, userEvent } from '@ng-native/testing';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../rewards/features/testing.ts';
import { textOf } from '../lists/testing.ts';

/** The three cards 0.15.0 made out of date: what each says now is what was measured on the devices. */
describe('cards updated for 0.15', () => {
  const open = async (version: string) => {
    await renderApp(`whats-new/${version}`);
    await screen.findByTestId('whats-new-version-heading');
  };

  it('A9-1 (#882, #885): the ICU sample is verified on both platforms and no longer carries the assertion text', async () => {
    await open('0.9');
    expect(textOf('whats-new-a9-1-status')).toBe('Verified · iOS · Android');
    expect(screen.queryByText(/ASSERTION ERROR/)).toBeNull();
    await userEvent.setup().press(screen.getByTestId('whats-new-a9-1-show'));
    expect(textOf('whats-new-a9-1-count')).toBe('No rewards');
  });

  it('A8-2 (#883, #902): a caveat that says Android eases a lone size and iOS still jumps', async () => {
    await open('0.8');
    expect(textOf('whats-new-a8-2-status')).toBe('Caveat');
    expect(screen.getByText(/fixed on Android only: Android eases it.*iOS still jumps/)).toBeTruthy();
  });

  it('A14-2 (#846, #902): a caveat that says width eases on Android and not on iOS', async () => {
    await open('0.14');
    expect(textOf('whats-new-a14-2-status')).toBe('Caveat');
    expect(screen.getByText(/Android eases it, linearly over about 6 s.*iOS does not/)).toBeTruthy();
  });
});
