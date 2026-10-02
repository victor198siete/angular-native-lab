export type MovementType = 'earn' | 'redeem';

export interface Movement {
  readonly id: string;
  readonly type: MovementType;
  /** Always a positive magnitude; the sign is given by `type`. */
  readonly points: number;
  readonly description: string;
  /** ISO 8601 timestamp. */
  readonly date: string;
}
