import type { Routes } from '@angular/router';
import { loginRoutes } from './demos/login/login.routes.ts';
import { rewardsRoutes } from './demos/rewards/rewards.routes.ts';

/**
 * For now the app opens straight into the Rewards demo, as in the LinkedIn video. The Login demo
 * is reached by deep link (`/--/login`); when the demos get a home, each becomes a tab of the lab
 * and these routes move under it.
 */
export const routes: Routes = [...rewardsRoutes, ...loginRoutes];
