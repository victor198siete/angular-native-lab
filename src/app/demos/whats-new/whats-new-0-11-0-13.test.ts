import { DeepLinks, type DeepLinkSource } from '@ng-native/device';
import { screen, userEvent } from '@ng-native/testing';
import { describe, expect, it, vi } from 'vitest';
import { renderApp } from '../rewards/features/testing.ts';
import { textOf } from '../lists/testing.ts';
import { cases011 } from './core/cases-0-11.ts';
import { cases013 } from './core/cases-0-13.ts';
import type { Case } from './core/case.ts';

interface Node {
  viewName: string;
  props: Record<string, unknown>;
  children: Node[];
}

const nodeOf = (id: string) => screen.getByTestId(id) as unknown as Node;
const namesIn = (node: Node): string[] => [node.viewName, ...node.children.flatMap(namesIn)];
const findAll = (node: Node, viewName: string): Node[] => [
  ...(node.viewName === viewName ? [node] : []),
  ...node.children.flatMap((child) => findAll(child, viewName)),
];

async function openVersion(version: string, extra = [] as Parameters<typeof renderApp>[1]) {
  await renderApp(`whats-new/${version}`, extra);
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

describe('what is new, 0.11', () => {
  it('lists 0.11 with three cases, each with its PR and a badge that matches its data', async () => {
    await openVersion('0.11');
    const cases = cases011();
    expect(cases.map((c) => c.id)).toEqual(['a11-1', 'a11-2', 'a11-3']);
    for (const item of cases) {
      expect(screen.getByTestId(`whats-new-${item.id}-title`)).toBeTruthy();
      expect(textOf(`whats-new-${item.id}-prs`)).toBe(item.prs.join(' · '));
      expect(textOf(`whats-new-${item.id}-status`)).toBe(badgeOf(item));
    }
  });

  it('A11-1: the button asks the DeepLinkSource to open the settings, once per press', async () => {
    const openSettings = vi.fn();
    const source: DeepLinkSource = {
      launchUrl: async () => null,
      subscribe: () => () => undefined,
      open: () => undefined,
      openSettings,
    };
    const user = await openVersion('0.11', [{ provide: DeepLinks.SOURCE, useValue: source }]);
    expect(textOf('whats-new-a11-1-readout')).toBe('openSettings() called: 0 times');
    await user.press(screen.getByTestId('whats-new-a11-1-open'));
    await user.press(screen.getByTestId('whats-new-a11-1-open'));
    expect(openSettings).toHaveBeenCalledTimes(2);
    expect(textOf('whats-new-a11-1-readout')).toBe('openSettings() called: 2 times');
  });

  it('A11-1: a source with no openSettings opens nothing and does not throw', async () => {
    const source: DeepLinkSource = {
      launchUrl: async () => null,
      subscribe: () => () => undefined,
      open: () => undefined,
    };
    const user = await openVersion('0.11', [{ provide: DeepLinks.SOURCE, useValue: source }]);
    await user.press(screen.getByTestId('whats-new-a11-1-open'));
    expect(textOf('whats-new-a11-1-readout')).toBe('openSettings() called: 1 times');
  });

  it('A11-2 and A11-3: each tab case has a button that opens the tabs lab', async () => {
    await openVersion('0.11');
    expect(screen.getByTestId('whats-new-a11-2-open')).toBeTruthy();
    expect(screen.getByTestId('whats-new-a11-3-open')).toBeTruthy();
  });
});

describe('the tabs lab', () => {
  it('opens on Home under org 1, and a move to org 2 keeps the one bar and updates the page', async () => {
    const user = userEvent.setup();
    await renderApp('whats-new/tabs/1/home');
    await screen.findByTestId('whats-new-lab-home-title');
    expect(textOf('whats-new-lab-home-org')).toBe('org: 1');
    await user.press(screen.getByTestId('whats-new-lab-org'));
    await vi.waitFor(() => expect(textOf('whats-new-lab-home-org')).toBe('org: 2'));
    expect(textOf('whats-new-lab-home-url')).toBe('url: /whats-new/tabs/2/home');
  });
});

describe('what is new, 0.13', () => {
  it('lists 0.13 with eight cases, each with its PR and a badge that matches its data', async () => {
    await openVersion('0.13');
    const cases = cases013();
    expect(cases.map((c) => c.id)).toEqual(['a13-1', 'a13-2', 'a13-3', 'a13-4', 'a13-5', 'a13-6', 'a13-7', 'a13-8']);
    for (const item of cases) {
      expect(screen.getByTestId(`whats-new-${item.id}-title`)).toBeTruthy();
      expect(textOf(`whats-new-${item.id}-prs`)).toBe(item.prs.join(' · '));
      expect(textOf(`whats-new-${item.id}-status`)).toBe(badgeOf(item));
    }
  });

  it('A13-1: the drawings commit a mask, a clip path and two uses', async () => {
    await openVersion('0.13');
    expect(namesIn(nodeOf('whats-new-a13-1-mask'))).toContain('RNSVGMask');
    expect(nodeOf('whats-new-a13-1-mask').children[0]!.children.at(-1)!.props['mask']).toBe('wn-hole');
    const clip = namesIn(nodeOf('whats-new-a13-1-clip'));
    expect(clip).toContain('RNSVGClipPath');
    expect(findAll(nodeOf('whats-new-a13-1-clip'), 'RNSVGGroup').some((g) => g.props['clipPath'] === 'wn-disc')).toBe(true);
    const uses = findAll(nodeOf('whats-new-a13-1-use'), 'RNSVGUse');
    expect(uses.map((use) => use.props['href'])).toEqual(['wn-star', 'wn-star']);
  });

  it('A13-2: color="var(--accent)" is the token in scope, and follows it', async () => {
    const user = await openVersion('0.13');
    expect(nodeOf('whats-new-a13-2-icon').props['color']).toBe('#be123c');
    await user.press(screen.getByTestId('whats-new-a13-2-next'));
    expect(textOf('whats-new-a13-2-readout')).toBe('--accent is #0369a1');
    expect(nodeOf('whats-new-a13-2-icon').props['color']).toBe('#0369a1');
  });

  it('A13-3: an icon under provideNgIconsConfig takes its size, colour and stroke width; its own size wins', async () => {
    await openVersion('0.13');
    const bare = nodeOf('whats-new-a13-3-bare').children[0]!;
    expect(bare.props['width']).toBe(28);
    expect(bare.props['color']).toBe('#0369a1');
    expect(bare.children[0]!.props['strokeWidth']).toBe('3');
    expect(nodeOf('whats-new-a13-3-own').children[0]!.props['width']).toBe(44);
  });

  it('A13-4: the loader draws a name no provideIcons has, and withCaching() asks it once per name', async () => {
    const user = await openVersion('0.13');
    expect(textOf('whats-new-a13-4-readout')).toBe('Loader asked 0 times: -');
    await user.press(screen.getByTestId('whats-new-a13-4-draw'));
    await vi.waitFor(() => expect(findAll(nodeOf('whats-new-a13-4-ring'), 'RNSVGCircle').length).toBeGreaterThan(0));
    expect(findAll(nodeOf('whats-new-a13-4-pin-1'), 'RNSVGPath').length).toBeGreaterThan(0);
    expect(findAll(nodeOf('whats-new-a13-4-pin-2'), 'RNSVGPath').length).toBeGreaterThan(0);
    expect(textOf('whats-new-a13-4-readout')).toBe('Loader asked 2 times: loaded-pin, loaded-ring');

    await user.press(screen.getByTestId('whats-new-a13-4-clear'));
    await user.press(screen.getByTestId('whats-new-a13-4-draw'));
    expect(findAll(nodeOf('whats-new-a13-4-pin-1'), 'RNSVGPath').length).toBeGreaterThan(0);
    expect(textOf('whats-new-a13-4-readout')).toBe('Loader asked 2 times: loaded-pin, loaded-ring');
  });

  it('A13-5: a static aria-label makes the icon an image with that label; the other is decorative', async () => {
    await openVersion('0.13');
    const labelled = nodeOf('whats-new-a13-5-labelled').props;
    expect(labelled['accessible']).toBe(true);
    expect(labelled['accessibilityRole']).toBe('image');
    expect(labelled['accessibilityLabel']).toBe('Pin on the map');
    expect(nodeOf('whats-new-a13-5-decorative').props['accessible']).toBe(false);
  });

  it('A13-6: with no size, the icon takes --ng-icon__size from around it', async () => {
    await openVersion('0.13');
    expect(nodeOf('whats-new-a13-6-token').children[0]!.props['width']).toBe(32);
  });

  it('A13-7: stroke-dasharray="none" is a solid line and opacity="50%" is one half', async () => {
    await openVersion('0.13');
    const [dashed, solid, inherited] = findAll(nodeOf('whats-new-a13-7-dash'), 'RNSVGPath');
    expect(dashed!.props['strokeDasharray']).toEqual(['3', '3']);
    expect(solid!.props['strokeDasharray']).toBeUndefined();
    expect(inherited!.props['strokeDasharray']).toBeUndefined();
    const bars = findAll(nodeOf('whats-new-a13-7-opacity'), 'RNSVGRect').map((bar) => bar.props['opacity']);
    expect(bars).toEqual([1, 0.5, 0.5]);
  });

  it('A13-8: the card opens the tabs lab', async () => {
    await openVersion('0.13');
    expect(screen.getByTestId('whats-new-a13-8-open')).toBeTruthy();
  });
});
