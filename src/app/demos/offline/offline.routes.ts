import { withInterceptors } from '@angular/common/http';
import type { Routes } from '@angular/router';
import { provideNativeHttpClient } from '@ng-native/platform/http';
import { offlineApiServer } from './core/fake-api.ts';

/**
 * Offline demo, reached by deep link (`/--/offline`); the app still opens on Rewards. The fake API
 * is an interceptor, like the Login demo's, but it is provided here, on the route, so it answers
 * only this demo's requests and `main.ts` stays as it is.
 */
export const offlineRoutes: Routes = [
  {
    path: 'offline',
    providers: [provideNativeHttpClient(withInterceptors([offlineApiServer]))],
    loadComponent: () => import('./features/offline/offline.screen.ts').then((m) => m.OfflineScreen),
  },
];
