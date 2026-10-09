import { HttpErrorResponse, type HttpInterceptorFn, type HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { NativeNavigation } from '@ng-native/router';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { API_BASE_URL } from './mock-auth/mock-auth.config.ts';
import { Session } from './session.ts';

/** The calls that carry credentials in the body, and so never a Bearer token or a retry. */
const isCredentialCall = (url: string) => url.endsWith('/auth/login') || url.endsWith('/auth/refresh');

const withBearer = (req: HttpRequest<unknown>, token: string | null) =>
  token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

const isTokenExpired = (error: unknown) =>
  error instanceof HttpErrorResponse && error.status === 401 && error.error?.error === 'token_expired';

/**
 * Adds the access token to calls to the API. When the API answers 401 `token_expired` it refreshes
 * once and sends the same request once more; when the refresh is refused it ends the session and
 * sends the person to the login screen. Anything else goes through untouched.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(API_BASE_URL) || isCredentialCall(req.url)) return next(req);
  const session = inject(Session);
  const navigation = inject(NativeNavigation);
  const sent = session.accessToken();

  return next(withBearer(req, sent)).pipe(
    catchError((error: unknown) => {
      if (!isTokenExpired(error)) return throwError(() => error);
      // Another request may have refreshed while this one was in flight: use its token, do not rotate again.
      const refreshed = session.accessToken() !== sent ? Promise.resolve(true) : session.refresh();
      return from(refreshed).pipe(
        switchMap((ok) => {
          if (ok) {
            session.note($localize`:@@login.log.retried:Access token expired, refreshed, request retried`);
            return next(withBearer(req, session.accessToken()));
          }
          return from(session.expire()).pipe(
            switchMap(async (ended) => {
              if (ended) await navigation.reset('/login');
              throw error;
            }),
          );
        }),
      );
    }),
  );
};
