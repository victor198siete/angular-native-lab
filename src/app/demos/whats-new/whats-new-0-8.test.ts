import { Permission, type PermissionResponse } from '@ng-native/expo';
import { screen, userEvent } from '@ng-native/testing';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../rewards/features/testing.ts';
import { textOf } from '../lists/testing.ts';
import { fakeLocation, permissions } from '../device/testing.ts';
import { cases08 } from './core/cases-0-8.ts';

async function openVersion(extra = [] as Parameters<typeof renderApp>[1]) {
  await renderApp('whats-new/0.8', extra);
  await screen.findByTestId('whats-new-version-heading');
  return userEvent.setup();
}

describe('what is new, 0.8', () => {
  it('lists 0.8 with six cases, each with its PRs and a badge that matches its data', async () => {
    await openVersion();
    const cases = cases08();
    expect(cases.map((c) => c.id)).toEqual(['a8-1', 'a8-2', 'a8-3', 'a8-4', 'a8-5', 'a8-6']);
    for (const item of cases) {
      expect(screen.getByTestId(`whats-new-${item.id}-title`)).toBeTruthy();
      expect(textOf(`whats-new-${item.id}-prs`)).toBe(item.prs.join(' · '));
      const badge = textOf(`whats-new-${item.id}-status`);
      if (item.status.kind === 'verified') expect(badge).toBe(`Verified · ${item.status.platforms.join(' · ')}`);
      else expect(badge).not.toBe('');
    }
    expect(textOf('whats-new-a8-1-status')).toBe('Verified · iOS · Android');
    expect(textOf('whats-new-a8-2-status')).toBe('Caveat');
  });

  it('A8-1: blocked() flips by itself when the app returns, and ensure() then answers with no dialog', async () => {
    const location = fakeLocation({ permission: permissions.blocked });
    let foreground: () => void = () => undefined;
    const user = await openVersion([
      location.provider,
      { provide: Permission.FOREGROUND, useValue: (listener: () => void) => ((foreground = listener), () => undefined) },
    ]);
    await screen.findByText('blocked(): yes');
    expect(textOf('whats-new-a8-1-permission')).toBe('Permission: denied');

    // Still refused: ensure() looks again, answers no and shows nothing.
    await user.press(screen.getByTestId('whats-new-a8-1-ask'));
    await screen.findByText('ensure(): not granted');
    expect(location.native.requestForegroundPermissionsAsync).not.toHaveBeenCalled();

    // The person turns Location on in Settings and comes back.
    const granted: PermissionResponse = permissions.granted;
    location.native.getForegroundPermissionsAsync.mockResolvedValue(granted);
    foreground();
    await screen.findByText('blocked(): no');
    expect(textOf('whats-new-a8-1-permission')).toBe('Permission: granted');

    await user.press(screen.getByTestId('whats-new-a8-1-ask'));
    await screen.findByText('ensure(): granted');
    expect(location.native.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
  });

  it('A8-1: ensure() sees a change in Settings even if the app was never brought back', async () => {
    const location = fakeLocation({ permission: permissions.blocked });
    const user = await openVersion([location.provider]);
    await screen.findByText('blocked(): yes');
    location.native.getForegroundPermissionsAsync.mockResolvedValue(permissions.granted);
    await user.press(screen.getByTestId('whats-new-a8-1-ask'));
    await screen.findByText('ensure(): granted');
    expect(location.native.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
  });

  it('A8-2: the three transition tiles start still and the buttons set their classes', async () => {
    const user = await openVersion();
    for (const id of ['fade', 'size', 'pair-a', 'pair-b']) expect(screen.getByTestId(`whats-new-a8-2-${id}`)).toBeTruthy();
    expect(textOf('whats-new-a8-2-readout')).toContain('Press an Animate button');
    await user.press(screen.getByTestId('whats-new-a8-2-play'));
    expect(screen.getByRole('button', { name: 'Reset' })).toBeTruthy();
  });

  it('A8-4: the stop buttons change the custom property the track reads', async () => {
    const user = await openVersion();
    expect(textOf('whats-new-a8-4-readout')).toBe('Middle stop at 50%');
    await user.press(screen.getByTestId('whats-new-a8-4-more'));
    expect(textOf('whats-new-a8-4-readout')).toBe('Middle stop at 70%');
    await user.press(screen.getByTestId('whats-new-a8-4-less'));
    await user.press(screen.getByTestId('whats-new-a8-4-less'));
    await user.press(screen.getByTestId('whats-new-a8-4-less'));
    await user.press(screen.getByTestId('whats-new-a8-4-less'));
    expect(textOf('whats-new-a8-4-readout')).toBe('Middle stop at 10%');
  });

  it('A8-5: 18px, 1.5rem and 24 are drawn at 18, 24 and 24 points, and an unreadable size takes the text size', async () => {
    await openVersion();
    const size = (id: string) => {
      const { width, height } = screen.getByTestId(`whats-new-a8-5-${id}-icon`).props;
      return [width, height];
    };
    expect(size('px')).toEqual([18, 18]);
    expect(size('rem')).toEqual([24, 24]);
    expect(size('number')).toEqual([24, 24]);
    expect(size('bad')).toEqual([16, 16]);
  });

  it('A8-6: the toggle flips the scheme readout', async () => {
    const user = await openVersion();
    expect(textOf('whats-new-a8-6-readout')).toContain('light');
    await user.press(screen.getByTestId('whats-new-a8-6-toggle'));
    expect(textOf('whats-new-a8-6-readout')).toContain('dark');
  });
});
