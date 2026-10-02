/** Stable ids; the displayed names come from shared/labels.ts in the active language. */
export type TierName = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Tier {
  readonly name: TierName;
  /** Lifetime points needed to reach this tier. */
  readonly minPoints: number;
}

/** Ordered from lowest to highest; the first threshold must be 0. */
export const TIERS: readonly Tier[] = [
  { name: 'bronze', minPoints: 0 },
  { name: 'silver', minPoints: 5_000 },
  { name: 'gold', minPoints: 15_000 },
  { name: 'platinum', minPoints: 40_000 },
];
