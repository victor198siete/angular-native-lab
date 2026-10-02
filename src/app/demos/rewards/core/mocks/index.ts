import type { RewardsSnapshot } from '../models/index.ts';
import { MOCK_MEMBER } from './member.mock.ts';
import { MOCK_MOVEMENTS } from './movements.mock.ts';
import { MOCK_REWARDS } from './rewards.mock.ts';

export const MOCK_SNAPSHOT: RewardsSnapshot = {
  member: MOCK_MEMBER,
  rewards: MOCK_REWARDS,
  movements: MOCK_MOVEMENTS,
};

export { MOCK_MEMBER, MOCK_MOVEMENTS, MOCK_REWARDS };
