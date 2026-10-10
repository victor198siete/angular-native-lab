import { screen, userEvent, gestureOf } from '@ng-native/testing';
import { describe, expect, it, vi } from 'vitest';
import { renderApp } from '../rewards/features/testing.ts';
import { textOf } from '../lists/testing.ts';
import { BLOCK_MS } from './features/gestures/animate-compare.ts';
import { DELETE_THRESHOLD } from './features/gestures/swipe-row.ts';

async function open() {
  await renderApp('gestures', [{ provide: BLOCK_MS, useValue: 0 }]);
  await screen.findByTestId('gestures-heading');
  return userEvent.setup();
}

/** What a finger does to a pan, as far as the row's callbacks read it. */
const pan = (id: string, translationX: number) => {
  const gesture = gestureOf(screen.getByTestId(id), 'Pan');
  gesture.callbacks['onUpdate']!({ translationX, translationY: 0 } as never);
  gesture.callbacks['onEnd']!({ translationX, translationY: 0 } as never);
};
const transform = (id: string) => JSON.stringify(screen.getByTestId(id).props['transform']);
/** A worklet style reaches the view on the next change detection, so wait for it. */
const transformIs = (id: string, expected: string) => vi.waitFor(() => expect(transform(id)).toBe(expected));

vi.mock('@ng-native/components/animations', () => import('./animations-fake.ts'));

describe('gestures screen', () => {
  it('opens inside the gesture root with its four sections', async () => {
    await open();
    for (const id of ['gestures-drag-title', 'gestures-pinch-title', 'gestures-swipe-title', 'gestures-anim-title']) {
      expect(screen.getByTestId(id)).toBeTruthy();
    }
  });

  it('drag: the card has a pan, and a release springs it back', async () => {
    await open();
    const gesture = gestureOf(screen.getByTestId('gestures-drag-card'), 'Pan');
    gesture.callbacks['onUpdate']!({ translationX: 40, translationY: -25 } as never);
    await transformIs('gestures-drag-card', '[{"translateX":40},{"translateY":-25}]');
    gesture.callbacks['onEnd']!({} as never);
    // Under the stand-in a spring ends the moment it is assigned, at its target.
    await transformIs('gestures-drag-card', '[{"translateX":0},{"translateY":0}]');
  });

  it('pinch and rotate: scales and turns together, and Reset puts it back', async () => {
    const user = await open();
    const both = gestureOf(screen.getByTestId('gestures-pinch-card'));
    expect(both.kind).toBe('Simultaneous');
    gestureOf(screen.getByTestId('gestures-pinch-card'), 'Pinch').callbacks['onUpdate']!({ scale: 2 } as never);
    gestureOf(screen.getByTestId('gestures-pinch-card'), 'Rotation').callbacks['onUpdate']!({ rotation: 0.5 } as never);
    await transformIs('gestures-pinch-card', '[{"scale":2},{"rotate":"0.5rad"}]');

    await user.press(screen.getByTestId('gestures-pinch-reset'));
    await transformIs('gestures-pinch-card', '[{"scale":1},{"rotate":"0rad"}]');
  });

  it('pinch: a second pinch starts from the scale the first one reached', async () => {
    await open();
    const pinch = gestureOf(screen.getByTestId('gestures-pinch-card'), 'Pinch');
    pinch.callbacks['onUpdate']!({ scale: 2 } as never);
    pinch.callbacks['onEnd']!({} as never);
    pinch.callbacks['onUpdate']!({ scale: 1.5 } as never);
    await transformIs('gestures-pinch-card', '[{"scale":3},{"rotate":"0rad"}]');
  });

  it('swipe: eight rows, each with the pan that keeps the list scrolling', async () => {
    await open();
    expect(textOf('gestures-rows-count')).toBe('Rows left: 8 of 8');
    const pan0 = gestureOf(screen.getByTestId('gestures-row-0'), 'Pan');
    expect(pan0.kind).toBe('Pan');
  });

  it('swipe: a drag past the threshold deletes the row; a short one keeps it', async () => {
    await open();
    pan('gestures-row-1', -(DELETE_THRESHOLD - 20));
    expect(screen.queryByTestId('gestures-row-1')).toBeTruthy();
    pan('gestures-row-1', -(DELETE_THRESHOLD + 20));
    await vi.waitFor(() => expect(screen.queryByTestId('gestures-row-1')).toBeNull());
    expect(textOf('gestures-rows-count')).toBe('Rows left: 7 of 8');
    expect(screen.queryByTestId('gestures-row-2')).toBeTruthy();
  });

  it('swipe: Restore brings every row back, and deleting all shows the empty state', async () => {
    const user = await open();
    for (let id = 0; id < 8; id++) pan(`gestures-row-${id}`, -200);
    await vi.waitFor(() => expect(screen.queryByTestId('gestures-rows-empty')).toBeTruthy());
    expect(textOf('gestures-rows-count')).toBe('Rows left: 0 of 8');
    await user.press(screen.getByTestId('gestures-restore'));
    expect(screen.queryByTestId('gestures-rows-empty')).toBeNull();
    expect(textOf('gestures-rows-count')).toBe('Rows left: 8 of 8');
    expect(screen.getByTestId('gestures-row-7')).toBeTruthy();
  });

  it('animate: four tiles and a Block JS button that reports when it is done', async () => {
    const user = await open();
    for (const id of ['css', 'native', 'worklet', 'js']) expect(screen.getByTestId(`gestures-tile-${id}`)).toBeTruthy();
    expect(screen.getByText('JavaScript thread')).toBeTruthy();
    const block = screen.getByTestId('gestures-block-js');
    expect(block.props.accessibilityLabel).toBe('Block JS for 3 s');
    await user.press(block);
    await vi.waitFor(() => expect(textOf('gestures-block-status')).toBe('JavaScript was blocked. Blocks so far: 1'));
  });
});
