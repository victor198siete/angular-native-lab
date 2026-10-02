import type { RewardsSnapshot } from '../models/index.ts';
import type { MockLanguage } from './language.ts';
import { MOCK_MEMBER } from './member.mock.ts';
import { buildMovements } from './movements.mock.ts';
import { buildRewards } from './rewards.mock.ts';

/** The whole demo dataset in one language. Same ids, points and dates in every language. */
export function mockSnapshot(language: MockLanguage = 'en'): RewardsSnapshot {
  return { member: MOCK_MEMBER, rewards: buildRewards(language), movements: buildMovements(language) };
}

/** English dataset, for tests (their LOCALE_ID is the source language). */
export const MOCK_SNAPSHOT: RewardsSnapshot = mockSnapshot('en');
export const MOCK_REWARDS = MOCK_SNAPSHOT.rewards;
export const MOCK_MOVEMENTS = MOCK_SNAPSHOT.movements;

export { MOCK_MEMBER, buildMovements, buildRewards };
export { mockLanguage, type MockLanguage } from './language.ts';
