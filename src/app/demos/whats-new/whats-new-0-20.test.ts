import { fireEvent, screen, userEvent } from '@ng-native/testing';
import { describe, expect, it, vi } from 'vitest';
import { renderApp } from '../rewards/features/testing.ts';
import { textOf } from '../lists/testing.ts';
import { cases020 } from './core/cases-0-20.ts';
import { RELEASES } from './core/releases.ts';

interface Node {
  viewName: string;
  props: Record<string, unknown>;
  children: Node[];
}

const send = (node: Node, event: string, data: object) => fireEvent(node as unknown as Parameters<typeof fireEvent>[0], event, data);
const nodeOf = (id: string) => screen.getByTestId(id) as unknown as Node;
const layoutOf = (width: number, height: number) => ({ nativeEvent: { layout: { x: 0, y: 0, width, height } } });

async function openVersion() {
  await renderApp('whats-new/0.20', []);
  // The first render of a lazy screen with this many cases can take longer than the default wait.
  await screen.findByTestId('whats-new-version-heading', undefined, { timeout: 15000 });
}

/** Node has no layout engine: the layout events are sent by hand, with the sizes a device would report. */
describe('what is new, 0.20', () => {
  it('is in the list of releases, and its five cases have a PR and a "Not checked" badge (no device run yet)', async () => {
    expect(RELEASES.map((release) => release.version)).toContain('0.20');
    await openVersion();
    const cases = cases020();
    expect(cases.map((c) => c.id)).toEqual(['a20-1', 'a20-2', 'a20-3', 'a20-4', 'b20-1']);
    for (const item of cases) {
      expect(screen.getByTestId(`whats-new-${item.id}-title`)).toBeTruthy();
      expect(textOf(`whats-new-${item.id}-prs`)).toBe(item.prs.join(' · '));
      expect(textOf(`whats-new-${item.id}-status`)).toBe('Not checked');
    }
  });

  it('A20-1 (#1305): the fitted row is align-self flex-start with flex-1 tabs, the other one is not, and each width is read', async () => {
    await openVersion();
    const fitted = nodeOf('whats-new-a20-1-fitted');
    const stretched = nodeOf('whats-new-a20-1-stretched');
    expect(fitted.props['alignSelf']).toBe('flex-start');
    expect(stretched.props['alignSelf']).toBeUndefined();
    for (const row of [fitted, stretched]) {
      expect(row.children).toHaveLength(3);
      for (const tab of row.children) expect([tab.props['flexGrow'], tab.props['flexShrink']]).toEqual([1, 1]);
    }
    await send(fitted, 'layout', layoutOf(168, 36));
    await send(stretched, 'layout', layoutOf(354, 36));
    await send(nodeOf('whats-new-a20-1-line'), 'layout', layoutOf(354, 0));
    expect(textOf('whats-new-a20-1-readout')).toBe('Fitted 168 / stretched 354 / line 354');
  });

  it('A20-2 (#1355): border, box-shadow, background and font in a style attribute and in a binding commit what the stylesheet does', async () => {
    await openVersion();
    const props = (kind: string, where: string) => nodeOf(`whats-new-a20-2-${kind}-${where}`).props;
    for (const where of ['sheet', 'attr', 'bound']) {
      const border = props('border', where);
      expect([border['borderTopWidth'], border['borderLeftWidth'], border['borderStyle']]).toEqual([3, 3, 'solid']);
      const image = props('background', where)['experimental_backgroundImage'] as { type: string; colorStops: unknown[] }[];
      expect(image).toHaveLength(1);
      expect([image[0]!.type, image[0]!.colorStops.length]).toEqual(['linear-gradient', 2]);
      const font = props('font', where);
      expect([font['fontSize'], font['fontFamily'], font['fontStyle'], Number(font['fontWeight'])]).toEqual([20, 'serif', 'italic', 700]);
    }
    const sheetShadow = props('shadow', 'sheet')['boxShadow'];
    expect(sheetShadow).toEqual([{ offsetX: 0, offsetY: 4, blurRadius: 8, spreadDistance: 0, color: 'rgba(0, 0, 0, 0.4)', inset: false }]);
    expect(props('shadow', 'attr')['boxShadow']).toEqual(sheetShadow);
    expect(props('shadow', 'bound')['boxShadow']).toEqual(sheetShadow);
  });

  it('A20-3 (#1350, #1322): a bound calc() is committed as points, not as text', async () => {
    await openVersion();
    expect(nodeOf('whats-new-a20-3-width').props['width']).toBe(32);
    // flex: 1 1 calc(10px + 10px) in a column with no height of its own: the basis is the height.
    const basis = nodeOf('whats-new-a20-3-basis').props;
    expect([basis['flexGrow'], basis['flexShrink'], basis['height']]).toEqual([1, 1, 20]);
    expect(nodeOf('whats-new-a20-3-opacity').props['opacity']).toBe(0.5);
    expect(nodeOf('whats-new-a20-3-shift').props['transform']).toEqual([{ translateX: 16 }]);
    await send(nodeOf('whats-new-a20-3-width'), 'layout', layoutOf(32, 12));
    await send(nodeOf('whats-new-a20-3-basis'), 'layout', layoutOf(40, 20));
    expect(textOf('whats-new-a20-3-readout')).toBe('Width 32 / basis 20');
  });
});

describe('what is new, 0.20: the tabs lab', () => {
  it('A20-4 (#1361): the count goes up while Home is in front, stops while a sheet covers it, and goes on from the same number', async () => {
    const user = userEvent.setup();
    await renderApp('whats-new/tabs/1/home');
    await screen.findByTestId('whats-new-lab-ticks');
    const ticks = () => Number(/(\d+)$/.exec(textOf('whats-new-lab-ticks'))![1]);
    await vi.waitFor(() => expect(ticks()).toBeGreaterThanOrEqual(1), { timeout: 4000 });
    await user.press(screen.getByTestId('whats-new-lab-present'));
    await screen.findByTestId('whats-new-lab-album-title');
    // The change that covers Home may let one more tick in; after that the number holds.
    await new Promise((resolve) => setTimeout(resolve, 100));
    const held = ticks();
    await new Promise((resolve) => setTimeout(resolve, 2300));
    expect(ticks()).toBe(held);
    await user.press(screen.getByTestId('whats-new-lab-album-close'));
    await vi.waitFor(() => expect(ticks()).toBeGreaterThan(held), { timeout: 4000 });
    // Home was only covered: its title was never removed from the tree.
    expect(screen.getByTestId('whats-new-lab-home-title')).toBeTruthy();
  }, 15000);

  it('B20-1 (#1351): with Keep me here on, the sheet refuses to be left and the url holds; with it off, it goes', async () => {
    const user = userEvent.setup();
    await renderApp('whats-new/tabs/1/home');
    await screen.findByTestId('whats-new-lab-present-keep');
    await user.press(screen.getByTestId('whats-new-lab-present-keep'));
    await screen.findByTestId('whats-new-lab-keep-title');
    const url = textOf('whats-new-lab-keep-url');
    // A swipe is native; Close asks the same canDeactivate guard through back().
    await fireEvent(screen.getByTestId('whats-new-lab-keep-switch'), 'change', { value: true });
    await user.press(screen.getByTestId('whats-new-lab-keep-close'));
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(screen.getByTestId('whats-new-lab-keep-title')).toBeTruthy();
    expect(textOf('whats-new-lab-keep-url')).toBe(url);
    await fireEvent(screen.getByTestId('whats-new-lab-keep-switch'), 'change', { value: false });
    await user.press(screen.getByTestId('whats-new-lab-keep-close'));
    await vi.waitFor(() => expect(screen.queryByTestId('whats-new-lab-keep-title')).toBeNull());
  });
});
