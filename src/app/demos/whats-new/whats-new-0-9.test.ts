import { screen, userEvent } from '@ng-native/testing';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../rewards/features/testing.ts';
import { textOf } from '../lists/testing.ts';
import { cases09 } from './core/cases-0-9.ts';

async function openVersion() {
  await renderApp('whats-new/0.9');
  await screen.findByTestId('whats-new-version-heading');
  return userEvent.setup();
}

describe('what is new, 0.9', () => {
  it('lists 0.9 with five cases, each with its PRs and a badge that matches its data', async () => {
    await openVersion();
    const cases = cases09();
    expect(cases.map((c) => c.id)).toEqual(['a9-1', 'a9-2', 'a9-3', 'a9-4', 'a9-5']);
    for (const item of cases) {
      expect(screen.getByTestId(`whats-new-${item.id}-title`)).toBeTruthy();
      expect(textOf(`whats-new-${item.id}-prs`)).toBe(item.prs.join(' · '));
      const badge = textOf(`whats-new-${item.id}-status`);
      if (item.status.kind === 'verified') expect(badge).toBe(`Verified · ${item.status.platforms.join(' · ')}`);
      else expect(badge).not.toBe('');
    }
  });

  it('A9-1: the plural picks 0, one and other; the select picks its case; the label is translated source text', async () => {
    const user = await openVersion();
    await user.press(screen.getByTestId('whats-new-a9-1-show'));
    expect(textOf('whats-new-a9-1-count')).toBe('No rewards');
    expect(screen.getByTestId('whats-new-a9-1-count').props.accessibilityLabel).toBe('Rewards in the basket');
    await user.press(screen.getByTestId('whats-new-a9-1-plus'));
    expect(textOf('whats-new-a9-1-count')).toBe('1 reward');
    for (let i = 0; i < 4; i++) await user.press(screen.getByTestId('whats-new-a9-1-plus'));
    expect(textOf('whats-new-a9-1-count')).toBe('5 rewards');

    expect(textOf('whats-new-a9-1-tier')).toBe('Gold member');
    await user.press(screen.getByTestId('whats-new-a9-1-tier-next'));
    expect(textOf('whats-new-a9-1-tier')).toBe('Silver member');
    await user.press(screen.getByTestId('whats-new-a9-1-tier-next'));
    expect(textOf('whats-new-a9-1-tier')).toBe('Member');
  });

  it('A9-4: a press on the target is counted, before and after it is faded', async () => {
    const user = await openVersion();
    expect(textOf('whats-new-a9-4-count')).toBe('Presses heard: 0 (visible)');
    await user.press(screen.getByTestId('whats-new-a9-4-target'));
    await user.press(screen.getByTestId('whats-new-a9-4-fade'));
    await user.press(screen.getByTestId('whats-new-a9-4-target'));
    expect(textOf('whats-new-a9-4-count')).toBe('Presses heard: 2 (faded)');
  });

  it('renders the animation cases, and A9-5 mounts its cards on a press', async () => {
    const user = await openVersion();
    for (const id of ['whats-new-a9-2-scale', 'whats-new-a9-2-slide', 'whats-new-a9-3-p1', 'whats-new-a9-3-p2', 'whats-new-a9-3-p3']) {
      expect(screen.getByTestId(id)).toBeTruthy();
    }
    expect(screen.queryByTestId('whats-new-a9-5-fast')).toBeNull();
    await user.press(screen.getByTestId('whats-new-a9-5-toggle'));
    expect(screen.getByTestId('whats-new-a9-5-fast')).toBeTruthy();
    expect(screen.getByTestId('whats-new-a9-5-slow')).toBeTruthy();
  });
});
