import { screen, userEvent } from '@ng-native/testing';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../rewards/features/testing.ts';
import { textOf } from '../lists/testing.ts';
import { cases021 } from './core/cases-0-21.ts';
import { RELEASES } from './core/releases.ts';

interface Node {
  viewName: string;
  props: Record<string, unknown>;
  children: Node[];
}

const nodeOf = (id: string) => screen.getByTestId(id) as unknown as Node;

async function openVersion() {
  await renderApp('whats-new/0.21', []);
  await screen.findByTestId('whats-new-version-heading', undefined, { timeout: 15000 });
}

describe('what is new, 0.21', () => {
  it('is in the list of releases, and its two cases have a PR and a "Not checked" badge (no device run yet)', async () => {
    expect(RELEASES.map((release) => release.version)).toContain('0.21');
    await openVersion();
    const cases = cases021();
    expect(cases.map((c) => c.id)).toEqual(['a21-1', 'a21-2']);
    for (const item of cases) {
      expect(screen.getByTestId(`whats-new-${item.id}-title`)).toBeTruthy();
      expect(textOf(`whats-new-${item.id}-prs`)).toBe(item.prs.join(' · '));
      expect(textOf(`whats-new-${item.id}-status`)).toBe('Not checked');
    }
  });

  it('A21-1 (#1376, #1369): font-size 0 and a calc() clamped to 0 are committed as a positive size too small to see, the control keeps 16', async () => {
    await openVersion();
    // Native refuses 0 (Android throws), so the engine commits a hair above it: 0.001, not the default size.
    for (const id of ['zero', 'clamped']) {
      const size = nodeOf(`whats-new-a21-1-${id}`).props['fontSize'] as number;
      expect(size).toBeGreaterThan(0);
      expect(size).toBeLessThan(0.01);
    }
    expect(nodeOf('whats-new-a21-1-control').props['fontSize']).toBe(16);
  });

  it('A21-2 (#1389): a box-shadow with no colour is committed in the text colour, and follows it when the button flips it', async () => {
    const user = userEvent.setup();
    await openVersion();
    const shadow = () => nodeOf('whats-new-a21-2-box').props['boxShadow'] as { color: string; offsetY: number; blurRadius: number }[];
    expect(shadow()).toHaveLength(1);
    expect([shadow()[0]!.offsetY, shadow()[0]!.blurRadius, shadow()[0]!.color]).toEqual([4, 12, '#12131a']);
    await user.press(screen.getByTestId('whats-new-a21-2-flip'));
    expect(textOf('whats-new-a21-2-text')).toBe('Text colour #be123c');
    expect(shadow()[0]!.color).toBe('#be123c');
  });
});
