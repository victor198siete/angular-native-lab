import type { Member } from './member.model.ts';
import type { Movement } from './movement.model.ts';
import type { Reward } from './reward.model.ts';

/** Everything the store needs to boot. */
export interface RewardsSnapshot {
  readonly member: Member;
  readonly rewards: readonly Reward[];
  readonly movements: readonly Movement[];
}
