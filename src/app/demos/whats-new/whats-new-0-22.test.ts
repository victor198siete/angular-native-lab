import { Component, inject } from '@angular/core';
import { HostEngine, type Conditions } from '@ng-native/fabric';
import { render, screen, settle } from '@ng-native/testing';
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

describe('what is new, 0.22', () => {
  it('is in the list of releases, and its case has two PRs and a "Not checked" badge (no device run yet)', async () => {
    expect(RELEASES.map((release) => release.version)).toContain('0.22');
    await renderApp('whats-new/0.22', []);
    await screen.findByTestId('whats-new-version-heading', undefined, { timeout: 15000 });
    const [item] = cases022();
    expect(cases022().map((c) => c.id)).toEqual(['a22-1']);
    expect(screen.getByTestId('whats-new-a22-1-title')).toBeTruthy();
    expect(textOf('whats-new-a22-1-prs')).toBe(item!.prs.join(' · '));
    expect(textOf('whats-new-a22-1-status')).toBe('Not checked');
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
});
