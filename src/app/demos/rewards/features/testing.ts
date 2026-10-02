import type { Provider, Type } from '@angular/core';
import { withComponentInputBinding, type Routes } from '@angular/router';
import { provideNativeRouter } from '@ng-native/router';
import { render } from '@ng-native/testing';
import { ANIMATE_NUMBERS } from '../shared/animated-number.ts';
import { routes } from '../../../app.routes.ts';
import { App } from '../../../app.ts';

/** Number animations are off in tests: the signal jumps to its target so text is deterministic. */
const instant = { provide: ANIMATE_NUMBERS, useValue: false };

/** Renders the real app on its first tab (wallet) or deep-linked to a path. */
export function renderApp(deepLink?: string, extra: Provider[] = []) {
  const config: Routes = deepLink
    ? [{ path: '', redirectTo: deepLink, pathMatch: 'full' }, ...routes]
    : routes;
  return render(App, { providers: [instant, ...extra, provideNativeRouter(config, withComponentInputBinding())] });
}

/**
 * Renders one screen on its own. The screens inject `Router`, so the native router is provided;
 * pass `animate: true` to leave the number animations on.
 */
export function renderScreen<T>(component: Type<T>, options: { animate?: boolean } = {}) {
  return render(component, {
    providers: [
      ...(options.animate ? [] : [instant]),
      provideNativeRouter(routes, withComponentInputBinding()),
    ],
  });
}
