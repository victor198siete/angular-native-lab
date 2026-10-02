import { computed, inject, Service, signal } from '@angular/core';
import type {
  Member,
  Movement,
  Reward,
  RewardCategory,
  Tier,
} from './models/index.ts';
import { TIERS } from './models/index.ts';
import { REWARDS_SOURCE } from './rewards.source.ts';

export type RedeemResult =
  | { readonly status: 'ok'; readonly movement: Movement; readonly remainingPoints: number }
  | { readonly status: 'insufficient'; readonly missingPoints: number }
  | { readonly status: 'out-of-stock' }
  | { readonly status: 'not-found' };

export interface MovementGroup {
  /** Calendar day, `YYYY-MM-DD` (UTC). */
  readonly date: string;
  readonly movements: readonly Movement[];
}

@Service()
export class RewardsStore {
  private readonly source = inject(REWARDS_SOURCE);
  private redeemCount = 0;

  private readonly _member = signal<Member>(this.source.member);
  private readonly _rewards = signal<readonly Reward[]>(this.source.rewards);
  private readonly _movements = signal<readonly Movement[]>(this.source.movements);
  private readonly _selectedCategory = signal<RewardCategory | null>(null);

  readonly member = this._member.asReadonly();
  readonly rewards = this._rewards.asReadonly();
  readonly movements = this._movements.asReadonly();
  /** `null` means every category. */
  readonly selectedCategory = this._selectedCategory.asReadonly();

  readonly tier = computed<Tier>(() => {
    const lifetime = this._member().lifetimePoints;
    return TIERS.reduce((current, tier) => (lifetime >= tier.minPoints ? tier : current), TIERS[0]);
  });

  readonly nextTier = computed<Tier | null>(
    () => TIERS.find((tier) => tier.minPoints > this._member().lifetimePoints) ?? null,
  );

  /** 0..1 inside the current tier; 1 once the top tier is reached. */
  readonly progressToNextTier = computed(() => {
    const next = this.nextTier();
    if (!next) return 1;
    const floor = this.tier().minPoints;
    const ratio = (this._member().lifetimePoints - floor) / (next.minPoints - floor);
    return Math.min(1, Math.max(0, ratio));
  });

  readonly pointsToNextTier = computed(() => {
    const next = this.nextTier();
    return next ? next.minPoints - this._member().lifetimePoints : 0;
  });

  readonly filteredRewards = computed(() => {
    const category = this._selectedCategory();
    const all = this._rewards();
    return category ? all.filter((reward) => reward.category === category) : all;
  });

  /** Movements grouped by day, newest first. */
  readonly movementsByDate = computed<readonly MovementGroup[]>(() => {
    const sorted = [...this._movements()].sort((a, b) => b.date.localeCompare(a.date));
    const groups: { date: string; movements: Movement[] }[] = [];
    for (const movement of sorted) {
      const date = movement.date.slice(0, 10);
      const last = groups[groups.length - 1];
      if (last?.date === date) last.movements.push(movement);
      else groups.push({ date, movements: [movement] });
    }
    return groups;
  });

  rewardById(id: string): Reward | undefined {
    return this._rewards().find((reward) => reward.id === id);
  }

  /** Reactive when read inside a template or `computed`, since it reads the member signal. */
  canAfford(reward: Reward): boolean {
    return this._member().points >= reward.costPoints;
  }

  selectCategory(category: RewardCategory | null): void {
    this._selectedCategory.set(category);
  }

  redeem(rewardId: string, now: Date = new Date()): RedeemResult {
    const reward = this.rewardById(rewardId);
    if (!reward) return { status: 'not-found' };
    if (reward.stock !== undefined && reward.stock <= 0) return { status: 'out-of-stock' };

    const balance = this._member().points;
    if (balance < reward.costPoints) {
      return { status: 'insufficient', missingPoints: reward.costPoints - balance };
    }

    this.redeemCount += 1;
    const movement: Movement = {
      id: `mv-redeem-${this.redeemCount}`,
      type: 'redeem',
      points: reward.costPoints,
      description: `Canje: ${reward.title}`,
      date: now.toISOString(),
    };
    const remainingPoints = balance - reward.costPoints;

    this._member.update((member) => ({ ...member, points: remainingPoints }));
    this._movements.update((movements) => [movement, ...movements]);
    if (reward.stock !== undefined) {
      this._rewards.update((rewards) =>
        rewards.map((r) => (r.id === rewardId ? { ...r, stock: (r.stock ?? 0) - 1 } : r)),
      );
    }
    return { status: 'ok', movement, remainingPoints };
  }
}
