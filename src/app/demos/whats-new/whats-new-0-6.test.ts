import { screen, userEvent } from '@ng-native/testing';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../rewards/features/testing.ts';
import { textOf } from '../lists/testing.ts';
import { cases06 } from './core/cases-0-6.ts';
import { RELEASES } from './core/releases.ts';

interface Node {
  viewName: string;
  props: Record<string, unknown>;
  children: Node[];
}

const nodeOf = (id: string) => screen.getByTestId(id) as unknown as Node;

async function openVersion() {
  await renderApp('whats-new/0.6');
  await screen.findByTestId('whats-new-version-heading');
  return userEvent.setup();
}

/**
 * What a Node test can assert is what the engine commits, not what the device draws: there is no
 * layout, no native scroll offset and no native animation here. A6-1's scroll offsets, A6-3's and
 * A6-4's measured sizes, A6-5 on Android and A6-6 through a blocked thread are only on a device.
 */
describe('what is new, 0.6', () => {
  it('is the last release in the list, and its nine cases each have a PR and a badge that matches the data', async () => {
    expect(RELEASES.at(-1)!.version).toBe('0.6');
    await openVersion();
    const cases = cases06();
    expect(cases.map((c) => c.id)).toEqual(Array.from({ length: 9 }, (_, i) => `a6-${i + 1}`));
    for (const item of cases) {
      expect(screen.getByTestId(`whats-new-${item.id}-title`)).toBeTruthy();
      expect(textOf(`whats-new-${item.id}-prs`)).toBe(item.prs.join(' · '));
      expect(textOf(`whats-new-${item.id}-status`)).toBe(
        item.status.kind === 'verified' ? `Verified · ${item.status.platforms.join(' · ')}` : 'Not checked',
      );
    }
  });

  it('A6-1 (#604): display: none leaves no view, the opacity-0 box keeps its own', async () => {
    const user = await openVersion();
    expect(screen.getByTestId('whats-new-a6-1-left')).toBeTruthy();
    expect(screen.getByTestId('whats-new-a6-1-right')).toBeTruthy();
    await user.press(screen.getByTestId('whats-new-a6-1-hide'));
    // `@ng-native/testing` skips a display: none element in every query.
    expect(screen.queryByTestId('whats-new-a6-1-left')).toBeNull();
    await user.press(screen.getByTestId('whats-new-a6-1-hide'));
    expect(screen.getByTestId('whats-new-a6-1-left')).toBeTruthy();
  });

  it('A6-2 (#509): the imported .md is drawn as native text and its link reports the url', async () => {
    const user = await openVersion();
    expect(textOf('whats-new-a6-2-drawn')).toContain('A native post');
    expect(textOf('whats-new-a6-2-readout')).toBe('Link not pressed yet (front matter title: A post)');
    await user.press(screen.getByRole('link'));
    expect(textOf('whats-new-a6-2-readout')).toBe('Link pressed: https://github.com/ng-native/ng-native/releases');
  });

  it('A6-3 and A6-4: the three fields and the bar are drawn, and the bar button flips the class', async () => {
    const user = await openVersion();
    for (const id of ['r1', 'r3', 'r5']) expect(screen.getByTestId(`whats-new-a6-3-${id}`)).toBeTruthy();
    // A flex-basis in a row is committed as the size along it.
    expect(nodeOf('whats-new-a6-4-bar').props['width']).toBe('100%');
    await user.press(screen.getByTestId('whats-new-a6-4-toggle'));
    expect(nodeOf('whats-new-a6-4-bar').props['width']).toBe('60%');
  });

  it('A6-5 (#589): the list is drawn with its header and its footer', async () => {
    await openVersion();
    expect(textOf('whats-new-a6-5-header')).toBe('Header');
    expect(textOf('whats-new-a6-5-footer')).toBe('Footer');
  });

  it('A6-6 (#629, #617): Animate starts the two squares and the label becomes Reset', async () => {
    const user = await openVersion();
    await user.press(screen.getByTestId('whats-new-a6-6-play'));
    expect(textOf('whats-new-a6-6-play')).toBe('Reset');
    await user.press(screen.getByTestId('whats-new-a6-6-play'));
    expect(textOf('whats-new-a6-6-play')).toBe('Animate');
  });

  it('A6-7 (#591, #562): the fallback of each var() is committed where no token is set', async () => {
    await openVersion();
    const drop = nodeOf('whats-new-a6-7-drop').props;
    // 50% 50% 50% 0: the last corner is square, the other three are not.
    expect(drop['borderBottomLeftRadius']).toBe(0);
    expect(drop['borderTopLeftRadius']).not.toBe(0);
    const gap = nodeOf('whats-new-a6-7-gap').props;
    expect([gap['marginTop'], gap['marginRight'], gap['marginBottom'], gap['marginLeft']]).toEqual([0, 24, 0, 24]);
  });

  it('A6-8 (#574): a press on the backdrop counts for the backdrop, and Reset clears both', async () => {
    const user = await openVersion();
    await user.press(screen.getByTestId('whats-new-a6-8-backdrop'));
    expect(textOf('whats-new-a6-8-readout')).toBe('Backdrop heard 1 / button heard 0');
    await user.press(screen.getByTestId('whats-new-a6-8-reset'));
    expect(textOf('whats-new-a6-8-readout')).toBe('Backdrop heard 0 / button heard 0');
  });

  it('A6-9 (#559, #565): the toggle flips the scheme readout and the buttons move the share', async () => {
    const user = await openVersion();
    expect(textOf('whats-new-a6-9-readout')).toBe('Scheme: light, share 40%');
    await user.press(screen.getByTestId('whats-new-a6-9-more'));
    expect(textOf('whats-new-a6-9-readout')).toBe('Scheme: light, share 60%');
    await user.press(screen.getByTestId('whats-new-a6-9-toggle'));
    expect(textOf('whats-new-a6-9-readout')).toBe('Scheme: dark, share 60%');
  });
});
