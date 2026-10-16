import type { Routes } from '@angular/router';
import { tabsLabRoutes } from './features/tabs-lab/tabs-lab.routes.ts';

/**
 * What's new demo, reached by deep link (`/--/whats-new`); the app still opens on Rewards.
 * `whats-new` lists the ng-native versions that have cases; `whats-new/0.10` shows one version's.
 */
export const whatsNewRoutes: Routes = [
  // The tabs lab (0.11 and 0.13 tab cases) has more segments than `whats-new/:version`, so order does not matter, but it goes first.
  ...tabsLabRoutes,
  // A7-3's second page: a literal path, so it goes before `whats-new/:version`, which would take `link-lab` for a version.
  {
    path: 'whats-new/link-lab',
    loadComponent: () => import('./features/link-lab/link-lab.screen.ts').then((m) => m.LinkLabScreen),
  },
  {
    path: 'whats-new',
    loadComponent: () => import('./features/versions/versions.screen.ts').then((m) => m.VersionsScreen),
  },
  {
    path: 'whats-new/:version',
    loadComponent: () => import('./features/version/version.screen.ts').then((m) => m.VersionScreen),
  },
];
