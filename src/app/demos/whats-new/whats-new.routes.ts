import type { Routes } from '@angular/router';
import { tabsLabRoutes } from './features/tabs-lab/tabs-lab.routes.ts';

/**
 * What's new demo, reached by deep link (`/--/whats-new`); the app still opens on Rewards.
 * `whats-new` lists the ng-native versions that have cases; `whats-new/0.10` shows one version's.
 */
export const whatsNewRoutes: Routes = [
  // The tabs lab (0.11 and 0.13 tab cases) has more segments than `whats-new/:version`, so order does not matter, but it goes first.
  ...tabsLabRoutes,
  {
    path: 'whats-new',
    loadComponent: () => import('./features/versions/versions.screen.ts').then((m) => m.VersionsScreen),
  },
  {
    path: 'whats-new/:version',
    loadComponent: () => import('./features/version/version.screen.ts').then((m) => m.VersionScreen),
  },
];
