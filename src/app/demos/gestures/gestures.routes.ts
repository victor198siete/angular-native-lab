import type { Routes } from '@angular/router';

/** Gestures demo, reached by deep link (`/--/gestures`); the app still opens on Rewards. */
export const gesturesRoutes: Routes = [
  {
    path: 'gestures',
    loadComponent: () => import('./features/gestures/gestures.screen.ts').then((m) => m.GesturesScreen),
  },
];
