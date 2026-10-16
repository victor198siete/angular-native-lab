import { database } from '@ng-native/expo/database';

/**
 * The demo's schema, one value for the whole app (see the Database guide). `reward` and `movement`
 * are the cache of the last fetch; `position` keeps the server's order. `redeem_queue` is the queue
 * of redemptions: a row is `pending` until the server has it, then `sent`. `meta` holds the time of
 * the last synchronisation.
 */
export const offlineDb = database('offline-lab.db', [
  {
    to: 1,
    up: (db) =>
      db.execAsync(`
        CREATE TABLE reward (
          id TEXT PRIMARY KEY,
          position INTEGER NOT NULL,
          title TEXT NOT NULL,
          partner TEXT NOT NULL,
          category TEXT NOT NULL,
          cost_points INTEGER NOT NULL,
          description TEXT NOT NULL,
          icon TEXT NOT NULL,
          stock INTEGER
        );
        CREATE TABLE movement (
          id TEXT PRIMARY KEY,
          position INTEGER NOT NULL,
          type TEXT NOT NULL,
          points INTEGER NOT NULL,
          description TEXT NOT NULL,
          date TEXT NOT NULL
        );
        CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
        CREATE TABLE redeem_queue (
          seq INTEGER PRIMARY KEY AUTOINCREMENT,
          id TEXT NOT NULL UNIQUE,
          reward_id TEXT NOT NULL,
          title TEXT NOT NULL,
          points INTEGER NOT NULL,
          created_at INTEGER NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          sent_at INTEGER
        );
      `),
  },
]);
