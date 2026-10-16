import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Service, computed, effect, inject, signal, untracked, type Signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type { Movement, Reward } from '../../rewards/core/models/index.ts';
import { Connectivity } from './connectivity.ts';
import type { RedeemRequest } from './fake-api.ts';
import { API_URL, OFFLINE_CLOCK, OFFLINE_CONFIG } from './offline-config.ts';
import { offlineDb } from './offline-db.ts';

export type RedeemStatus = 'pending' | 'sent';

/** A redemption made on this phone: `pending` until the server has it, then `sent`. */
export interface RedeemEntry {
  readonly seq: number;
  /** The idempotency key. One per redemption, made when the person taps Redeem. */
  readonly id: string;
  readonly rewardId: string;
  readonly title: string;
  readonly points: number;
  readonly createdAt: number;
  readonly status: RedeemStatus;
  readonly sentAt: number | null;
}

/** Row shapes as SQLite returns them (snake_case). */
interface RewardRow {
  id: string;
  title: string;
  partner: string;
  category: Reward['category'];
  cost_points: number;
  description: string;
  stock: number | null;
  icon: Reward['icon'];
}
interface QueueRow {
  seq: number;
  id: string;
  reward_id: string;
  title: string;
  points: number;
  created_at: number;
  status: RedeemStatus;
  sent_at: number | null;
}

const nextId = (now: number) => `rd-${now.toString(36)}${Math.random().toString(36).slice(2, 8)}`;

/**
 * The offline half of the demo. The running app reads and writes signals; SQLite is the copy that
 * survives a restart. That order is the one the Working offline guide gives: `Database` throws
 * without `expo-sqlite`, so every call to it has its own try/catch, and losing a write to SQLite
 * loses durability, never the redemption itself.
 *
 *  1. The cache is on screen first (`loadFromCache`), before any request.
 *  2. Online, the queue is sent, then fresh data replaces the cache.
 *  3. Offline, nothing changes on screen: a failed request leaves the cache as it was.
 *  4. A redemption is queued in memory and in `redeem_queue`, and sent when there is a connection.
 *
 * Provided by the screen, not the root: it asks for the `HttpClient` of the route, the one the
 * fake API answers.
 */
@Service({ autoProvided: false })
export class OfflineStore {
  private readonly http = inject(HttpClient);
  private readonly connectivity = inject(Connectivity);
  private readonly clock = inject(OFFLINE_CLOCK);
  private readonly config = inject(OFFLINE_CONFIG);

  private readonly rewardList = signal<Reward[]>([]);
  private readonly movementList = signal<Movement[]>([]);
  private readonly entries = signal<RedeemEntry[]>([]);
  private readonly synced = signal<number | null>(null);
  private readonly busy = signal(false);
  private readonly serverError = signal(false);

  readonly rewards: Signal<Reward[]> = this.rewardList.asReadonly();
  readonly movements: Signal<Movement[]> = this.movementList.asReadonly();
  /** Newest first. */
  readonly redemptions: Signal<RedeemEntry[]> = computed(() => [...this.entries()].sort((a, b) => b.seq - a.seq));
  readonly pendingCount = computed(() => this.entries().filter((e) => e.status === 'pending').length);
  readonly sentCount = computed(() => this.entries().filter((e) => e.status === 'sent').length);
  /** Milliseconds of the last successful refresh, or `null` if this phone never got data. */
  readonly lastSync: Signal<number | null> = this.synced.asReadonly();
  readonly syncing: Signal<boolean> = this.busy.asReadonly();
  /** The server answered with an error and the queue is waiting to try again. */
  readonly hasServerError: Signal<boolean> = this.serverError.asReadonly();
  readonly online = this.connectivity.online;
  /** Something is on screen from a previous run or fetch. */
  readonly hasCache = computed(() => this.rewardList().length > 0 || this.movementList().length > 0);

  /** Resolves once the cache has been read; a sync waits for it so it cannot be overwritten by older rows. */
  readonly loaded: Promise<void>;

  private seq = 0;
  private flushing = false;
  private syncRunning = false;
  /** A sync was asked for while one was running: it runs once more when that one ends, so nothing queued meanwhile waits. */
  private syncAgain = false;
  /** Bumped by `clear()`: an answer that started before it is not allowed to repopulate the cache. */
  private generation = 0;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.loaded = this.loadFromCache();

    // `online` flips true when a network of any kind appears (or the lab switch goes off). The
    // effect reads only that; the work it starts runs untracked.
    effect(() => {
      if (this.online()) untracked(() => void this.sync());
    });

    inject(DestroyRef).onDestroy(() => this.cancelRetry());
  }

  /** Queue a redemption and, with a connection, send it. The id is made here, once, and never again. */
  async redeem(reward: Reward): Promise<void> {
    await this.loaded;
    const now = this.clock();
    const entry: RedeemEntry = {
      seq: ++this.seq,
      id: nextId(now),
      rewardId: reward.id,
      title: reward.title,
      points: reward.costPoints,
      createdAt: now,
      status: 'pending',
      sentAt: null,
    };
    this.entries.update((all) => [...all, entry]);
    await this.persistEntry(entry);
    if (this.online()) void this.sync();
  }

  /** The button, the retry timer and a reconnection: send the queue, then refresh. Safe to call at any moment. */
  async sync(): Promise<void> {
    await this.loaded;
    if (!this.online()) return;
    if (this.syncRunning) {
      this.syncAgain = true;
      return;
    }
    this.syncRunning = true;
    this.busy.set(true);
    this.cancelRetry();
    try {
      if (await this.flush()) await this.refresh();
    } finally {
      this.syncRunning = false;
      this.busy.set(false);
    }
    if (this.syncAgain) {
      this.syncAgain = false;
      await this.sync();
    }
  }

  /** Forget everything saved on this phone: cache, queue and sync time. The next sync starts from nothing. */
  async clear(): Promise<void> {
    this.generation++;
    this.cancelRetry();
    this.serverError.set(false);
    this.rewardList.set([]);
    this.movementList.set([]);
    this.entries.set([]);
    this.synced.set(null);
    this.seq = 0;
    try {
      const db = await offlineDb.ready();
      await db.withTransactionAsync(async () => {
        for (const table of ['reward', 'movement', 'meta', 'redeem_queue']) await db.runAsync(`DELETE FROM ${table}`);
      });
    } catch {
      // No SQLite on this platform: there was nothing saved to forget.
    }
    if (this.online()) void this.sync();
  }

  /**
   * Sends the pending entries oldest first, one request each, and stops at the first failure so a
   * stuck entry is never overtaken by a later one. The loop re-reads the queue, so an entry added
   * while it runs is sent in the same pass. `flushing` keeps two passes from sending the same entry.
   * Returns whether the queue is empty.
   */
  private async flush(): Promise<boolean> {
    if (this.flushing) return false;
    this.flushing = true;
    const generation = this.generation;
    try {
      for (;;) {
        if (!this.online() || generation !== this.generation) return false;
        const next = this.entries()
          .filter((e) => e.status === 'pending')
          .sort((a, b) => a.seq - b.seq)[0];
        if (!next) {
          this.serverError.set(false);
          return true;
        }
        const body: RedeemRequest = { id: next.id, rewardId: next.rewardId, points: next.points };
        try {
          await firstValueFrom(this.http.post(`${API_URL}/redemptions`, body));
        } catch (error) {
          // A 409 means the server already has this id (an earlier answer was lost): it is sent.
          if (!(error instanceof HttpErrorResponse && error.status === 409)) {
            this.failed(error);
            return false;
          }
        }
        if (generation !== this.generation) return false;
        await this.markSent(next);
      }
    } finally {
      this.flushing = false;
    }
  }

  /** Fresh data replaces the cache wholesale, in one transaction; a failure leaves the cache as it was. */
  private async refresh(): Promise<void> {
    const generation = this.generation;
    try {
      const [rewards, movements] = await Promise.all([
        firstValueFrom(this.http.get<Reward[]>(`${API_URL}/catalog`)),
        firstValueFrom(this.http.get<Movement[]>(`${API_URL}/history`)),
      ]);
      if (generation !== this.generation) return;
      const at = this.clock();
      this.rewardList.set(rewards);
      this.movementList.set(movements);
      this.synced.set(at);
      this.serverError.set(false);
      await this.persistFetched(rewards, movements, at);
    } catch (error) {
      this.failed(error);
    }
  }

  /** Offline is not an error to show: the cache stays and the effect sends again on reconnect. A server error retries. */
  private failed(error: unknown): void {
    const status = error instanceof HttpErrorResponse ? error.status : 0;
    if (status === 0) return;
    this.serverError.set(true);
    this.cancelRetry();
    this.retryTimer = setTimeout(() => {
      this.retryTimer = null;
      void this.sync();
    }, this.config.retryMs);
  }

  private cancelRetry(): void {
    if (this.retryTimer !== null) clearTimeout(this.retryTimer);
    this.retryTimer = null;
  }

  private async markSent(entry: RedeemEntry): Promise<void> {
    const sentAt = this.clock();
    this.entries.update((all) => all.map((e) => (e.seq === entry.seq ? { ...e, status: 'sent', sentAt } : e)));
    try {
      const db = await offlineDb.ready();
      await db.runAsync("UPDATE redeem_queue SET status = 'sent', sent_at = ? WHERE id = ?", sentAt, entry.id);
    } catch {
      // No SQLite on this platform.
    }
  }

  /** What a cold start shows, before any request - offline, this is all there is. */
  private async loadFromCache(): Promise<void> {
    try {
      const db = await offlineDb.ready();
      const rewards = await db.getAllAsync<RewardRow>('SELECT * FROM reward ORDER BY position');
      const movements = await db.getAllAsync<Movement>('SELECT id, type, points, description, date FROM movement ORDER BY position');
      const queue = await db.getAllAsync<QueueRow>('SELECT * FROM redeem_queue ORDER BY seq');
      const meta = await db.getFirstAsync<{ value: string }>("SELECT value FROM meta WHERE key = 'last_sync'");
      this.rewardList.set(
        rewards.map((r) => ({
          id: r.id,
          title: r.title,
          partner: r.partner,
          category: r.category,
          costPoints: r.cost_points,
          description: r.description,
          icon: r.icon,
          ...(r.stock === null ? {} : { stock: r.stock }),
        })),
      );
      this.movementList.set(movements);
      this.entries.set(
        queue.map((q) => ({
          seq: q.seq,
          id: q.id,
          rewardId: q.reward_id,
          title: q.title,
          points: q.points,
          createdAt: q.created_at,
          status: q.status,
          sentAt: q.sent_at,
        })),
      );
      this.seq = queue.reduce((max, q) => Math.max(max, q.seq), 0);
      this.synced.set(meta ? Number(meta.value) : null);
    } catch {
      // No SQLite on this platform (a Node test without a stand-in): an empty cache and an empty
      // queue are what a first launch looks like anyway.
    }
  }

  private async persistFetched(rewards: readonly Reward[], movements: readonly Movement[], at: number): Promise<void> {
    try {
      const db = await offlineDb.ready();
      await db.withTransactionAsync(async () => {
        await db.runAsync('DELETE FROM reward');
        await db.runAsync('DELETE FROM movement');
        for (const [position, r] of rewards.entries()) {
          await db.runAsync(
            'INSERT INTO reward (id, position, title, partner, category, cost_points, description, icon, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            r.id, position, r.title, r.partner, r.category, r.costPoints, r.description, r.icon, r.stock ?? null,
          );
        }
        for (const [position, m] of movements.entries()) {
          await db.runAsync(
            'INSERT INTO movement (id, position, type, points, description, date) VALUES (?, ?, ?, ?, ?, ?)',
            m.id, position, m.type, m.points, m.description, m.date,
          );
        }
        await db.runAsync("INSERT OR REPLACE INTO meta (key, value) VALUES ('last_sync', ?)", String(at));
      });
    } catch {
      // No SQLite on this platform.
    }
  }

  private async persistEntry(entry: RedeemEntry): Promise<void> {
    try {
      const db = await offlineDb.ready();
      await db.runAsync(
        'INSERT INTO redeem_queue (seq, id, reward_id, title, points, created_at, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        entry.seq, entry.id, entry.rewardId, entry.title, entry.points, entry.createdAt, entry.status,
      );
    } catch {
      // No SQLite on this platform: the in-memory queue is what gets sent.
    }
  }
}
