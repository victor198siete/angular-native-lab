import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Session } from '../session.ts';
import { render } from '@ng-native/testing';
import { firstValueFrom } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { App } from '../../../../app.ts';
import { routes } from '../../../../app.routes.ts';
import { withComponentInputBinding } from '@angular/router';
import { provideNativeRouter } from '@ng-native/router';
import { fakeBackend, fakeBiometrics, fakeKeychain } from '../../testing.ts';
import { decodeToken } from './fake-jwt.ts';
import { SEED_USER } from './seed.ts';

const BASE = 'https://api.lab.invalid';

async function server(config = {}) {
  const backend = fakeBackend(undefined, config);
  const { componentRef } = await render(App, {
    providers: [
      fakeBiometrics().provider,
      fakeKeychain().provider,
      ...backend.providers,
      provideNativeRouter(routes, withComponentInputBinding()),
    ],
  });
  const http = componentRef.injector.get(HttpClient);
  const call = (method: string, path: string, body?: unknown, headers: Record<string, string> = {}) =>
    firstValueFrom(http.request(method, BASE + path, { body, headers })).catch((e: HttpErrorResponse) => e);
  const login = () => call('POST', '/auth/login', { email: SEED_USER.email, password: SEED_USER.password }) as Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
  return { backend, call, login, session: componentRef.injector.get(Session) };
}

describe('mock auth server', () => {
  it('login answers fake JWTs with a literal signature and a short access lifetime', async () => {
    const { login } = await server();
    const pair = await login();

    expect(pair.accessToken.split('.')[2]).toBe('mock-signature');
    const access = decodeToken(pair.accessToken)!;
    const refresh = decodeToken(pair.refreshToken)!;
    expect(access).toMatchObject({ sub: SEED_USER.id, email: SEED_USER.email, typ: 'access' });
    expect(access.exp - access.iat).toBe(20);
    expect(refresh.exp - refresh.iat).toBe(7 * 24 * 3600);
  });

  it('the access lifetime comes from the config', async () => {
    const { login } = await server({ accessTtlSeconds: 90 });
    const access = decodeToken((await login()).accessToken)!;
    expect(access.exp - access.iat).toBe(90);
  });

  it('login with bad credentials is a 401', async () => {
    const { call } = await server();
    const error = (await call('POST', '/auth/login', { email: SEED_USER.email, password: 'nope' })) as HttpErrorResponse;
    expect(error.status).toBe(401);
  });

  it('refresh rotates: the new pair works and the old refresh token is refused', async () => {
    const { login, call } = await server();
    const first = await login();
    const second = (await call('POST', '/auth/refresh', { refreshToken: first.refreshToken })) as typeof first;
    expect(second.refreshToken).not.toBe(first.refreshToken);

    const reuse = (await call('POST', '/auth/refresh', { refreshToken: first.refreshToken })) as HttpErrorResponse;
    expect(reuse.status).toBe(401);
    const again = await call('POST', '/auth/refresh', { refreshToken: second.refreshToken });
    expect((again as typeof first).accessToken).toBeTruthy();
  });

  it('refresh refuses an unknown or expired token', async () => {
    const { login, call, backend } = await server();
    const pair = await login();
    expect(((await call('POST', '/auth/refresh', { refreshToken: 'garbage' })) as HttpErrorResponse).status).toBe(401);
    // An access token is not a refresh token.
    expect(((await call('POST', '/auth/refresh', { refreshToken: pair.accessToken })) as HttpErrorResponse).status).toBe(401);
    backend.clock.advance(8 * 24 * 3600);
    expect(((await call('POST', '/auth/refresh', { refreshToken: pair.refreshToken })) as HttpErrorResponse).status).toBe(401);
  });

  it('/me needs a valid Bearer token and says token_expired once it lapses', async () => {
    const { login, call, backend } = await server();
    const pair = await login();
    const auth = { Authorization: `Bearer ${pair.accessToken}` };

    expect(((await call('GET', '/me')) as HttpErrorResponse).error).toEqual({ error: 'invalid_token' });
    expect(await call('GET', '/me', undefined, auth)).toMatchObject({ email: SEED_USER.email });
    backend.clock.advance(21);
    const expired = (await call('GET', '/me', undefined, auth)) as HttpErrorResponse;
    expect(expired.status).toBe(401);
    expect(expired.error).toEqual({ error: 'token_expired' });
  });

  it('logout retires the refresh token', async () => {
    const { login, call } = await server();
    const pair = await login();
    await call('POST', '/auth/logout', { refreshToken: pair.refreshToken });
    expect(((await call('POST', '/auth/refresh', { refreshToken: pair.refreshToken })) as HttpErrorResponse).status).toBe(401);
  });
});
