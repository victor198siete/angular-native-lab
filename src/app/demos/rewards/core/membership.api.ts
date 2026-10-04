import { InjectionToken } from '@angular/core';

export interface JoinRequest {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly promotions: boolean;
}

export type JoinResult = { readonly ok: true } | { readonly ok: false; readonly reason: 'email-taken' };

export interface MembershipApi {
  join(request: JoinRequest): Promise<JoinResult>;
}

/** The mock's one already-registered address, so the "taken" path can be tried by hand. */
export const TAKEN_EMAIL = 'taken@example.com';
const LATENCY_MS = 900;

/**
 * Sign-up for the loyalty program. The lab answers from a mock with a network-like delay; a real
 * app provides its API client here, and the screen does not change.
 */
export const MEMBERSHIP_API = new InjectionToken<MembershipApi>('MEMBERSHIP_API', {
  providedIn: 'root',
  factory: () => ({
    join: (request) =>
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve(
              request.email.trim().toLowerCase() === TAKEN_EMAIL
                ? { ok: false, reason: 'email-taken' }
                : { ok: true },
            ),
          LATENCY_MS,
        ),
      ),
  }),
});
