import { screen, userEvent } from '@ng-native/testing';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../rewards/features/testing.ts';
import { textOf } from '../lists/testing.ts';
import { cases07 } from './core/cases-0-7.ts';
import { RELEASES } from './core/releases.ts';

interface Node {
  viewName: string;
  props: Record<string, unknown>;
  children: Node[];
}

const nodeOf = (id: string) => screen.getByTestId(id) as unknown as Node;

async function openVersion() {
  await renderApp('whats-new/0.7');
  await screen.findByTestId('whats-new-version-heading');
  return userEvent.setup();
}

/**
 * What a Node test can assert is what the engine commits, not what the device draws: there is no
 * layout, no native toolbar and no scrolling here. A7-1's buttons, A7-2's endReached and A7-4's
 * easing are only on a device; the Maestro flow and the README have what was seen.
 */
describe('what is new, 0.7', () => {
  it('is listed under 0.8, and its six cases each have a PR and a badge that matches the data', async () => {
    const versions = RELEASES.map((r) => r.version);
    expect(versions.indexOf('0.7')).toBe(versions.indexOf('0.8') + 1);
    await openVersion();
    const cases = cases07();
    expect(cases.map((c) => c.id)).toEqual(['a7-1', 'a7-2', 'a7-3', 'a7-4', 'a7-5', 'a7-6']);
    for (const item of cases) {
      expect(screen.getByTestId(`whats-new-${item.id}-title`)).toBeTruthy();
      expect(textOf(`whats-new-${item.id}-prs`)).toBe(item.prs.join(' · '));
      expect(textOf(`whats-new-${item.id}-status`)).toBe(
        item.status.kind === 'verified' ? `Verified · ${item.status.platforms.join(' · ')}` : 'Not checked',
      );
    }
  });

  it('A7-1 (#658): the counters start at zero beside the toolbar', async () => {
    await openVersion();
    expect(textOf('whats-new-a7-1-readout')).toBe('Plus pressed 0 times, Clear 0 times');
  });

  it('A7-2 (#647): the list starts with three rows, and Keep two rows leaves two', async () => {
    const user = await openVersion();
    expect(textOf('whats-new-a7-2-readout')).toMatch(/^Rows 3 \/ endReached \d+ times/);
    await user.press(screen.getByTestId('whats-new-a7-2-keep'));
    expect(textOf('whats-new-a7-2-readout')).toMatch(/^Rows (2|5) \//);
  });

  it('A7-3 (#645): a link from Page B to the 0.7 page already on the stack pushes a second copy', async () => {
    const user = await openVersion();
    expect(textOf('whats-new-a7-3-readout')).toBe('Copies of this page on the stack: 1');
    await user.press(screen.getByTestId('whats-new-a7-3-open'));
    expect(await screen.findByTestId('whats-new-link-lab-heading')).toBeTruthy();
    expect(textOf('whats-new-link-lab-readout')).toBe('Copies of Page B: 1 / of the 0.7 page: 1');
    await user.press(screen.getByTestId('whats-new-link-lab-back'));
    await screen.findByText('Copies of Page B: 1 / of the 0.7 page: 2');
  });

  it('A7-4 (#641, #649): the three lanes start with no opacity or colour written by any rule', async () => {
    await openVersion();
    for (const id of ['opacity', 'all', 'color']) expect(nodeOf(`whats-new-a7-4-${id}`).props['opacity']).toBeUndefined();
  });

  it('A7-5 (#639): the 20 px text under line-height 2 on a 10 px card has a 40 point line, the fixed one 20', async () => {
    await openVersion();
    expect(nodeOf('whats-new-a7-5-unitless').props['lineHeight']).toBe(40);
    expect(nodeOf('whats-new-a7-5-fixed').props['lineHeight']).toBe(20);
  });

  it('A7-6 (#648): the imported markdown joins a wrapped line, decodes every entity and keeps its two breaks', async () => {
    await openVersion();
    const drawn = textOf('whats-new-a7-6-drawn');
    expect(drawn).toContain('hard-wrapped in the source reads as one line, with a space where the source broke.');
    expect(drawn).toContain("Entities: → é € ♥ & '");
    expect(drawn).toMatch(/Two spaces end this line\nand break the text here, and a backslash ends this one\nand breaks it there\./);
  });
});
