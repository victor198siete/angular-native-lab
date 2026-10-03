import type { Routes } from '@angular/router';
import { TabsShell } from './shell/tabs-shell.ts';
import { vaultGuard } from './vault/vault.guard.ts';

/**
 * Rewards demo. Its own tab bar is the first screen, and a reward's detail is pushed over the
 * whole bar. Each `<native-tab path>` in the shell needs a child route with the same path.
 */
export const rewardsRoutes: Routes = [
  {
    path: '',
    component: TabsShell,
    canActivate: [vaultGuard],
    children: [
      { path: '', redirectTo: 'wallet', pathMatch: 'full' },
      { path: 'wallet', loadComponent: () => import('./features/wallet/wallet.screen.ts').then((m) => m.WalletScreen) },
      { path: 'catalog', loadComponent: () => import('./features/catalog/catalog.screen.ts').then((m) => m.CatalogScreen) },
      { path: 'history', loadComponent: () => import('./features/history/history.screen.ts').then((m) => m.HistoryScreen) },
    ],
  },
  {
    path: 'reward/:id',
    canActivate: [vaultGuard],
    loadComponent: () => import('./features/reward-detail/reward-detail.screen.ts').then((m) => m.RewardDetailScreen),
  },
  {
    path: 'voucher/:id',
    canActivate: [vaultGuard],
    loadComponent: () => import('./features/voucher/voucher.screen.ts').then((m) => m.VoucherScreen),
  },
  {
    // The opt-in biometric lock on launch (see vault/). Outside the guard, or it would loop.
    path: 'locked',
    loadComponent: () => import('./vault/lock.screen.ts').then((m) => m.LockScreen),
  },
];
