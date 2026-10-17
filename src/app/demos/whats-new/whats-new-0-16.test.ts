import { fireEvent, screen, userEvent } from '@ng-native/testing';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../rewards/features/testing.ts';
import { textOf } from '../lists/testing.ts';
import { cases016 } from './core/cases-0-16.ts';
import { RELEASES } from './core/releases.ts';
import type { Case } from './core/case.ts';

interface Node {
  viewName: string;
  props: Record<string, unknown>;
  children: Node[];
}

const send = (node: Node, event: string, data: object) => fireEvent(node as unknown as Parameters<typeof fireEvent>[0], event, data);

const nodeOf = (id: string) => screen.getByTestId(id) as unknown as Node;

async function openVersion() {
  await renderApp('whats-new/0.16', []);
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

/** Node has no layout and no image decoder: the load and layout events are sent by hand, with the sizes a device reports. */
describe('what is new, 0.16', () => {
  it('is in the list of releases, and its case has a PR and a badge that matches the data', async () => {
    expect(RELEASES.map((release) => release.version)).toContain('0.16');
    await openVersion();
    const cases = cases016();
    expect(cases.map((c) => c.id)).toEqual(['a16-1']);
    for (const item of cases) {
      expect(screen.getByTestId(`whats-new-${item.id}-title`)).toBeTruthy();
      expect(textOf(`whats-new-${item.id}-prs`)).toBe(item.prs.join(' · '));
      expect(textOf(`whats-new-${item.id}-status`)).toBe(badgeOf(item));
    }
  });

  it('A16-1 (#922): a small picture keeps its own width, a wide one is narrowed to the document keeping its shape', async () => {
    await openVersion();
    const images = () => nodeOf('whats-new-a16-1-drawn').children[0]!.children;
    const [small, wide] = images();
    expect(small!.viewName).toBe('Image');
    expect(wide!.viewName).toBe('Image');
    // Until they load both are the document's width at 200 points high.
    expect([small!.props['width'], small!.props['height']]).toEqual(['100%', 200]);
    expect([wide!.props['width'], wide!.props['height']]).toEqual(['100%', 200]);
    // Loaded: each is its own width and its own shape; the document is 300 points wide, so only the strip is narrowed.
    await send(small!, 'load', { nativeEvent: { source: { width: 32, height: 32 } } });
    await send(wide!, 'load', { nativeEvent: { source: { width: 600, height: 100 } } });
    await send(images()[0]!, 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 32, height: 32 } } });
    await send(images()[1]!, 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 300, height: 50 } } });
    const [icon, strip] = images();
    expect([icon!.props['width'], icon!.props['height'], icon!.props['aspectRatio']]).toEqual([32, 'auto', 1]);
    expect(strip!.props['maxWidth']).toBe('100%');
    expect([strip!.props['height'], strip!.props['aspectRatio']]).toEqual([50, null]);
  });
});
