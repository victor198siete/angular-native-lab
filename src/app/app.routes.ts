import type { Routes } from '@angular/router';
import { deviceRoutes } from './demos/device/device.routes.ts';
import { gesturesRoutes } from './demos/gestures/gestures.routes.ts';
import { listsRoutes } from './demos/lists/lists.routes.ts';
import { loginRoutes } from './demos/login/login.routes.ts';
import { whatsNewRoutes } from './demos/whats-new/whats-new.routes.ts';
import { rewardsRoutes } from './demos/rewards/rewards.routes.ts';

/**
 * For now the app opens straight into the Rewards demo, as in the LinkedIn video. The Login,
 * Device, Lists, Gestures and What's new demos are reached by deep link (`/--/login`, `/--/device`, `/--/lists`, `/--/gestures`, `/--/whats-new`); when the demos get a home,
 * each becomes a tab of the lab and these routes move under it.
 */
export const routes: Routes = [
  // Temporary ICU reproduction (branch repro/icu-anchor).
  { path: 'repro/icu', loadComponent: () => import('./repro/icu/icu-repro.screen.ts').then((m) => m.IcuReproScreen) },
  ...rewardsRoutes, ...loginRoutes, ...deviceRoutes, ...listsRoutes, ...gesturesRoutes, ...whatsNewRoutes];
