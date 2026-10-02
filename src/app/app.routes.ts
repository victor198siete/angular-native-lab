import type { Routes } from '@angular/router';
import { rewardsRoutes } from './demos/rewards/rewards.routes.ts';

/**
 * For now the app opens straight into the Rewards demo, as in the LinkedIn video. When the second
 * demo lands, each demo becomes a tab of the lab and these routes move under it.
 */
export const routes: Routes = [...rewardsRoutes];
