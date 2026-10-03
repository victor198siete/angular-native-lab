import { provideNativeRouter } from '@ng-native/router';
import { fireEvent, render, screen, userEvent } from '@ng-native/testing';
import { describe, expect, it } from 'vitest';
import { routes } from '../../../app.routes.ts';
import { MOCK_MOVEMENTS } from '../core/mocks/index.ts';
import { renderApp } from '../features/testing.ts';
import { voucherCode } from '../shared/voucher-code.ts';
import { fakeBiometrics, fakeKeychain } from './testing.ts';
import { LOCK_ON_LAUNCH_KEY } from './vault-lock.ts';
import { VaultPanel } from './vault-panel.ts';

const newestRedeem = [...MOCK_MOVEMENTS]
  .filter((m) => m.type === 'redeem')
  .sort((a, b) => b.date.localeCompare(a.date))[0];

async function renderPanel(bio = fakeBiometrics(), keychain = fakeKeychain()) {
  await render(VaultPanel, { providers: [bio.provider, keychain.provider, provideNativeRouter(routes)] });
  await screen.findByTestId('vault-lock-switch');
  return { bio, keychain, user: userEvent.setup() };
}

/** What the native switch sends when the person flips it. */
const flip = (on: boolean) => fireEvent(screen.getByTestId('vault-lock-switch'), 'change', { value: on });

describe('vault codes', () => {
  it('are masked until Face ID passes, then show the real voucher codes', async () => {
    const { bio, user } = await renderPanel();
    expect(screen.getAllByText('LAB-••••-••••').length).toBeGreaterThan(0);
    expect(screen.queryByText(voucherCode(newestRedeem.id))).toBeNull();

    await user.press(await screen.findByRole('button', { name: 'Show with Face ID' }));

    expect(await screen.findByText(voucherCode(newestRedeem.id))).toBeTruthy();
    expect(bio.native.authenticateAsync).toHaveBeenCalledOnce();
    expect(screen.queryByTestId('vault-reveal')).toBeNull();
  });

  it('stay masked when the person cancels, and say so', async () => {
    const { user } = await renderPanel(fakeBiometrics([{ success: false, error: 'user_cancel' }]));
    await user.press(await screen.findByRole('button', { name: 'Show with Face ID' }));

    expect(await screen.findByText('Cancelled. Try again when you are ready.')).toBeTruthy();
    expect(screen.queryByText(voucherCode(newestRedeem.id))).toBeNull();
  });
});

describe('lock on launch switch', () => {
  it('asks for Face ID before turning on, and stays off if that fails', async () => {
    const { keychain } = await renderPanel(fakeBiometrics([{ success: false, error: 'lockout' }]));
    await screen.findByText('Ask for Face ID when the app opens');
    await flip(true);

    expect(await screen.findByText(/Too many attempts/)).toBeTruthy();
    expect(keychain.data.get(LOCK_ON_LAUNCH_KEY)).toBeUndefined();
  });

  it('turns on after Face ID passes and is kept in the keychain', async () => {
    const { keychain } = await renderPanel();
    await screen.findByText('Ask for Face ID when the app opens');
    await flip(true);

    await expect.poll(() => keychain.data.get(LOCK_ON_LAUNCH_KEY)).toBe('true');
  });

  it('is disabled, and says why, on a phone with no biometrics', async () => {
    await renderPanel(fakeBiometrics([], { hardware: false, enrolled: false }));

    expect(await screen.findByTestId('vault-lock-unavailable')).toBeTruthy();
    expect(screen.getByText('Ask for biometrics when the app opens')).toBeTruthy();
    expect(screen.getByTestId('vault-lock-switch').props['accessibilityState']).toMatchObject({ disabled: true });
  });
});

describe('lock screen', () => {
  it('with the lock on, the app opens on the lock screen and Face ID lets it in', async () => {
    const bio = fakeBiometrics([{ success: false, error: 'user_cancel' }, { success: true }]);
    await renderApp(undefined, [bio.provider, fakeKeychain({ [LOCK_ON_LAUNCH_KEY]: true }).provider]);

    expect(await screen.findByTestId('lock-title')).toBeTruthy();
    // It asks once by itself; this first answer is a cancel.
    expect(await screen.findByText('Cancelled. Try again when you are ready.')).toBeTruthy();
    expect(screen.queryByText('Recent activity')).toBeNull();

    await userEvent.setup().press(screen.getByTestId('lock-unlock'));
    expect(await screen.findByText('Recent activity')).toBeTruthy();
  });

  it('with the lock off, the app opens on the wallet as before', async () => {
    await renderApp(undefined, [fakeBiometrics().provider, fakeKeychain().provider]);
    expect(await screen.findByText('Recent activity')).toBeTruthy();
    expect(screen.queryByTestId('lock-title')).toBeNull();
  });

  it('with no usable sensor, offers to turn the lock off instead of trapping the person', async () => {
    const keychain = fakeKeychain({ [LOCK_ON_LAUNCH_KEY]: true });
    await renderApp(undefined, [fakeBiometrics([], { hardware: false }).provider, keychain.provider]);

    await userEvent.setup().press(await screen.findByTestId('lock-turn-off'));
    expect(await screen.findByText('Recent activity')).toBeTruthy();
    expect(keychain.data.get(LOCK_ON_LAUNCH_KEY)).toBe('false');
  });
});
