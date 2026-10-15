import type { Release } from './case.ts';
import { cases011 } from './cases-0-11.ts';
import { cases010 } from './cases-0-10.ts';
import { cases013 } from './cases-0-13.ts';
import { cases014 } from './cases-0-14.ts';
import { cases08 } from './cases-0-8.ts';
import { cases09 } from './cases-0-9.ts';

/**
 * Newest first. A release is added here with its own `cases-*.ts` file and one `@case` branch in
 * `version.screen.ts`; nothing else changes.
 */
export const RELEASES: readonly Release[] = [
  { version: '0.14', cases: cases014 },
  { version: '0.13', cases: cases013 },
  { version: '0.11', cases: cases011 },
  { version: '0.10', cases: cases010 },
  { version: '0.9', cases: cases09 },
  { version: '0.8', cases: cases08 },
];

export const releaseOf = (version: string | undefined): Release | undefined =>
  RELEASES.find((release) => release.version === version);
