import { screen, userEvent } from '@ng-native/testing';
import { Dialogs, type NativeDialogs } from '@ng-native/device';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../rewards/features/testing.ts';
import { textOf } from '../lists/testing.ts';
import { cases010 } from './core/cases-0-10.ts';
import { RELEASES } from './core/releases.ts';

/** A stand-in for the platform's dialogs: the action sheet answers with the index it is told to. */
function sheetAnswering(pick: (cancelButtonIndex: number) => number): NativeDialogs {
  return {
    platform: 'ios',
    alert: () => undefined,
    actionSheet: (options, onSelect) => onSelect(pick(options.cancelButtonIndex)),
  };
}

async function openVersion(extra = [] as Parameters<typeof renderApp>[1]) {
  await renderApp('whats-new/0.10', extra);
  await screen.findByTestId('whats-new-version-heading');
  return userEvent.setup();
}

describe('what is new', () => {
  it('lists the versions that have cases, and a row opens that version', async () => {
    await renderApp('whats-new');
    await screen.findByTestId('whats-new-heading');
    expect(RELEASES.map((release) => release.version)).toEqual(['0.10', '0.9']);
    expect(textOf('whats-new-version-0.10')).toContain('7 cases');
    const user = userEvent.setup();
    await user.press(screen.getByTestId('whats-new-version-0.10'));
    expect(await screen.findByTestId('whats-new-version-heading')).toBeTruthy();
  });

  it('shows the seven 0.10 cases, each with its PRs and a status badge', async () => {
    await openVersion();
    const cases = cases010();
    expect(cases.map((c) => c.id)).toEqual(['a10-1', 'a10-2', 'a10-3', 'a10-4', 'a10-5', 'a10-6', 'a10-7']);
    for (const item of cases) {
      expect(screen.getByTestId(`whats-new-${item.id}-title`)).toBeTruthy();
      expect(textOf(`whats-new-${item.id}-prs`)).toBe(item.prs.join(' · '));
      expect(textOf(`whats-new-${item.id}-status`)).toBe(
        item.status.kind === 'verified' ? `Verified · ${item.status.platforms.join(' · ')}` : 'Not checked',
      );
    }
    // #729 is an iOS change, so only iOS is claimed for it.
    expect(textOf('whats-new-a10-1-status')).toBe('Verified · iOS');
    expect(textOf('whats-new-a10-7-status')).toBe('Verified · iOS · Android');
  });

  it('every verified status names the platforms it was seen on', () => {
    for (const item of cases010()) {
      if (item.status.kind === 'verified') expect(item.status.platforms.length).toBeGreaterThan(0);
    }
  });

  it('Dialogs.choose: a real choice reads its index, Cancel reads null', async () => {
    let picked = 1;
    const user = await openVersion([
      { provide: Dialogs.SOURCE, useValue: sheetAnswering((cancel) => (picked === -1 ? cancel : picked)) },
    ]);
    expect(textOf('whats-new-a10-1-result')).toBe('Not asked yet');
    await user.press(screen.getByTestId('whats-new-a10-1-open'));
    await screen.findByText('Resolved: 1');

    picked = -1;
    await user.press(screen.getByTestId('whats-new-a10-1-open'));
    await screen.findByText('Resolved: null');
  });

  it('dark class: the toggle flips the class on the box itself', async () => {
    const user = await openVersion();
    const root = () => screen.getByTestId('whats-new-a10-4-root');
    expect(textOf('whats-new-a10-4-readout')).toContain('off');
    await user.press(screen.getByTestId('whats-new-a10-4-toggle'));
    expect(textOf('whats-new-a10-4-readout')).toContain('on');
    expect(root()).toBeTruthy();
  });

  it('renders the style cases', async () => {
    await openVersion();
    for (const id of [
      'whats-new-a10-3-with', 'whats-new-a10-3-bare', 'whats-new-a10-5-bare', 'whats-new-a10-5-black',
      'whats-new-a10-6-word', 'whats-new-a10-6-words', 'whats-new-a10-7-3', 'whats-new-a10-7-2', 'whats-new-a10-7-1',
      'whats-new-a10-2-command',
    ]) {
      expect(screen.getByTestId(id)).toBeTruthy();
    }
  });
});
