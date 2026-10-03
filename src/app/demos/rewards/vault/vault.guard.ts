import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { VaultLock } from './vault-lock.ts';

/** With the lock on and the session not yet unlocked, every screen goes to the lock screen. */
export const vaultGuard: CanActivateFn = () =>
  inject(VaultLock).locked() ? inject(Router).createUrlTree(['/locked']) : true;
