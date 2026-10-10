import type { Routes } from '@angular/router';

/** Lists demo, reached by deep link (`/--/lists`); the app still opens on Rewards. */
export const listsRoutes: Routes = [
  {
    path: 'lists',
    loadComponent: () => import('./features/lists/lists.screen.ts').then((m) => m.ListsScreen),
  },
];
