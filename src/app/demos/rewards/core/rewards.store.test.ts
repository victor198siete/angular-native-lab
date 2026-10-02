import { Injector } from '@angular/core';
import { describe, expect, it } from 'vitest';
import { MOCK_REWARDS, MOCK_SNAPSHOT } from './mocks/index.ts';
import { REWARD_CATEGORIES, type RewardsSnapshot } from './models/index.ts';
import { REWARDS_SOURCE } from './rewards.source.ts';
import { RewardsStore } from './rewards.store.ts';

function createStore(overrides: Partial<RewardsSnapshot> & { lifetime?: number; points?: number } = {}) {
  const snapshot: RewardsSnapshot = {
    member: {
      name: 'Test',
      points: overrides.points ?? 1_000,
      lifetimePoints: overrides.lifetime ?? overrides.points ?? 1_000,
    },
    rewards: overrides.rewards ?? [
      { id: 'a', title: 'A', partner: 'P', category: 'travel', costPoints: 400, description: '', icon: 'plane' },
      { id: 'b', title: 'B', partner: 'P', category: 'wellness', costPoints: 5_000, description: '', icon: 'person-standing' },
      { id: 'c', title: 'C', partner: 'P', category: 'travel', costPoints: 100, description: '', icon: 'palmtree', stock: 0 },
    ],
    movements: overrides.movements ?? [],
  };
  const injector = Injector.create({
    providers: [{ provide: REWARDS_SOURCE, useValue: snapshot }, RewardsStore],
  });
  return injector.get(RewardsStore);
}

describe('mock data', () => {
  it('generates 200 unique rewards across all categories, deterministically', () => {
    expect(MOCK_REWARDS).toHaveLength(200);
    expect(new Set(MOCK_REWARDS.map((r) => r.id)).size).toBe(200);
    for (const category of REWARD_CATEGORIES) {
      expect(MOCK_REWARDS.filter((r) => r.category === category)).toHaveLength(40);
    }
  });
});

describe('tiers', () => {
  it.each([
    [0, 'bronze'],
    [4_999, 'bronze'],
    [5_000, 'silver'],
    [14_999, 'silver'],
    [15_000, 'gold'],
    [39_999, 'gold'],
    [40_000, 'platinum'],
    [100_000, 'platinum'],
  ])('lifetime %i is %s', (lifetime, name) => {
    expect(createStore({ lifetime }).tier().name).toBe(name);
  });

  it('computes next tier, progress and remaining points', () => {
    const store = createStore({ lifetime: 10_000 });
    expect(store.nextTier()?.name).toBe('gold');
    expect(store.progressToNextTier()).toBeCloseTo(0.5);
    expect(store.pointsToNextTier()).toBe(5_000);
  });

  it('is full progress with no next tier at platinum', () => {
    const store = createStore({ lifetime: 50_000 });
    expect(store.nextTier()).toBeNull();
    expect(store.progressToNextTier()).toBe(1);
    expect(store.pointsToNextTier()).toBe(0);
  });

  it('starts progress at 0 exactly on a boundary', () => {
    expect(createStore({ lifetime: 5_000 }).progressToNextTier()).toBe(0);
  });

  it('boots the default member as silver with 12,480 points', () => {
    const injector = Injector.create({ providers: [{ provide: REWARDS_SOURCE, useValue: MOCK_SNAPSHOT }, RewardsStore] });
    const store = injector.get(RewardsStore);
    expect(store.member().name).toBe('Victor');
    expect(store.member().points).toBe(12_480);
    expect(store.tier().name).toBe('silver');
  });
});

describe('filtering', () => {
  it('shows everything without a category and filters when one is selected', () => {
    const store = createStore();
    expect(store.filteredRewards()).toHaveLength(3);
    store.selectCategory('travel');
    expect(store.filteredRewards().map((r) => r.id)).toEqual(['a', 'c']);
    store.selectCategory(null);
    expect(store.filteredRewards()).toHaveLength(3);
  });
});

describe('redeem', () => {
  it('deducts points, prepends a redeem movement and keeps lifetime points', () => {
    const store = createStore({ points: 1_000, lifetime: 3_000 });
    const result = store.redeem('a', new Date('2026-10-01T10:00:00Z'));

    expect(result.status).toBe('ok');
    expect(store.member().points).toBe(600);
    expect(store.member().lifetimePoints).toBe(3_000);
    expect(store.movements()[0]).toMatchObject({ type: 'redeem', points: 400, date: '2026-10-01T10:00:00.000Z' });
    expect(store.movementsByDate()[0].date).toBe('2026-10-01');
  });

  it('reports the missing points when the balance is not enough', () => {
    const store = createStore({ points: 1_000 });
    expect(store.redeem('b')).toEqual({ status: 'insufficient', missingPoints: 4_000 });
    expect(store.member().points).toBe(1_000);
    expect(store.movements()).toHaveLength(0);
  });

  it('returns not-found for an unknown id', () => {
    expect(createStore().redeem('zzz')).toEqual({ status: 'not-found' });
  });

  it('refuses a reward with no stock left', () => {
    const store = createStore();
    expect(store.redeem('c')).toEqual({ status: 'out-of-stock' });
    expect(store.member().points).toBe(1_000);
  });

  it('canAfford follows the balance', () => {
    const store = createStore({ points: 500 });
    const [a, b] = store.rewards();
    expect(store.canAfford(a)).toBe(true);
    expect(store.canAfford(b)).toBe(false);
    store.redeem('a');
    expect(store.canAfford(a)).toBe(false);
  });
});

describe('movementsByDate', () => {
  it('groups by day, newest first', () => {
    const store = createStore({
      movements: [
        { id: '1', type: 'earn', points: 10, description: 'x', date: '2026-09-01T08:00:00.000Z' },
        { id: '2', type: 'earn', points: 10, description: 'y', date: '2026-09-02T08:00:00.000Z' },
        { id: '3', type: 'earn', points: 10, description: 'z', date: '2026-09-02T20:00:00.000Z' },
      ],
    });
    const groups = store.movementsByDate();
    expect(groups.map((g) => g.date)).toEqual(['2026-09-02', '2026-09-01']);
    expect(groups[0].movements.map((m) => m.id)).toEqual(['3', '2']);
  });
});
