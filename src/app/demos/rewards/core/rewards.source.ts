import { InjectionToken, LOCALE_ID, inject } from '@angular/core';
import { mockLanguage, mockSnapshot } from './mocks/index.ts';
import type { RewardsSnapshot } from './models/index.ts';

/**
 * Where the store gets its initial data: a synchronous mock in the app's language. A test (or
 * another demo) can provide a different snapshot here without touching any screen.
 */
export const REWARDS_SOURCE = new InjectionToken<RewardsSnapshot>('REWARDS_SOURCE', {
  providedIn: 'root',
  factory: () => mockSnapshot(mockLanguage(inject(LOCALE_ID))),
});
