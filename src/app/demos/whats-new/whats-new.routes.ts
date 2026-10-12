import type { Routes } from '@angular/router';

/**
 * What's new demo, reached by deep link (`/--/whats-new`); the app still opens on Rewards.
 * `whats-new` lists the ng-native versions that have cases; `whats-new/0.10` shows one version's.
 */
export const whatsNewRoutes: Routes = [
  {
    path: 'whats-new',
    loadComponent: () => import('./features/versions/versions.screen.ts').then((m) => m.VersionsScreen),
  },
  {
    path: 'whats-new/:version',
    loadComponent: () => import('./features/version/version.screen.ts').then((m) => m.VersionScreen),
  },
];
