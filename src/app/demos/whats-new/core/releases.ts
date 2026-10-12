import type { Release } from './case.ts';
import { cases010 } from './cases-0-10.ts';

/**
 * Newest first. A release is added here with its own `cases-*.ts` file and one `@case` branch in
 * `version.screen.ts`; nothing else changes.
 */
export const RELEASES: readonly Release[] = [{ version: '0.10', cases: cases010 }];

export const releaseOf = (version: string | undefined): Release | undefined =>
  RELEASES.find((release) => release.version === version);
