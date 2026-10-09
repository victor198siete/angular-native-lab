import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { screen, userEvent } from '@ng-native/testing';
import { firstValueFrom } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../rewards/features/testing.ts';
import { SEED_USER } from './core/mock-auth/seed.ts';
import { Session, TOKENS_KEY } from './core/session.ts';
import { fakeBackend, fakeBiometrics, fakeKeychain, storedTokens } from './testing.ts';

interface Options {
  bio?: ReturnType<typeof fakeBiometrics>;
  keychain?: ReturnType<typeof fakeKeychain>;
  backend?: ReturnType<typeof fakeBackend>;
}

async function open(deepLink: string, options: Options = {}) {
  const bio = options.bio ?? fakeBiometrics();
  const keychain = options.keychain ?? fakeKeychain();
  const backend = options.backend ?? fakeBackend();
  const { componentRef } = await renderApp(deepLink, [bio.provider, keychain.provider, ...backend.providers]);
  const injector = componentRef.injector;
  return { bio, keychain, backend, session: injector.get(Session), injector, user: userEvent.setup() };
}

async function signIn(user: ReturnType<typeof userEvent.setup>, email = SEED_USER.email, password: string = SEED_USER.password) {
  await user.type(screen.getByTestId('login-email'), email);
  await user.type(screen.getByTestId('login-password'), password);
  await user.press(screen.getByTestId('login-submit'));
}

const storedPair = (keychain: ReturnType<typeof fakeKeychain>) =>
  JSON.parse(keychain.data.get(TOKENS_KEY) ?? 'null') as { accessToken: string; refreshToken: string } | null;

describe('sign in', () => {
  it('a valid email and password open the account, with the profile from /me', async () => {
    const { user, backend, keychain } = await open('login');
    await screen.findByTestId('login-submit');
    await signIn(user);

    expect(await screen.findByTestId('account-name')).toBeTruthy();
    expect(screen.getByText('Ada Lovelace')).toBeTruthy();
    expect(screen.getByText(SEED_USER.email)).toBeTruthy();
    expect(backend.requests).toEqual(['POST /auth/login', 'GET /me']);
    expect(storedPair(keychain)?.refreshToken).toBeTruthy();
  });

  it('never writes the password to the keychain', async () => {
    const { user, keychain } = await open('login');
    await screen.findByTestId('login-submit');
    await signIn(user);
    await screen.findByTestId('account-name');

    expect(keychain.data.size).toBeGreaterThan(0);
    expect(JSON.stringify([...keychain.data])).not.toContain(SEED_USER.password);
  });

  it('wrong credentials stay on the form, say so, and store nothing', async () => {
    const { user, keychain } = await open('login');
    await screen.findByTestId('login-submit');
    await signIn(user, SEED_USER.email, 'not-the-password');

    expect(await screen.findByText('Wrong email or password.')).toBeTruthy();
    expect(screen.queryByTestId('account-name')).toBeNull();
    expect(keychain.data.size).toBe(0);
  });

  it('an empty form shows both errors and calls nothing', async () => {
    const { user, backend } = await open('login');
    await user.press(await screen.findByTestId('login-submit'));

    expect(await screen.findByText('Enter your email.')).toBeTruthy();
    expect(screen.getByText('Enter your password.')).toBeTruthy();
    expect(backend.requests).toEqual([]);
  });
});

describe('guard', () => {
  it('with no session, the account route goes to the login screen', async () => {
    await open('login/account');
    expect(await screen.findByTestId('login-heading')).toBeTruthy();
    expect(screen.queryByTestId('account-countdown')).toBeNull();
  });

  it('a refresh token left by an earlier run is not enough: the account stays closed until it is reopened', async () => {
    const backend = fakeBackend();
    const keychain = fakeKeychain({ [TOKENS_KEY]: storedTokens(backend.clock.now()) });
    await open('login/account', { backend, keychain, bio: fakeBiometrics([{ success: false, error: 'user_cancel' }]) });

    expect(await screen.findByTestId('login-heading')).toBeTruthy();
    expect(screen.queryByTestId('account-countdown')).toBeNull();
  });

  it('lets in once the session is signed in', async () => {
    const { user, injector } = await open('login');
    await screen.findByTestId('login-submit');
    await signIn(user);
    await screen.findByTestId('account-name');

    // Straight to the account route again, as a deep link would.
    await injector.get(Router).navigateByUrl('/login/account');
    expect(await screen.findByTestId('account-countdown')).toBeTruthy();
  });
});

describe('expired access token', () => {
  async function signedIn() {
    const context = await open('login');
    await screen.findByTestId('login-submit');
    await signIn(context.user);
    await screen.findByTestId('account-name');
    return context;
  }

  it('is refreshed and the request retried once, with the rotated pair stored', async () => {
    const { user, backend, keychain } = await signedIn();
    const before = storedPair(keychain)!;

    backend.clock.advance(25); // the access token lives 20 s
    await user.press(screen.getByTestId('account-call'));

    expect(await screen.findByText('Access token expired, refreshed, request retried')).toBeTruthy();
    expect(backend.requests).toEqual([
      'POST /auth/login', 'GET /me', // sign in and the profile
      'GET /me', 'POST /auth/refresh', 'GET /me', // expired, refreshed, retried
    ]);
    const after = storedPair(keychain)!;
    expect(after.accessToken).not.toBe(before.accessToken);
    expect(after.refreshToken).not.toBe(before.refreshToken);
    expect(screen.queryByTestId('account-call-error')).toBeNull();
  });

  it('concurrent 401s share one refresh call', async () => {
    const { backend, injector } = await signedIn();
    backend.requests.length = 0;
    backend.clock.advance(25);

    const http = injector.get(HttpClient);
    const calls = [1, 2, 3].map(() => firstValueFrom(http.get('https://api.lab.invalid/me')));
    await Promise.all(calls);

    expect(backend.requests.filter((r) => r === 'POST /auth/refresh')).toHaveLength(1);
    expect(backend.requests.filter((r) => r === 'GET /me')).toHaveLength(6);
  });

  it('a refresh the server refuses ends the session and goes back to the login screen', async () => {
    const { user, backend, keychain } = await signedIn();

    backend.clock.advance(8 * 24 * 3600); // past the refresh token too
    await user.press(screen.getByTestId('account-call'));

    expect(await screen.findByTestId('login-heading')).toBeTruthy();
    await expect.poll(() => keychain.data.has(TOKENS_KEY)).toBe(false);
    expect(screen.queryByTestId('login-faceid')).toBeNull();
  });
});

describe('Face ID', () => {
  async function reopen(results: Parameters<typeof fakeBiometrics>[0]) {
    const backend = fakeBackend();
    const stored = storedTokens(backend.clock.now());
    const keychain = fakeKeychain({ [TOKENS_KEY]: stored });
    const bio = fakeBiometrics(results);
    const context = await open('login', { backend, keychain, bio });
    return { ...context, stored };
  }

  it('asks once on arrival, and a pass trades the refresh token for a new pair and opens the account', async () => {
    const { bio, keychain, backend, stored } = await reopen([{ success: true }]);

    expect(await screen.findByTestId('account-name')).toBeTruthy();
    expect(bio.native.authenticateAsync).toHaveBeenCalledOnce();
    expect(backend.requests).toContain('POST /auth/refresh');
    expect(storedPair(keychain)?.refreshToken).not.toBe(stored.refreshToken);
  });

  it('names the sensor on the button', async () => {
    await reopen([{ success: false, error: 'user_cancel' }]);
    expect(await screen.findByText('Continue with Face ID')).toBeTruthy();
  });

  it('a cancel shows the platform reason and leaves the password form as the way in', async () => {
    const { user, keychain } = await reopen([{ success: false, error: 'user_cancel' }]);

    expect(await screen.findByText('Cancelled. Try again when you are ready.')).toBeTruthy();
    expect(screen.getByTestId('login-email')).toBeTruthy();
    expect(screen.queryByTestId('account-name')).toBeNull();
    expect(keychain.data.has(TOKENS_KEY)).toBe(true);

    await signIn(user);
    expect(await screen.findByTestId('account-name')).toBeTruthy();
  });

  it('puts the platform error inside the sentence, verbatim', async () => {
    await reopen([{ success: false, error: 'unknown: -1000' }]);
    expect(await screen.findByText('Could not verify it is you (unknown: -1000).')).toBeTruthy();
  });

  it('is not offered with no stored session, or with no sensor', async () => {
    await open('login');
    await screen.findByTestId('login-submit');
    expect(screen.queryByTestId('login-faceid')).toBeNull();
  });

  it('is not offered on a phone with no sensor', async () => {
    const backend = fakeBackend();
    const keychain = fakeKeychain({ [TOKENS_KEY]: storedTokens(backend.clock.now()) });
    const bio = fakeBiometrics([], { hardware: false });
    await open('login', { backend, keychain, bio });
    await screen.findByTestId('login-submit');
    expect(screen.queryByTestId('login-faceid')).toBeNull();
    expect(bio.native.authenticateAsync).not.toHaveBeenCalled();
  });

  it('Lock keeps the refresh token and returns to the login screen with Face ID', async () => {
    const { user, keychain, bio } = await open('login');
    await screen.findByTestId('login-submit');
    await signIn(user);
    await screen.findByTestId('account-name');

    await user.press(screen.getByTestId('account-lock'));

    // Face ID asks by itself again on arrival and passes.
    expect(await screen.findByTestId('account-name')).toBeTruthy();
    expect(bio.native.authenticateAsync).toHaveBeenCalledOnce();
    expect(keychain.data.has(TOKENS_KEY)).toBe(true);
    expect(screen.getByText('Locked, refresh token kept')).toBeTruthy();
  });
});

describe('log out', () => {
  it('clears the keychain and returns to an empty form with no Face ID', async () => {
    const { user, keychain, backend } = await open('login');
    await screen.findByTestId('login-submit');
    await signIn(user);
    await screen.findByTestId('account-name');

    await user.press(screen.getByTestId('account-logout'));

    expect(await screen.findByTestId('login-heading')).toBeTruthy();
    expect(keychain.data.has(TOKENS_KEY)).toBe(false);
    expect(backend.requests).toContain('POST /auth/logout');
    expect(screen.queryByTestId('login-faceid')).toBeNull();
    expect(screen.getByTestId('login-email').props['value'] ?? '').toBe('');
    expect(screen.getByTestId('login-password').props['value'] ?? '').toBe('');
  });
});
