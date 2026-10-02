export type TierName = 'Bronce' | 'Plata' | 'Oro' | 'Platino';

export interface Tier {
  readonly name: TierName;
  /** Lifetime points needed to reach this tier. */
  readonly minPoints: number;
}

/** Ordered from lowest to highest; the first threshold must be 0. */
export const TIERS: readonly Tier[] = [
  { name: 'Bronce', minPoints: 0 },
  { name: 'Plata', minPoints: 5_000 },
  { name: 'Oro', minPoints: 15_000 },
  { name: 'Platino', minPoints: 40_000 },
];
