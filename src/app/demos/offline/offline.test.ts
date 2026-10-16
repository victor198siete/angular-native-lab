import { formatDate } from '@angular/common';
import { cleanup, fireEvent, screen, userEvent, waitFor } from '@ng-native/testing';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../rewards/features/testing.ts';
import { textOf } from '../lists/testing.ts';
import { FakeServer } from './core/fake-api.ts';
import { offlineDb } from './core/offline-db.ts';
import { fakeDialogs, fakeNetwork, fastConfig, NO_NETWORK, steppingClock, useMemoryDatabase } from './testing.ts';

useMemoryDatabase();

interface Options {
  network?: ReturnType<typeof fakeNetwork>;
  dialogs?: ReturnType<typeof fakeDialogs>;
  clock?: ReturnType<typeof steppingClock>;
}

/** Opens the demo as a phone would: the screen up, and the database whatever the last "run" left in it. */
async function open(options: Options = {}) {
  const network = options.network ?? fakeNetwork();
  const dialogs = options.dialogs ?? fakeDialogs();
  const clock = options.clock ?? steppingClock();
  const view = await renderApp('offline', [network.provider, dialogs.provider, clock.provider, fastConfig()]);
  await screen.findByTestId('offline-heading');
  return { network, dialogs, clock, view, server: view.componentRef.injector.get(FakeServer), user: userEvent.setup() };
}

const clockText = (at: number) => formatDate(at, 'HH:mm:ss', 'en');
const flip = (id: string, on: boolean) => fireEvent(screen.getByTestId(id), 'change', { value: on });
const synced = () => textOf('offline-synced');
/** Waits until the first catalog row has arrived, from the fake API or from SQLite. */
const catalogShown = () => screen.findByTestId('offline-redeem-1');

describe('cache (S2)', () => {
  it('shows fresh data online, and the same data with the time of the last sync when the network goes', async () => {
    const { network } = await open();
    await catalogShown();
    expect(textOf('offline-state')).toBe('Online');
    expect(synced()).toMatch(/^Last synced at \d\d:\d\d:\d\d$/);
    const at = synced().replace('Last synced at ', '');
    expect(at).toBe(clockText(Date.UTC(2026, 9, 15, 9, 30, 0))); // the first read of the stepping clock

    network.set(NO_NETWORK);
    await waitFor(() => expect(textOf('offline-state')).toBe('Offline'));
    expect(synced()).toBe(`Showing saved data from ${at}`);
    expect(screen.getByTestId('offline-redeem-1')).toBeTruthy(); // never an empty screen when there is a cache
    expect(screen.queryByTestId('offline-catalog-empty')).toBeNull();
  });

  it('a cold start with no network shows what SQLite saved, with its time', async () => {
    const first = await open();
    await catalogShown();
    const at = synced().replace('Last synced at ', '');
    const title = first.view.getByTestId('offline-redeem-1').props['accessibilityLabel'];
    cleanup(); // the app is closed

    await open({ network: fakeNetwork(NO_NETWORK) });
    await catalogShown();
    expect(textOf('offline-state')).toBe('Offline');
    expect(synced()).toBe(`Showing saved data from ${at}`);
    expect(screen.getByTestId('offline-redeem-1').props['accessibilityLabel']).toBe(title);
    expect(screen.queryByTestId('offline-history-empty')).toBeNull();
  });

  it('with no network and nothing saved, it says so instead of loading forever', async () => {
    await open({ network: fakeNetwork(NO_NETWORK) });
    expect(await screen.findByTestId('offline-catalog-empty')).toBeTruthy();
    expect(synced()).toMatch(/^Nothing saved yet/);
  });
});

describe('queue (S3)', () => {
  it('a redemption made offline is pending, survives closing the app, and is sent once when the network returns', async () => {
    const first = await open({ network: fakeNetwork(NO_NETWORK) });
    // Offline from the start there is no catalog: go online once to download it, then lose the network.
    first.network.set({ connected: true, type: 'wifi', reachable: true });
    await catalogShown();
    first.network.set(NO_NETWORK);
    await waitFor(() => expect(textOf('offline-state')).toBe('Offline'));

    await first.user.press(screen.getByTestId('offline-redeem-1'));
    await first.user.press(screen.getByTestId('offline-redeem-2'));
    await waitFor(() => expect(textOf('offline-pending')).toBe('Pending: 2'));
    expect(textOf('offline-badge-1')).toBe('Pending');
    expect(first.server.attempts).toEqual([]); // nothing left the phone

    cleanup(); // the app is closed, with two redemptions in the queue
    const second = await open({ network: fakeNetwork(NO_NETWORK) });
    await waitFor(() => expect(textOf('offline-pending')).toBe('Pending: 2'));

    second.network.set({ connected: true, type: 'wifi', reachable: true });
    await waitFor(() => expect(textOf('offline-sent')).toBe('Sent: 2'));
    expect(textOf('offline-pending')).toBe('Pending: 0');
    expect(textOf('offline-badge-2')).toBe('Sent');
    // The second app run has a server of its own (a new injector): each id reached it exactly once.
    expect(second.server.attempts).toHaveLength(2);
    expect(new Set(second.server.accepted).size).toBe(2);

    // A third run finds them sent in SQLite and sends nothing more.
    cleanup();
    const third = await open();
    await waitFor(() => expect(textOf('offline-sent')).toBe('Sent: 2'));
    await catalogShown();
    expect(third.server.attempts).toEqual([]);
  });

  it('a 409 on an id the server already has counts as sent', async () => {
    const { network, user, server } = await open();
    await catalogShown();
    network.set(NO_NETWORK);
    await waitFor(() => expect(textOf('offline-state')).toBe('Offline'));
    await user.press(screen.getByTestId('offline-redeem-1'));
    await waitFor(() => expect(textOf('offline-pending')).toBe('Pending: 1'));

    // The earlier answer was lost: the server has the id, the phone does not know it.
    const db = await offlineDb.ready();
    const row = await db.getFirstAsync<{ id: string }>('SELECT id FROM redeem_queue');
    server.accepted.push(row!.id);

    network.set({ connected: true, type: 'wifi', reachable: true });
    await waitFor(() => expect(textOf('offline-sent')).toBe('Sent: 1'));
    expect(server.attempts).toEqual([row!.id]);
    expect(server.accepted).toEqual([row!.id]); // not accepted twice
  });

  it('a 500 leaves the redemption queued and tries again until the server answers', async () => {
    const { user, server } = await open();
    await catalogShown();
    server.failing.set(true);
    await user.press(screen.getByTestId('offline-redeem-1'));

    expect(await screen.findByTestId('offline-error')).toBeTruthy();
    expect(textOf('offline-pending')).toBe('Pending: 1');
    await waitFor(() => expect(server.attempts.length).toBeGreaterThan(1)); // retried on its own
    expect(server.accepted).toEqual([]);

    server.failing.set(false);
    await waitFor(() => expect(textOf('offline-sent')).toBe('Sent: 1'));
    expect(server.accepted).toHaveLength(1);
    expect(screen.queryByTestId('offline-error')).toBeNull();
  });
});

describe('simulate offline (S4)', () => {
  it('the lab switch behaves as having no network: nothing is sent until it is turned off', async () => {
    const { user, server } = await open(); // the network is up throughout
    await catalogShown();

    flip('offline-sim', true);
    await waitFor(() => expect(textOf('offline-state')).toBe('Offline'));
    expect(synced()).toMatch(/^Showing saved data from /);
    await user.press(screen.getByTestId('offline-redeem-1'));
    await waitFor(() => expect(textOf('offline-pending')).toBe('Pending: 1'));
    expect(server.attempts).toEqual([]);

    flip('offline-sim', false);
    await waitFor(() => expect(textOf('offline-sent')).toBe('Sent: 1'));
    expect(textOf('offline-state')).toBe('Online');
    expect(server.accepted).toHaveLength(1);
  });
});

describe('clear local data (S5)', () => {
  it('asks first; cancelling keeps everything, confirming empties the database', async () => {
    const dialogs = fakeDialogs('cancel');
    const { network, user } = await open({ dialogs });
    await catalogShown();
    network.set(NO_NETWORK);
    await waitFor(() => expect(textOf('offline-state')).toBe('Offline'));
    await user.press(screen.getByTestId('offline-redeem-1'));
    await waitFor(() => expect(textOf('offline-pending')).toBe('Pending: 1'));

    await user.press(screen.getByTestId('offline-clear'));
    await waitFor(() => expect(dialogs.asked).toHaveLength(1));
    expect(dialogs.asked[0]!.title).toBe('Clear local data?');
    expect(textOf('offline-pending')).toBe('Pending: 1');
    expect(screen.getByTestId('offline-redeem-1')).toBeTruthy();

    dialogs.answer = 'confirm';
    await user.press(screen.getByTestId('offline-clear'));
    await screen.findByTestId('offline-catalog-empty');
    expect(textOf('offline-pending')).toBe('Pending: 0');
    expect(screen.getByTestId('offline-redemptions-empty')).toBeTruthy();
    expect(synced()).toMatch(/^Nothing saved yet/);

    const db = await offlineDb.ready();
    for (const table of ['reward', 'movement', 'meta', 'redeem_queue']) {
      expect(await db.getAllAsync(`SELECT * FROM ${table}`), table).toEqual([]);
    }
  });
});
