import { NavigationBar, type NavigationBarSource } from '@ng-native/device';
import { fireEvent, screen, userEvent, waitFor } from '@ng-native/testing';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../rewards/features/testing.ts';
import { textOf } from '../lists/testing.ts';
import { cases015 } from './core/cases-0-15.ts';
import { RELEASES } from './core/releases.ts';
import type { Case } from './core/case.ts';

interface Node {
  viewName: string;
  props: Record<string, unknown>;
  children: Node[];
}

const nodeOf = (id: string) => screen.getByTestId(id) as unknown as Node;

async function openVersion(extra: Parameters<typeof renderApp>[1] = []) {
  await renderApp('whats-new/0.15', extra);
  await screen.findByTestId('whats-new-version-heading');
  return userEvent.setup();
}

const badgeOf = (item: Case) => {
  switch (item.status.kind) {
    case 'verified':
      return `Verified · ${item.status.platforms.join(' · ')}`;
    case 'caveat':
      return 'Caveat';
    case 'not-as-described':
      return 'Not as described';
    case 'not-checked':
      return 'Not checked';
  }
};

/**
 * What a Node test can assert is what the engine commits, not what the device draws (there is no
 * layout here and no frames). The fades of A15-9, the sideways swipe of A15-3 and the bar of A15-6 are only on a device.
 * A15-7 and A15-8 also pass on 0.14.0 in Node; the device is what tells them apart.
 */
describe('what is new, 0.15', () => {
  it('is in the list of releases, and its ten cases each have a PR and a badge that matches the data', async () => {
    expect(RELEASES.map((release) => release.version)).toContain('0.15');
    await openVersion();
    const cases = cases015();
    expect(cases.map((c) => c.id)).toEqual(Array.from({ length: 10 }, (_, i) => `a15-${i + 1}`));
    for (const item of cases) {
      expect(screen.getByTestId(`whats-new-${item.id}-title`)).toBeTruthy();
      expect(textOf(`whats-new-${item.id}-prs`)).toBe(item.prs.join(' · '));
      expect(textOf(`whats-new-${item.id}-status`)).toBe(badgeOf(item));
    }
  });

  it('A15-1 (#866): color-mix and relative colours made of --brand are worked out, and follow the token', async () => {
    const user = await openVersion();
    const colors = () => ['base', 'mix', 'relative', 'clamp'].map((id) => nodeOf(`whats-new-a15-1-${id}`).props['backgroundColor']);
    // On 0.14.0 the last three were the text of the expression.
    expect(colors()).toEqual(['#0369a1', 'rgb(53, 135, 180)', 'rgb(3, 105, 161)', 'rgb(153, 105, 161)']);
    await user.press(screen.getByTestId('whats-new-a15-1-next'));
    expect(textOf('whats-new-a15-1-readout')).toBe('--brand is #be123c');
    expect(colors()).toEqual(['#be123c', 'rgb(203, 65, 99)', 'rgb(190, 18, 60)', 'rgb(190, 18, 60)']);
  });

  it('A15-2 (#903): keyPress, scroll and contentSizeChange on a multiline field are counted', async () => {
    await openVersion();
    const field = screen.getByTestId('whats-new-a15-2-field');
    expect(textOf('whats-new-a15-2-readout')).toBe('Keys 0 (last -) / scrolls 0 / content size changes 0');
    await fireEvent(field, 'keyPress', { nativeEvent: { key: 'a' } });
    await fireEvent(field, 'scroll', { nativeEvent: { contentOffset: { x: 0, y: 12 } } });
    await fireEvent(field, 'contentSizeChange', { nativeEvent: { contentSize: { width: 200, height: 160 } } });
    expect(textOf('whats-new-a15-2-readout')).toBe('Keys 1 (last a) / scrolls 1 / content size changes 1');
    // #901: the field is sized by a bound rows, and rows is not sent to native.
    expect(nodeOf('whats-new-a15-2-field').props['rows']).toBeUndefined();
  });

  it('A15-3 (#865): a markdown table is a horizontal scroll view whose columns cap at 280 points', async () => {
    await openVersion();
    const table = nodeOf('whats-new-a15-3-drawn').children[0]!.children[0]!;
    expect(table.viewName).toBe('ScrollView');
    expect(table.props['horizontal']).toBe(true);
    const widest = JSON.stringify(table).match(/"maxWidth":(\d+)/g);
    expect(new Set(widest)).toEqual(new Set(['"maxWidth":280']));
  });

  it('A15-4 (#867): while streaming the open code span is held back; finishing draws the source as written', async () => {
    const user = await openVersion();
    await user.press(screen.getByTestId('whats-new-a15-4-next'));
    await user.press(screen.getByTestId('whats-new-a15-4-next'));
    expect(textOf('whats-new-a15-4-raw')).toBe('# Weekly digest\n\nThe `redeem');
    expect(textOf('whats-new-a15-4-readout')).toBe('Streaming: chunk 2 of 6');
    expect(textOf('whats-new-a15-4-drawn')).not.toContain('`');
    expect(textOf('whats-new-a15-4-drawn')).toContain('The');
    await user.press(screen.getByTestId('whats-new-a15-4-finish'));
    expect(textOf('whats-new-a15-4-readout')).toBe('Finished: chunk 2 of 6, drawn as written');
    expect(textOf('whats-new-a15-4-drawn')).toContain('`redeem');
  });

  it('A15-5 (#905): a base64 PNG is an image, an SVG data url is its alt text', async () => {
    await openVersion();
    const drawn = nodeOf('whats-new-a15-5-drawn').children[0]!;
    const image = drawn.children[0]!;
    expect(image.viewName).toBe('Image');
    expect((image.props['source'] as { uri: string }[])[0]!.uri.startsWith('data:image/png;base64,')).toBe(true);
    expect(textOf('whats-new-a15-5-drawn')).toBe('vector logo');
  });

  it('A15-6 (#907): the buttons claim the bar through NavigationBar and the readout follows', async () => {
    const calls: string[] = [];
    const source: NavigationBarSource = {
      setStyle: (style) => calls.push(`style:${style}`),
      setHidden: (hidden) => calls.push(`hidden:${hidden}`),
    };
    const user = await openVersion([{ provide: NavigationBar.SOURCE, useValue: source }]);
    expect(textOf('whats-new-a15-6-readout')).toBe('Bar claims: style - / hidden no');
    await user.press(screen.getByTestId('whats-new-a15-6-hidden'));
    await user.press(screen.getByTestId('whats-new-a15-6-style'));
    expect(textOf('whats-new-a15-6-readout')).toBe('Bar claims: style dark / hidden yes');
    expect(calls).toContain('hidden:true');
    expect(calls).toContain('style:dark');
    await user.press(screen.getByTestId('whats-new-a15-6-hidden'));
    expect(textOf('whats-new-a15-6-readout')).toBe('Bar claims: style dark / hidden no');
  });

  it('A15-7 (#863): .card:has(.x:is(.p *, .y)) matches a card with only one alternative', async () => {
    await openVersion();
    const green = 'rgb(134, 239, 172)';
    expect(nodeOf('whats-new-a15-7-a').props['backgroundColor']).toBe(green);
    expect(nodeOf('whats-new-a15-7-b').props['backgroundColor']).toBe(green);
    expect(nodeOf('whats-new-a15-7-c').props['backgroundColor']).toBe('rgb(229, 231, 235)');
  });

  it('A15-8 (#880): :host:has(.on) follows a class added beneath the host, and removed again', async () => {
    const user = await openVersion();
    expect(nodeOf('whats-new-a15-8-host').props['backgroundColor']).toBe('rgb(229, 231, 235)');
    await user.press(screen.getByTestId('whats-new-a15-8-toggle'));
    expect(nodeOf('whats-new-a15-8-host').props['backgroundColor']).toBe('rgb(252, 211, 77)');
    await user.press(screen.getByTestId('whats-new-a15-8-toggle'));
    expect(nodeOf('whats-new-a15-8-host').props['backgroundColor']).toBe('rgb(229, 231, 235)');
  });

  it('A15-9 (#876): the box that adds its class at once is opaque when mounted; the one that adds it later starts clear', async () => {
    const user = await openVersion();
    await user.press(screen.getByTestId('whats-new-a15-9-early-button'));
    await waitFor(() => expect(nodeOf('whats-new-a15-9-early').props['opacity']).toBe(1));
    await user.press(screen.getByTestId('whats-new-a15-9-late-button'));
    await waitFor(() => expect(nodeOf('whats-new-a15-9-late').props['opacity']).toBe(0));
    // Drawn first, then given the class: this one eases (the 3 s fade has not reached 1 yet when it starts moving).
    await waitFor(() => expect(nodeOf('whats-new-a15-9-late').props['opacity']).toBeGreaterThan(0));
    expect(nodeOf('whats-new-a15-9-late').props['opacity']).toBeLessThan(1);
  });

  it('A15-10 (#864): a typo in the token leaves the shape with no paint and the other bar drawn', async () => {
    const user = await openVersion();
    const rects = () => nodeOf('whats-new-a15-10-icon').children[0]!.children;
    expect(rects()[0]!.props['fill']).toEqual({ type: 0, payload: '#be123c' });
    await user.press(screen.getByTestId('whats-new-a15-10-break'));
    expect(textOf('whats-new-a15-10-readout')).toBe('--paint is notacolour');
    expect(rects()[0]!.props['fill']).toBeNull();
    expect(rects()[1]!.props['fill']).toEqual({ type: 0, payload: '#0369a1' });
  });
});
