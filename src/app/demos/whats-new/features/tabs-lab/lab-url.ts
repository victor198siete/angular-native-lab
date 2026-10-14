import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

/** The router's url as a signal, which the lab's pages print so a tap can be checked against it. */
export function urlSignal() {
  const router = inject(Router);
  return toSignal(
    router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: router.url },
  );
}

/** The `:org` of the url, `-` if there is none: the account the bar is showing. */
export function orgOf(url: string): string {
  return /\/tabs\/([^/(]+)/.exec(url)?.[1] ?? '-';
}
