import { Component, inject } from '@angular/core';
import { HostEngine, type Conditions } from '@ng-native/fabric';
import { render, screen, settle, userEvent } from '@ng-native/testing';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../rewards/features/testing.ts';
import { textOf } from '../lists/testing.ts';
import { cases022 } from './core/cases-0-22.ts';
import { RELEASES } from './core/releases.ts';
import { AccentTokenCase } from './features/cases/accent-token-case.ts';

interface Node {
  viewName: string;
  props: Record<string, unknown>;
  children: Node[];
}

const nodeOf = (id: string) => screen.getByTestId(id) as unknown as Node;

/**
 * Holds the engine, so a test can do what `watchConditions` does on a device when the scheme changes.
 * `HostEngine` does not declare `updateConditions`; the `Engine` mounted under it does.
 */
@Component({ selector: 'app-accent-probe', imports: [AccentTokenCase], template: `<app-accent-token-case />` })
class AccentProbe {
  readonly engine = inject(HostEngine) as unknown as { updateConditions(next: Conditions): void };
}

const conditions = (colorScheme: 'light' | 'dark'): Conditions => ({ width: 400, height: 800, colorScheme });

async function openVersion() {
  await renderApp('whats-new/0.22', []);
  await screen.findByTestId('whats-new-version-heading', undefined, { timeout: 15000 });
}

describe('what is new, 0.22', () => {
  it('is in the list of releases, and its case has two PRs and a badge verified on both platforms (9 Nov)', async () => {
    expect(RELEASES.map((release) => release.version)).toContain('0.22');
    await renderApp('whats-new/0.22', []);
    await screen.findByTestId('whats-new-version-heading', undefined, { timeout: 15000 });
    const [item] = cases022();
    expect(cases022().map((c) => c.id)).toEqual(['a22-1', 'a22-2', 'a22-3']);
    expect(screen.getByTestId('whats-new-a22-1-title')).toBeTruthy();
    expect(textOf('whats-new-a22-1-prs')).toBe(item!.prs.join(' · '));
    expect(textOf('whats-new-a22-1-status')).toBe('Verified · iOS · Android');
    expect(textOf('whats-new-a22-2-status')).toBe('Not checked');
    expect(textOf('whats-new-a22-3-status')).toBe('Not checked');
  });

  it('A22-1 (#1411, #1410): the token text, the icon colour and the shape fill all change when the scheme goes from light to dark', async () => {
    const view = await render(AccentProbe, { conditions: conditions('light') });
    const iconColor = () => nodeOf('whats-new-a22-1-icon').props['color'];
    const shapeFill = () => nodeOf('whats-new-a22-1-shape').children[0]!.children[0]!.props['fill'];
    // light-dark(#be123c, #ff6b85), as the text injectToken returns it.
    expect(textOf('whats-new-a22-1-readout')).toBe('--accent is rgb(190, 18, 60)');
    expect(iconColor()).toBe('rgb(190, 18, 60)');
    const lightFill = shapeFill();
    expect(lightFill).toBeDefined();

    view.instance.engine.updateConditions(conditions('dark'));
    await settle();
    expect(textOf('whats-new-a22-1-readout')).toBe('--accent is rgb(255, 107, 133)');
    expect(iconColor()).toBe('rgb(255, 107, 133)');
    expect(shapeFill()).toBeDefined();
    expect(shapeFill()).not.toEqual(lightFill);
  });

  it('A22-2 (#1398): a text-shadow with no colour is committed in the text colour, in an own colour for a text that has one, and follows the button', async () => {
    const user = userEvent.setup();
    await openVersion();
    const shadow = (id: string) => {
      const props = nodeOf(`whats-new-a22-2-${id}`).props;
      return [props['textShadowOffset'], props['textShadowRadius'], props['textShadowColor']];
    };
    expect(shadow('sample')).toEqual([{ width: 0, height: 2 }, 4, '#12131a']);
    expect(shadow('own')[2]).toBe('rgb(29, 78, 216)');
    await user.press(screen.getByTestId('whats-new-a22-2-flip'));
    expect(textOf('whats-new-a22-2-readout')).toBe('Text colour #be123c');
    expect(shadow('sample')[2]).toBe('#be123c');
    expect(shadow('own')[2]).toBe('rgb(29, 78, 216)');
  });

  it('A22-3 (#1395): background-image: var(--g) is committed as a gradient, and a currentColor token follows the text colour', async () => {
    const user = userEvent.setup();
    await openVersion();
    const gradient = () => nodeOf('whats-new-a22-3-gradient').props['experimental_backgroundImage'] as { type: string; colorStops: unknown[] }[];
    const current = () => nodeOf('whats-new-a22-3-current').props['backgroundColor'];
    expect(gradient()).toHaveLength(1);
    expect(gradient()[0]!.type).toBe('linear-gradient');
    expect(gradient()[0]!.colorStops).toHaveLength(2);
    expect(current()).toBe('#12131a');
    await user.press(screen.getByTestId('whats-new-a22-3-flip'));
    expect(textOf('whats-new-a22-3-readout')).toBe('Text colour #be123c');
    expect(current()).toBe('#be123c');
    expect(gradient()).toHaveLength(1);
  });
});
