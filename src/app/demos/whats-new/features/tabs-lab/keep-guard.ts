import { inject, Injectable, signal } from '@angular/core';
import type { CanDeactivateFn } from '@angular/router';

/**
 * Whether the presented sheet should keep the person where they are. A presented page has no component
 * to hand to its `canDeactivate` guard, so the switch and the guard share this one service.
 */
@Injectable({ providedIn: 'root' })
export class KeepMeHere {
  readonly keep = signal(false);
}

/** `canDeactivate` on the sheet's route: leaving is refused while "Keep me here" is on (#1351, #1331, #1332). */
export const keepMeHereGuard: CanDeactivateFn<unknown> = () => !inject(KeepMeHere).keep();
