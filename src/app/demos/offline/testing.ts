import type { Provider } from '@angular/core';
import { Dialogs, type NativeDialogs } from '@ng-native/device';
import { openDatabasesWith } from '@ng-native/expo/database';
import { memoryDatabase } from '@ng-native/testing';
import { afterEach, beforeEach } from 'vitest';
import { DEFAULT_OFFLINE_CONFIG, OFFLINE_CLOCK, OFFLINE_CONFIG, type OfflineConfig } from './core/offline-config.ts';
import { offlineDb } from './core/offline-db.ts';
import { fakeNetwork } from '../device/testing.ts';

export { fakeNetwork };

export const ONLINE = { connected: true, type: 'wifi', reachable: true } as const;
export const NO_NETWORK = { connected: false, type: 'none', reachable: false } as const;

/**
 * Points every `database()` at Node's in-memory SQLite for the test, and closes it after. The
 * database is a value of the module, so it outlives a render: that is what makes "close the app
 * and open it again" testable (`cleanup()`, then render again) without any rows being lost.
 */
export function useMemoryDatabase(): void {
  let restore: () => void;
  beforeEach(() => (restore = openDatabasesWith(() => memoryDatabase())));
  afterEach(async () => {
    await offlineDb.close();
    restore();
  });
}

/** A clock that moves one second on every read, so two syncs never show the same time. */
export function steppingClock(start = Date.UTC(2026, 9, 15, 9, 30, 0)) {
  let now = start - 1000;
  return {
    provider: { provide: OFFLINE_CLOCK, useValue: () => (now += 1000) } as Provider,
    peek: () => now,
  };
}

/** No latency and a quick retry: a test waits for outcomes, not for a delay. */
export const fastConfig = (config: Partial<OfflineConfig> = {}): Provider => ({
  provide: OFFLINE_CONFIG,
  useValue: { ...DEFAULT_OFFLINE_CONFIG, latencyMs: 0, retryMs: 30, ...config },
});

/** The platform's confirmation, answered by the test. `asked` records each dialog shown. */
export function fakeDialogs(answer: 'confirm' | 'cancel' = 'confirm') {
  const state = { answer, asked: [] as { title: string; message?: string }[] };
  const native: NativeDialogs = {
    platform: 'ios',
    alert: (title, message, buttons) => {
      state.asked.push({ title, ...(message === undefined ? {} : { message }) });
      const wantsCancel = state.answer === 'cancel';
      buttons.find((button) => (button.style === 'cancel') === wantsCancel)?.onPress?.();
    },
  };
  return Object.assign(state, { provider: { provide: Dialogs.SOURCE, useValue: native } as Provider });
}
