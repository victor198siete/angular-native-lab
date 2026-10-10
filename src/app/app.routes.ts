import type { Routes } from '@angular/router';
import { deviceRoutes } from './demos/device/device.routes.ts';
import { loginRoutes } from './demos/login/login.routes.ts';
import { rewardsRoutes } from './demos/rewards/rewards.routes.ts';

/**
 * For now the app opens straight into the Rewards demo, as in the LinkedIn video. The Login and
 * Device demos are reached by deep link (`/--/login`, `/--/device`); when the demos get a home,
 * each becomes a tab of the lab and these routes move under it.
 */
export const routes: Routes = [...rewardsRoutes, ...loginRoutes, ...deviceRoutes];
