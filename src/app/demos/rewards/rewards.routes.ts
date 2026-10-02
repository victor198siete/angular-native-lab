import type { Routes } from '@angular/router';
import { TabsShell } from './shell/tabs-shell.ts';

/**
 * Rewards demo. Its own tab bar is the first screen, and a reward's detail is pushed over the
 * whole bar. Each `<native-tab path>` in the shell needs a child route with the same path.
 */
export const rewardsRoutes: Routes = [
  {
    path: '',
    component: TabsShell,
    children: [
      { path: '', redirectTo: 'wallet', pathMatch: 'full' },
      { path: 'wallet', loadComponent: () => import('./features/wallet/wallet.screen.ts').then((m) => m.WalletScreen) },
      { path: 'catalog', loadComponent: () => import('./features/catalog/catalog.screen.ts').then((m) => m.CatalogScreen) },
      { path: 'history', loadComponent: () => import('./features/history/history.screen.ts').then((m) => m.HistoryScreen) },
    ],
  },
  {
    path: 'reward/:id',
    loadComponent: () => import('./features/reward-detail/reward-detail.screen.ts').then((m) => m.RewardDetailScreen),
  },
];
