import { InjectionToken } from '@angular/core';

/** Where the mock server answers. `.invalid` is reserved (RFC 2606): it can never be a real host. */
export const API_BASE_URL = 'https://api.lab.invalid';

export interface MockAuthConfig {
  /** How long an access token lives. Short on purpose, so expiry is easy to show on camera. */
  readonly accessTtlSeconds: number;
  /** How long a refresh token lives. */
  readonly refreshTtlSeconds: number;
  /** Network-like delay added to every answer. */
  readonly latencyMs: number;
}

/** Edit `accessTtlSeconds` here for a longer or shorter demo, or provide this token with another value. */
export const DEFAULT_MOCK_AUTH_CONFIG: MockAuthConfig = {
  accessTtlSeconds: 20,
  refreshTtlSeconds: 7 * 24 * 60 * 60,
  latencyMs: 600,
};

export const MOCK_AUTH_CONFIG = new InjectionToken<MockAuthConfig>('MOCK_AUTH_CONFIG', {
  providedIn: 'root',
  factory: () => DEFAULT_MOCK_AUTH_CONFIG,
});

/**
 * "Now", in milliseconds. The mock server, the session and the countdown all read it, so a test
 * moves time by providing its own function instead of faking global timers.
 */
export const AUTH_CLOCK = new InjectionToken<() => number>('AUTH_CLOCK', {
  providedIn: 'root',
  factory: () => () => Date.now(),
});
