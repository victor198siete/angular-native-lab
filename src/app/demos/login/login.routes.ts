import type { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guard.ts';

/**
 * Login demo, reached by deep link (`/--/login`); the app still opens on Rewards. The account
 * screen is behind the guard, and the login screen is closed to someone already signed in.
 */
export const loginRoutes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/login/login.screen.ts').then((m) => m.LoginScreen),
  },
  {
    path: 'login/account',
    canActivate: [authGuard],
    loadComponent: () => import('./features/account/account.screen.ts').then((m) => m.AccountScreen),
  },
];
