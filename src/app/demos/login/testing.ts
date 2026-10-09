import { withInterceptors, type HttpInterceptorFn } from '@angular/common/http';
import type { Provider } from '@angular/core';
import { provideNativeHttpClient } from '@ng-native/platform/http';
import { fakeBiometrics, fakeKeychain } from '../rewards/vault/testing.ts';
import { authInterceptor } from './core/auth.interceptor.ts';
import { encodeToken } from './core/mock-auth/fake-jwt.ts';
import { AUTH_CLOCK, DEFAULT_MOCK_AUTH_CONFIG, MOCK_AUTH_CONFIG, type MockAuthConfig } from './core/mock-auth/mock-auth.config.ts';
import { mockAuthServer } from './core/mock-auth/mock-auth.server.ts';
import { SEED_USER } from './core/mock-auth/seed.ts';
import { TOKENS_KEY } from './core/session.ts';

export { fakeBiometrics, fakeKeychain };

/** A clock the test moves by hand. Starts at a round, arbitrary instant. */
export function fakeClock(start = Date.UTC(2026, 9, 9, 12, 0, 0)) {
  let now = start;
  return {
    now: () => now,
    advance: (seconds: number) => void (now += seconds * 1000),
    provider: { provide: AUTH_CLOCK, useValue: () => now } as Provider,
  };
}

/**
 * The app's HTTP setup as `main.ts` builds it - the real client, the auth interceptor and the mock
 * server - with a recorder between the last two, so a test can read the exact requests that reached
 * the "network" (`METHOD /path`). No latency, and the clock is the test's.
 */
export function fakeBackend(clock = fakeClock(), config: Partial<MockAuthConfig> = {}) {
  const requests: string[] = [];
  const recorder: HttpInterceptorFn = (req, next) => {
    requests.push(`${req.method} ${req.url.replace(/^https:\/\/api\.lab\.invalid/, '')}`);
    return next(req);
  };
  return {
    clock,
    requests,
    providers: [
      provideNativeHttpClient(withInterceptors([authInterceptor, recorder, mockAuthServer])),
      clock.provider,
      { provide: MOCK_AUTH_CONFIG, useValue: { ...DEFAULT_MOCK_AUTH_CONFIG, latencyMs: 0, ...config } },
    ] as Provider[],
  };
}

/** A token pair the mock server accepts, as an earlier run of the app would have left in the keychain. */
export function storedTokens(now: number, accessTtl = 20, refreshTtl = 7 * 24 * 3600) {
  const iat = Math.floor(now / 1000);
  const claims = { sub: SEED_USER.id, email: SEED_USER.email, iat };
  return {
    accessToken: encodeToken({ ...claims, exp: iat + accessTtl, typ: 'access', jti: 'stored-a' }),
    refreshToken: encodeToken({ ...claims, exp: iat + refreshTtl, typ: 'refresh', jti: 'stored-r' }),
  };
}

export { TOKENS_KEY };
