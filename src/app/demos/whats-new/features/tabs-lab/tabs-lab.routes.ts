import type { Routes } from '@angular/router';
import { reuseScreen } from '@ng-native/router';
import { TabsLabShell } from './tabs-lab.shell.ts';

/** How long the Search tab's guard keeps the tab from opening, long enough to tap another tab. */
export const SEARCH_GUARD_MS = 4000;

const slowGuard = () => new Promise<boolean>((resolve) => setTimeout(() => resolve(true), SEARCH_GUARD_MS));

/**
 * The tabs lab: one tab bar under an account (`whats-new/tabs/:org`), kept as one screen by
 * `reuseScreen` so a move from org 1 to org 2 reuses it (#774). Search waits behind a guard (#761);
 * Library is a stack whose `:id` page can also be presented over Home (#783).
 */
export const tabsLabRoutes: Routes = [
  reuseScreen({
    path: 'whats-new/tabs/:org',
    component: TabsLabShell,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./tabs-lab.pages.ts').then((m) => m.TabsLabHome) },
      {
        path: 'search',
        canActivate: [slowGuard],
        loadComponent: () => import('./tabs-lab.pages.ts').then((m) => m.TabsLabSearch),
      },
      {
        path: 'library',
        loadComponent: () => import('./tabs-lab.pages.ts').then((m) => m.TabsLabLibraryStack),
        children: [
          { path: '', loadComponent: () => import('./tabs-lab.pages.ts').then((m) => m.TabsLabLibrary) },
          { path: ':id', loadComponent: () => import('./tabs-lab.pages.ts').then((m) => m.TabsLabAlbum) },
        ],
      },
    ],
  }),
];
