import { screen, userEvent } from '@ng-native/testing';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../rewards/features/testing.ts';
import { textOf } from './testing.ts';

const mounted = () => (screen.getByTestId('lists-mounted') as unknown as { props?: unknown }) && textOf('lists-mounted');
/** The first number of "21 of 2,000 mounted". */
const live = (): number => Number(/^([\d,.]+) of/.exec(textOf('lists-mounted'))![1].replace(/[,.]/g, ''));

async function open() {
  const view = await renderApp('lists');
  await screen.findByTestId('lists-heading');
  return { view, user: userEvent.setup() };
}

describe('lists screen', () => {
  it('starts on a virtual-list of 200 rows, with only a window mounted', async () => {
    await open();
    expect(screen.getByTestId('lists-virtual')).toBeTruthy();
    expect(textOf('lists-mounted')).toMatch(/ of 200 mounted$/);
    expect(live()).toBeGreaterThan(0);
    expect(live()).toBeLessThan(200);
  });

  it('marks the chosen toggles as selected', async () => {
    const { user } = await open();
    expect(screen.getByTestId('lists-size-200').props.accessibilityState).toEqual({ selected: true });
    await user.press(screen.getByTestId('lists-size-2000'));
    expect(screen.getByTestId('lists-size-200').props.accessibilityState).toEqual({ selected: false });
    expect(screen.getByTestId('lists-size-2000').props.accessibilityState).toEqual({ selected: true });
  });

  it('switching size updates the total', async () => {
    const { user } = await open();
    await user.press(screen.getByTestId('lists-size-2000'));
    expect(textOf('lists-mounted')).toMatch(/ of 2,000 mounted$/);
    // A new size is a new list: the built count is that list's own, as small as its window.
    expect(textOf('lists-views')).toBe(`Row views built: ${live()}, recycled as you scroll`);
  });

  it('scroll-view mounts every row; virtual-list mounts far fewer at the same size', async () => {
    const { user } = await open();
    await user.press(screen.getByTestId('lists-size-2000'));
    const virtual = live();
    await user.press(screen.getByTestId('lists-renderer-scroll'));
    expect(screen.getByTestId('lists-scroll')).toBeTruthy();
    expect(textOf('lists-mounted')).toBe('2,000 of 2,000 mounted');
    expect(virtual).toBeLessThan(100);
    expect(live()).toBeGreaterThan(virtual * 10);
  });

  it('switching renderer unmounts the old rows, leaving no leak', { timeout: 30_000 }, async () => {
    const { user } = await open();
    await user.press(screen.getByTestId('lists-size-2000'));
    await user.press(screen.getByTestId('lists-renderer-scroll'));
    expect(live()).toBe(2000);
    await user.press(screen.getByTestId('lists-renderer-virtual'));
    expect(live()).toBeLessThan(100);
    await user.press(screen.getByTestId('lists-size-200'));
    await user.press(screen.getByTestId('lists-renderer-scroll'));
    expect(textOf('lists-mounted')).toBe('200 of 200 mounted');
    expect(textOf('lists-views')).toBe('Row views built: 200, one per row');
  });
});
