import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { Session } from './session.ts';

/**
 * Decides on the first navigation, with no loading screen: the keychain is read synchronously, so
 * the session is already known. No tokens, or tokens from an earlier run that Face ID has not
 * reopened yet, both go to the login screen.
 */
export const authGuard: CanActivateFn = () =>
  inject(Session).signedIn() ? true : inject(Router).createUrlTree(['/login']);

/** The login screen for someone already inside would be a dead end: send them to their account. */
export const guestGuard: CanActivateFn = () =>
  inject(Session).signedIn() ? inject(Router).createUrlTree(['/login/account']) : true;
