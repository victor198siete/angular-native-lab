import { InjectionToken } from '@angular/core';

/** Where the fake API answers. `.invalid` is reserved (RFC 2606): it can never be a real host. */
export const API_URL = 'https://offline.lab.invalid';

export interface OfflineConfig {
  /** Network-like delay added to every answer that reaches the "server". */
  readonly latencyMs: number;
  /** How long to wait before trying the queue again after the server answered with an error. */
  readonly retryMs: number;
  /** How many rewards and movements the fake API serves. */
  readonly pageSize: number;
}

export const DEFAULT_OFFLINE_CONFIG: OfflineConfig = { latencyMs: 500, retryMs: 4000, pageSize: 8 };

export const OFFLINE_CONFIG = new InjectionToken<OfflineConfig>('OFFLINE_CONFIG', {
  providedIn: 'root',
  factory: () => DEFAULT_OFFLINE_CONFIG,
});

/** "Now", in milliseconds. The store stamps its syncs and queued redemptions with it, so a test moves time. */
export const OFFLINE_CLOCK = new InjectionToken<() => number>('OFFLINE_CLOCK', {
  providedIn: 'root',
  factory: () => () => Date.now(),
});
