import { InjectionToken } from '@angular/core';
import { MOCK_SNAPSHOT } from './mocks/index.ts';
import type { RewardsSnapshot } from './models/index.ts';

/**
 * Where the store gets its initial data: a synchronous mock. A test (or another demo) can provide
 * a different snapshot here without touching any screen.
 */
export const REWARDS_SOURCE = new InjectionToken<RewardsSnapshot>('REWARDS_SOURCE', {
  providedIn: 'root',
  factory: () => MOCK_SNAPSHOT,
});
