import {
  HttpErrorResponse,
  HttpResponse,
  type HttpEvent,
  type HttpInterceptorFn,
  type HttpRequest,
} from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { mergeMap, of, throwError, timer, type Observable } from 'rxjs';
import { decodeToken, encodeToken, type TokenClaims } from './fake-jwt.ts';
import { API_BASE_URL, AUTH_CLOCK, MOCK_AUTH_CONFIG } from './mock-auth.config.ts';
import { SEED_USER } from './seed.ts';

export interface TokenPair {
  readonly accessToken: string;
  readonly refreshToken: string;
}

interface Reply {
  readonly status: number;
  readonly body: unknown;
}

const unauthorized = (error: string): Reply => ({ status: 401, body: { error } });

/**
 * What the "server" remembers between calls: the refresh tokens it has retired. A refresh token
 * is good once - using it, or logging out with it, retires it. Everything else is in the token.
 * Remembering only retired ones (not issued ones) means a JavaScript reload of the app does not
 * invalidate the refresh token the keychain still holds.
 */
@Service()
export class MockAuthDb {
  readonly retired = new Set<string>();
  counter = 0;
}

/**
 * A mock auth server as the last interceptor of the chain: the real HttpClient and the app's own
 * interceptors run as they would against a network, and only the final hop is answered here.
 * Requests to any other host go on to the backend untouched.
 *
 *   POST /auth/login    { email, password }   -> { accessToken, refreshToken }
 *   POST /auth/refresh  { refreshToken }      -> a new pair; the old refresh token is retired
 *   GET  /me            Bearer access token   -> the profile, or 401 { error: 'token_expired' }
 *   POST /auth/logout   { refreshToken }      -> 204
 */
export const mockAuthServer: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(API_BASE_URL)) return next(req);
  const db = inject(MockAuthDb);
  const clock = inject(AUTH_CLOCK);
  const config = inject(MOCK_AUTH_CONFIG);

  const issue = (typ: TokenClaims['typ'], ttl: number): string => {
    const iat = Math.floor(clock() / 1000);
    return encodeToken({
      sub: SEED_USER.id,
      email: SEED_USER.email,
      iat,
      exp: iat + ttl,
      typ,
      jti: `${iat}-${++db.counter}`,
    });
  };
  const issuePair = (): TokenPair => ({
    accessToken: issue('access', config.accessTtlSeconds),
    refreshToken: issue('refresh', config.refreshTtlSeconds),
  });
  const expired = (claims: TokenClaims) => clock() / 1000 >= claims.exp;

  /** The refresh token's claims if the server would accept it, else `null`. */
  const validRefresh = (token: unknown): TokenClaims | null => {
    const claims = decodeToken(typeof token === 'string' ? token : null);
    return claims?.typ === 'refresh' && claims.sub === SEED_USER.id && !expired(claims) && !db.retired.has(claims.jti)
      ? claims
      : null;
  };

  // Answered after the delay, so a token that expires while the "request" is in flight is judged
  // when the server would have looked at it.
  const answer = (): Reply => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const route = `${req.method} ${req.url.slice(API_BASE_URL.length)}`;
    switch (route) {
      case 'POST /auth/login': {
        const email = typeof body['email'] === 'string' ? body['email'].trim().toLowerCase() : '';
        return email === SEED_USER.email && body['password'] === SEED_USER.password
          ? { status: 200, body: issuePair() }
          : unauthorized('invalid_credentials');
      }
      case 'POST /auth/refresh': {
        const claims = validRefresh(body['refreshToken']);
        if (!claims) return unauthorized('invalid_refresh_token');
        db.retired.add(claims.jti);
        return { status: 200, body: issuePair() };
      }
      case 'GET /me': {
        const claims = decodeToken(bearer(req));
        if (claims?.typ !== 'access') return unauthorized('invalid_token');
        if (expired(claims)) return unauthorized('token_expired');
        return {
          status: 200,
          body: { id: SEED_USER.id, email: SEED_USER.email, name: SEED_USER.name, memberSince: SEED_USER.memberSince },
        };
      }
      case 'POST /auth/logout': {
        const claims = decodeToken(typeof body['refreshToken'] === 'string' ? body['refreshToken'] : null);
        if (claims) db.retired.add(claims.jti);
        return { status: 204, body: null };
      }
      default:
        return { status: 404, body: { error: 'not_found' } };
    }
  };

  return respond(req, config.latencyMs, answer);
};

function bearer(req: HttpRequest<unknown>): string | null {
  const header = req.headers.get('Authorization');
  return header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : null;
}

function respond(req: HttpRequest<unknown>, latencyMs: number, answer: () => Reply): Observable<HttpEvent<unknown>> {
  return timer(latencyMs).pipe(
    mergeMap(() => {
      const { status, body } = answer();
      return status < 400
        ? of(new HttpResponse({ status, body, url: req.url }))
        : throwError(() => new HttpErrorResponse({ status, error: body, url: req.url, statusText: 'Error' }));
    }),
  );
}
