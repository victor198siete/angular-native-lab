import {
  HttpErrorResponse,
  HttpResponse,
  type HttpEvent,
  type HttpInterceptorFn,
  type HttpRequest,
} from '@angular/common/http';
import { LOCALE_ID, Service, inject, signal } from '@angular/core';
import { mergeMap, of, throwError, timer, type Observable } from 'rxjs';
import { mockLanguage } from '../../rewards/core/mocks/language.ts';
import { buildMovements } from '../../rewards/core/mocks/movements.mock.ts';
import { buildRewards } from '../../rewards/core/mocks/rewards.mock.ts';
import type { Movement, Reward } from '../../rewards/core/models/index.ts';
import { Connectivity } from './connectivity.ts';
import { API_URL, OFFLINE_CONFIG } from './offline-config.ts';

/** What the redemption request carries. `id` is made by the app, once per redemption: it is the idempotency key. */
export interface RedeemRequest {
  readonly id: string;
  readonly rewardId: string;
  readonly points: number;
}

/**
 * What the "server" remembers between calls, and the lab switch that makes it fail. It lives in
 * the root injector, so it outlives the screen: a redemption sent before leaving the demo is still
 * a duplicate when the app sends it again.
 */
@Service()
export class FakeServer {
  /** Lab switch: every request is answered with a 500. */
  readonly failing = signal(false);
  /** Ids the server has accepted, in order. */
  readonly accepted: string[] = [];
  /** Every redemption request that reached it, accepted or not. */
  readonly attempts: string[] = [];
}

interface Reply {
  readonly status: number;
  readonly body: unknown;
}

/**
 * A fake API as the last interceptor of the chain, so the real HttpClient runs as it would against
 * a network and only the final hop is answered here. Requests to any other host go on untouched.
 *
 *   GET  /catalog      -> the first rewards of the Rewards demo's catalog
 *   GET  /history      -> the first movements of its history
 *   POST /redemptions  { id, rewardId, points } -> 201, or 409 if the id was accepted before
 *
 * Offline (no network, or the lab switch), nothing is answered: the request fails with status 0,
 * as a request with no connection does. With "Server errors" on, every request answers 500.
 */
export const offlineApiServer: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(API_URL)) return next(req);
  const server = inject(FakeServer);
  const connectivity = inject(Connectivity);
  const config = inject(OFFLINE_CONFIG);
  const language = mockLanguage(inject(LOCALE_ID));

  const noConnection = (): Reply => ({ status: 0, body: { error: 'no_connection' } });

  const answer = (): Reply => {
    // The connection can drop while the request is in flight, so it is checked when the answer is due.
    if (!connectivity.online()) return noConnection();
    const route = `${req.method} ${req.url.slice(API_URL.length)}`;
    if (route === 'POST /redemptions') {
      const body = req.body as RedeemRequest | null;
      if (body) server.attempts.push(body.id);
      if (server.failing()) return { status: 500, body: { error: 'server_error' } };
      if (!body?.id) return { status: 400, body: { error: 'missing_id' } };
      if (server.accepted.includes(body.id)) return { status: 409, body: { error: 'duplicate' } };
      server.accepted.push(body.id);
      return { status: 201, body: { id: body.id } };
    }
    if (server.failing()) return { status: 500, body: { error: 'server_error' } };
    switch (route) {
      case 'GET /catalog':
        return { status: 200, body: buildRewards(language).slice(0, config.pageSize) satisfies Reward[] };
      case 'GET /history':
        return { status: 200, body: newestFirst(buildMovements(language)).slice(0, config.pageSize) };
      default:
        return { status: 404, body: { error: 'not_found' } };
    }
  };

  // A request sent with no connection fails at once; one sent online takes the latency to be answered.
  return respond(req, connectivity.online() ? config.latencyMs : 0, answer);
};

const newestFirst = (movements: readonly Movement[]): Movement[] =>
  [...movements].sort((a, b) => b.date.localeCompare(a.date));

function respond(req: HttpRequest<unknown>, latencyMs: number, answer: () => Reply): Observable<HttpEvent<unknown>> {
  return timer(latencyMs).pipe(
    mergeMap(() => {
      const { status, body } = answer();
      return status > 0 && status < 400
        ? of(new HttpResponse({ status, body, url: req.url }))
        : throwError(() => new HttpErrorResponse({ status, error: body, url: req.url, statusText: 'Error' }));
    }),
  );
}
