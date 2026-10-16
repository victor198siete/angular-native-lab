/**
 * Independent verification of the Offline demo (QA). Each test here describes a race found by
 * reading `core/offline.store.ts`; a failing test is the proof of the race, not a broken test.
 * Production code and the existing tests are untouched.
 */
import { cleanup, screen, userEvent, waitFor } from '@ng-native/testing';
import { MissingModuleError } from '@ng-native/expo';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderApp } from '../rewards/features/testing.ts';
import { textOf } from '../lists/testing.ts';
import { FakeServer } from './core/fake-api.ts';
import { offlineDb } from './core/offline-db.ts';
import { OfflineStore } from './core/offline.store.ts';
import { fakeDialogs, fakeNetwork, fastConfig, NO_NETWORK, ONLINE, steppingClock, useMemoryDatabase } from './testing.ts';

useMemoryDatabase();

/** The store of the screen on display, caught on its first call to `sync()` (the effect, or a press). */
let store: OfflineStore | null = null;
const realSync = OfflineStore.prototype.sync;
vi.spyOn(OfflineStore.prototype, 'sync').mockImplementation(function (this: OfflineStore) {
  store = this;
  return realSync.call(this);
});
afterEach(() => {
  store = null;
});

async function open(options: { network?: ReturnType<typeof fakeNetwork>; latencyMs?: number; retryMs?: number } = {}) {
  const network = options.network ?? fakeNetwork();
  const view = await renderApp('offline', [
    network.provider,
    fakeDialogs().provider,
    steppingClock().provider,
    fastConfig({ ...(options.latencyMs === undefined ? {} : { latencyMs: options.latencyMs }), ...(options.retryMs === undefined ? {} : { retryMs: options.retryMs }) }),
  ]);
  await screen.findByTestId('offline-heading');
  return { network, view, server: view.componentRef.injector.get(FakeServer), user: userEvent.setup() };
}

const catalogShown = () => screen.findByTestId('offline-redeem-1');
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Runs `hook` once, the moment the store's `persistFetched` transaction issues its second
 * statement (`DELETE FROM movement`), i.e. while that transaction is open. `withTransactionAsync`
 * is not exclusive in expo-sqlite (nor in `memoryDatabase()`), so anything started then shares or
 * collides with it.
 */
async function duringRefreshTransaction(hook: () => void) {
  const db = await offlineDb.ready();
  const runAsync = db.runAsync.bind(db);
  let armed = true;
  db.runAsync = (async (source: string, ...params: unknown[]) => {
    const result = await (runAsync as (s: string, ...p: unknown[]) => Promise<unknown>)(source, ...params);
    if (armed && source === 'DELETE FROM movement') {
      armed = false;
      hook();
    }
    return result;
  }) as typeof db.runAsync;
}

describe('clear() while a refresh is writing the cache', () => {
  it('still empties redeem_queue in SQLite, so a cleared redemption does not come back on the next launch', async () => {
    const { user } = await open();
    await catalogShown();
    await user.press(screen.getByTestId('offline-redeem-1'));
    await waitFor(() => expect(textOf('offline-sent')).toBe('Sent: 1'));
    await waitFor(() => expect(textOf('offline-synced')).toMatch(/^Last synced at /));

    await duringRefreshTransaction(() => void store!.clear());
    await user.press(screen.getByTestId('offline-sync-now'));
    await waitFor(() => expect(textOf('offline-sent')).toBe('Sent: 0'));
    await waitFor(() => expect(textOf('offline-synced')).toMatch(/^Last synced at /)); // the post-clear sync finished
    await sleep(50);

    const db = await offlineDb.ready();
    expect(await db.getAllAsync('SELECT id FROM redeem_queue'), 'redeem_queue after Clear').toEqual([]);

    cleanup(); // the app is closed and opened again
    await open({ network: fakeNetwork(NO_NETWORK) });
    await sleep(50);
    expect(textOf('offline-sent')).toBe('Sent: 0');
  });

  it('a redemption made offline after that clear is still in SQLite after a restart', async () => {
    const { user, network } = await open();
    await catalogShown();
    await user.press(screen.getByTestId('offline-redeem-1'));
    await waitFor(() => expect(textOf('offline-sent')).toBe('Sent: 1'));
    await waitFor(() => expect(textOf('offline-synced')).toMatch(/^Last synced at /));

    await duringRefreshTransaction(() => void store!.clear());
    await user.press(screen.getByTestId('offline-sync-now'));
    await waitFor(() => expect(textOf('offline-sent')).toBe('Sent: 0'));
    await waitFor(() => expect(textOf('offline-synced')).toMatch(/^Last synced at /));
    await sleep(50);

    network.set(NO_NETWORK);
    await waitFor(() => expect(textOf('offline-state')).toBe('Offline'));
    await user.press(screen.getByTestId('offline-redeem-2'));
    await waitFor(() => expect(textOf('offline-pending')).toBe('Pending: 1'));
    await sleep(20);

    cleanup(); // closed with one redemption waiting
    await open({ network: fakeNetwork(NO_NETWORK) });
    await sleep(50);
    expect(textOf('offline-pending'), 'the queued redemption survived the restart').toBe('Pending: 1');
  });
});

describe('a redemption made while clear() is deleting', () => {
  it('is kept in SQLite, not swept by the DELETE of the same transaction', async () => {
    const { network } = await open();
    await catalogShown();
    network.set(NO_NETWORK);
    await waitFor(() => expect(textOf('offline-state')).toBe('Offline'));
    const reward = store!.rewards()[0]!;

    // Clear confirmed, and a tap on Redeem lands before its DELETEs have finished.
    await Promise.all([store!.clear(), store!.redeem(reward)]);
    await waitFor(() => expect(textOf('offline-pending')).toBe('Pending: 1')); // the screen shows it queued

    const db = await offlineDb.ready();
    expect(await db.getAllAsync('SELECT id FROM redeem_queue'), 'the queued redemption in SQLite').toHaveLength(1);
  });
});

describe('leaving the screen', () => {
  it('stops retrying: a 500 that arrives after the screen is destroyed schedules no more attempts', async () => {
    const { user, server } = await open({ latencyMs: 40, retryMs: 20 });
    await catalogShown();
    server.failing.set(true);
    await user.press(screen.getByTestId('offline-redeem-1'));
    await sleep(5); // the POST is in flight
    const attemptsAtDestroy = server.attempts.length;
    const destroyed = store!;

    cleanup(); // the screen (and its injector) goes away mid-request
    await sleep(300);

    expect((destroyed as unknown as { retryTimer: unknown }).retryTimer, 'retry timer after destroy').toBeNull();
    expect(server.attempts.length, 'requests after destroy').toBeLessThanOrEqual(attemptsAtDestroy + 1);
  });
});

describe('leaving the screen, timers', () => {
  it('creates no retry timer when a 500 arrives after the screen is destroyed', async () => {
    const { user, server } = await open({ latencyMs: 40, retryMs: 777 });
    await catalogShown();
    server.failing.set(true);
    const timers = vi.spyOn(globalThis, 'setTimeout');
    try {
      await user.press(screen.getByTestId('offline-redeem-1'));
      await sleep(5); // the POST is in flight
      const attemptsAtDestroy = server.attempts.length;
      const retryTimers = () => timers.mock.calls.filter(([, ms]) => ms === 777).length;
      expect(retryTimers(), 'no retry yet: the 500 has not arrived').toBe(0);

      cleanup();
      await sleep(150); // the 500 arrives after the destroy
      expect(retryTimers(), 'retry timers created after destroy').toBe(0);
      expect(server.attempts.length).toBeLessThanOrEqual(attemptsAtDestroy + 1);
    } finally {
      timers.mockRestore();
    }
  });
});

describe('reconnection churn', () => {
  it('sends each queued redemption exactly once across a quick off/on/off/on', async () => {
    const { network, user, server } = await open({ latencyMs: 15 });
    await catalogShown();
    network.set(NO_NETWORK);
    await waitFor(() => expect(textOf('offline-state')).toBe('Offline'));
    await user.press(screen.getByTestId('offline-redeem-1'));
    await user.press(screen.getByTestId('offline-redeem-2'));
    await user.press(screen.getByTestId('offline-redeem-3'));
    await waitFor(() => expect(textOf('offline-pending')).toBe('Pending: 3'));

    for (let i = 0; i < 4; i++) {
      network.set(ONLINE);
      await sleep(8);
      network.set(NO_NETWORK);
      await sleep(3);
    }
    network.set(ONLINE);
    await waitFor(() => expect(textOf('offline-sent')).toBe('Sent: 3'));
    expect(new Set(server.accepted).size).toBe(3);
    expect(server.accepted).toHaveLength(3);
  });

  it('a 500, then offline, then online with the server healthy: sent once, error gone', async () => {
    const { network, user, server } = await open({ retryMs: 1000 });
    await catalogShown();
    server.failing.set(true);
    await user.press(screen.getByTestId('offline-redeem-1'));
    await screen.findByTestId('offline-error');
    network.set(NO_NETWORK);
    await waitFor(() => expect(textOf('offline-state')).toBe('Offline'));
    server.failing.set(false);
    network.set(ONLINE);
    await waitFor(() => expect(textOf('offline-sent')).toBe('Sent: 1'));
    expect(server.accepted).toHaveLength(1);
    expect(screen.queryByTestId('offline-error')).toBeNull();
  });
});

describe('a failing SQLite', () => {
  it('a real error from ready() is kept in storageError and shown; a missing module is not', async () => {
    const ready = vi.spyOn(offlineDb, 'ready').mockRejectedValue(new Error('disk full'));
    try {
      await open();
      await screen.findByTestId('offline-storage-error');
      expect(store!.storageError()).toBe('disk full');
      cleanup();

      ready.mockRejectedValue(new MissingModuleError('expo-sqlite', 'ios'));
      await open();
      await sleep(30);
      expect(store!.storageError()).toBeNull();
      expect(screen.queryByTestId('offline-storage-error')).toBeNull();
    } finally {
      ready.mockRestore();
    }
  });
});
