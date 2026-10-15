import { screen, userEvent } from '@ng-native/testing';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../rewards/features/testing.ts';
import { textOf } from '../lists/testing.ts';
import { cases014 } from './core/cases-0-14.ts';
import { RELEASES } from './core/releases.ts';
import type { Case } from './core/case.ts';

interface Node {
  viewName: string;
  props: Record<string, unknown>;
  children: Node[];
}

const nodeOf = (id: string) => screen.getByTestId(id) as unknown as Node;

async function openVersion() {
  await renderApp('whats-new/0.14');
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
 * layout here, and the Tailwind sheet is not loaded, so a Tailwind class is not in these props).
 * A14-2, A14-3, A14-4, A14-7 and the viewport unit of A14-1 are only on a device.
 */
describe('what is new, 0.14', () => {
  it('is the newest release in the list, and its twelve cases each have a PR and a badge that matches the data', async () => {
    expect(RELEASES[0]!.version).toBe('0.14');
    await openVersion();
    const cases = cases014();
    expect(cases.map((c) => c.id)).toEqual(Array.from({ length: 12 }, (_, i) => `a14-${i + 1}`));
    for (const item of cases) {
      expect(screen.getByTestId(`whats-new-${item.id}-title`)).toBeTruthy();
      expect(textOf(`whats-new-${item.id}-prs`)).toBe(item.prs.join(' · '));
      expect(textOf(`whats-new-${item.id}-status`)).toBe(badgeOf(item));
    }
    // The statuses were set by hand from the device runs: A14-3 and A14-10 are claims about Android, A14-2 is a caveat.
    const byId = Object.fromEntries(cases.map((c) => [c.id, c.status]));
    expect(byId['a14-2']!.kind).toBe('caveat');
    expect(byId['a14-3']).toEqual({ kind: 'verified', platforms: ['Android'] });
    expect(byId['a14-10']).toEqual({ kind: 'verified', platforms: ['Android'] });
    expect(textOf('whats-new-a14-2-status')).toBe('Caveat');
    expect(textOf('whats-new-a14-1-status')).toBe('Verified · iOS · Android');
  });

  it('A14-1 (#786, #784): a bound 2em is 2x the font size and follows it, 2rem is 32, an ng-icon size="2em" is 2em', async () => {
    const user = await openVersion();
    // On 0.13.0 these committed the text '2em' / '2rem' (the PR's own test fails on main with it), and the icon stayed at 1em.
    const sizes = () => [
      nodeOf('whats-new-a14-1-em').props['width'],
      nodeOf('whats-new-a14-1-rem').props['width'],
      nodeOf('whats-new-a14-1-icon').children[0]!.props['width'],
    ];
    expect(sizes()).toEqual([32, 32, 32]);
    await user.press(screen.getByTestId('whats-new-a14-1-toggle'));
    expect(nodeOf('whats-new-a14-1-scope').props['fontSize']).toBe(24);
    expect(sizes()).toEqual([48, 32, 48]);
    await user.press(screen.getByTestId('whats-new-a14-1-toggle'));
    expect(sizes()).toEqual([32, 32, 32]);
    // 50vw is a number too (0 here: the Node viewport has no width), not the text '50vw'.
    expect(typeof nodeOf('whats-new-a14-1-vw').props['width']).toBe('number');
  });

  it('A14-5 (#840): a minimum over a maximum raises the maximum to it', async () => {
    await openVersion();
    expect(nodeOf('whats-new-a14-5-height').props['minHeight']).toBe(80);
    expect(nodeOf('whats-new-a14-5-height').props['maxHeight']).toBe(80);
    expect(nodeOf('whats-new-a14-5-width').props['maxWidth']).toBe(160);
  });

  it('A14-6 (#841): a wrapping container that says nothing of align-content stretches its lines', async () => {
    await openVersion();
    expect(nodeOf('whats-new-a14-6-wrap').props['alignContent']).toBe('stretch');
  });

  it('A14-8 (#844): a label that is a flex column of two spans is a view of two paragraphs; a plain one is one paragraph', async () => {
    await openVersion();
    const column = nodeOf('whats-new-a14-8-column');
    expect(column.viewName).toBe('View');
    expect(column.children.map((child) => child.viewName)).toEqual(['Paragraph', 'Paragraph']);
    expect(nodeOf('whats-new-a14-8-inline').viewName).toBe('Paragraph');
  });

  it('A14-9 (#803): aria-checked="false" reaches native as the boolean false, "true" as true', async () => {
    await openVersion();
    expect(nodeOf('whats-new-a14-9-false').props['accessibilityState']).toEqual({ checked: false });
    expect(nodeOf('whats-new-a14-9-true').props['accessibilityState']).toEqual({ checked: true });
  });

  it('A14-10 (#820): the system colours on Android are colorForeground, GrayText included', async () => {
    await openVersion();
    for (const id of ['canvas', 'gray']) {
      const color = nodeOf(`whats-new-a14-10-${id}`).props['color'] as { semantic: string[] };
      expect(color.semantic.at(-1)).toBe('?android:attr/colorForeground');
    }
  });

  it('A14-11 (#803): a virtual-list with rowGap and overscan bound to undefined draws its rows', async () => {
    await openVersion();
    for (const row of ['one', 'two', 'three']) expect(screen.getByText(row)).toBeTruthy();
    expect(textOf('whats-new-a14-11-rows')).toBe('Rows drawn: 3');
    expect(textOf('whats-new-a14-11-readout')).toBe('Long press not heard yet');
  });

  it('A14-12 (#803): padding: 4px 8px in a style sets each side, and line-height: 1.5 at 20 pt is 30', async () => {
    await openVersion();
    const pad = nodeOf('whats-new-a14-12-pad').props;
    expect([pad['paddingTop'], pad['paddingRight'], pad['paddingBottom'], pad['paddingLeft']]).toEqual([4, 8, 4, 8]);
    expect(nodeOf('whats-new-a14-12-line').props['lineHeight']).toBe(30);
  });
});
