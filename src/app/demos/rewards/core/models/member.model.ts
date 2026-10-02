export interface Member {
  readonly name: string;
  /** Spendable balance. */
  readonly points: number;
  /** Points earned since joining; never decreases, drives the tier. */
  readonly lifetimePoints: number;
}
