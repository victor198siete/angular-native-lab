import type { Routes } from '@angular/router';

/** Device demo, reached by deep link (`/--/device`); the app still opens on Rewards. */
export const deviceRoutes: Routes = [
  {
    path: 'device',
    loadComponent: () => import('./features/device/device.screen.ts').then((m) => m.DeviceScreen),
  },
];
