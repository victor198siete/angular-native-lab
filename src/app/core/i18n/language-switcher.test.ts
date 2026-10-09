import { LOCALE_ID } from '@angular/core';
import { provideNativeRouter } from '@ng-native/router';
import { render, screen, userEvent } from '@ng-native/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { routes } from '../../app.routes.ts';
import { ANIMATE_NUMBERS } from '../../demos/rewards/shared/animated-number.ts';
import { WalletScreen } from '../../demos/rewards/features/wallet/wallet.screen.ts';
import { LANGUAGE_RESTART, STILL_HERE_MS, reloadWithFallback } from './language-switcher.ts';

async function renderWallet(localeId: string) {
  const restart = { save: vi.fn(async () => {}), reload: vi.fn(async () => {}) };
  await render(WalletScreen, {
    providers: [
      { provide: LOCALE_ID, useValue: localeId },
      { provide: LANGUAGE_RESTART, useValue: restart },
      { provide: ANIMATE_NUMBERS, useValue: false },
      provideNativeRouter(routes),
    ],
  });
  return restart;
}

it('offers Spanish from English, saves the choice and then reloads', async () => {
  const restart = await renderWallet('en-US');
  const toggle = screen.getByRole('button', { name: 'Español' });
  expect(screen.getByText('ES')).toBeTruthy();

  await userEvent.setup().press(toggle);

  expect(restart.save).toHaveBeenCalledWith('es');
  expect(restart.reload).toHaveBeenCalledOnce();
  expect(restart.save.mock.invocationCallOrder[0]).toBeLessThan(restart.reload.mock.invocationCallOrder[0]);
});

it('offers English from Spanish', async () => {
  const restart = await renderWallet('es');
  await userEvent.setup().press(screen.getByRole('button', { name: 'English' }));

  expect(restart.save).toHaveBeenCalledWith('en');
});

describe('reloadWithFallback', () => {
  afterEach(() => vi.useRealTimers());

  it('reloads through Expo, and through React Native when the app is still running', async () => {
    vi.useFakeTimers();
    const expo = vi.fn(async () => {});
    const reactNative = vi.fn();

    await reloadWithFallback(expo, reactNative, 'why');
    expect(expo).toHaveBeenCalledWith('why');
    expect(reactNative).not.toHaveBeenCalled();

    // Expo Go on Android: Expo's resolved and the runtime is still here
    vi.advanceTimersByTime(STILL_HERE_MS);
    expect(reactNative).toHaveBeenCalledWith('why');
  });

  it('reloads through React Native at once when Expo rejects', async () => {
    const reactNative = vi.fn();
    await reloadWithFallback(async () => Promise.reject(new Error('no')), reactNative, 'why');
    expect(reactNative).toHaveBeenCalledWith('why');
  });
});
