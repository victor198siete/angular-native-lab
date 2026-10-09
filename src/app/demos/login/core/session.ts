import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';
import { SecureStorage } from '@ng-native/expo/secure-store';
import { firstValueFrom } from 'rxjs';
import { decodeToken } from './mock-auth/fake-jwt.ts';
import { API_BASE_URL, AUTH_CLOCK } from './mock-auth/mock-auth.config.ts';
import type { TokenPair } from './mock-auth/mock-auth.server.ts';

/** Keychain key for the token pair. The password has no key: it is never stored. */
export const TOKENS_KEY = 'login.tokens';

const LOG_LIMIT = 20;

export interface Profile {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly memberSince: string;
}

export interface ActivityEntry {
  readonly id: number;
  /** Milliseconds, from the same clock the countdown uses. */
  readonly at: number;
  readonly text: string;
}

export type LoginResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly reason: 'invalid-credentials' | 'network' };

/**
 * The signed-in state of the Login demo. The token pair lives in the keychain and is read
 * synchronously, so a route guard knows on the very first navigation whether a session was left
 * behind. "Unlocked" is separate and lives only in memory: it is what a new app run does not have
 * until the person proves who they are again (the password, or Face ID through the refresh token).
 */
@Service()
export class Session {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(SecureStorage);
  private readonly clock = inject(AUTH_CLOCK);

  /** Persisted. `null` when nobody is signed in on this phone. */
  readonly tokens = this.storage.signal<TokenPair | null>(TOKENS_KEY, null);
  readonly accessToken = computed(() => this.tokens()?.accessToken ?? null);
  readonly hasRefreshToken = computed(() => !!this.tokens()?.refreshToken);

  private readonly _unlocked = signal(false);
  /** Proven in this app run. A refresh token left in the keychain does not count. */
  readonly unlocked = this._unlocked.asReadonly();
  /** What the route guard checks. */
  readonly signedIn = computed(() => this.tokens() !== null && this._unlocked());

  /** The profile from `GET /me`, once fetched. */
  readonly profile = signal<Profile | null>(null);
  /** When the current access token stops being accepted, in milliseconds. Read from its `exp` claim. */
  readonly accessExpiresAt = computed(() => {
    const claims = decodeToken(this.accessToken());
    return claims ? claims.exp * 1000 : null;
  });

  private readonly _activity = signal<readonly ActivityEntry[]>([]);
  /** What the session did, newest first: the thing to point the camera at. */
  readonly activity = this._activity.asReadonly();
  private entries = 0;

  /** The one refresh in flight, shared by every caller that finds the access token expired. */
  private refreshing: Promise<boolean> | null = null;

  /** Exchanges the credentials for a token pair. The password goes to the server and no further. */
  async login(email: string, password: string): Promise<LoginResult> {
    try {
      const pair = await firstValueFrom(
        this.http.post<TokenPair>(`${API_BASE_URL}/auth/login`, { email: email.trim(), password }),
      );
      this.tokens.set(pair);
      this._unlocked.set(true);
      this.note($localize`:@@login.log.signedIn:Signed in with email and password`);
      return { ok: true };
    } catch (error) {
      return { ok: false, reason: error instanceof HttpErrorResponse && error.status === 401 ? 'invalid-credentials' : 'network' };
    }
  }

  /**
   * Trades the refresh token for a new pair; the server retires the old refresh token, so the
   * stored one is replaced. Callers that arrive while a refresh is running get that same call
   * instead of starting a second one - with rotation, a second call would use a retired token.
   * Resolves `false` (never rejects) when there is nothing to refresh with or the server says no.
   */
  refresh(): Promise<boolean> {
    return (this.refreshing ??= this.requestRefresh().finally(() => (this.refreshing = null)));
  }

  private async requestRefresh(): Promise<boolean> {
    const refreshToken = this.tokens()?.refreshToken;
    if (!refreshToken) return false;
    try {
      this.tokens.set(await firstValueFrom(this.http.post<TokenPair>(`${API_BASE_URL}/auth/refresh`, { refreshToken })));
      return true;
    } catch {
      return false;
    }
  }

  /** Opens the session again from the stored refresh token, after Face ID. Clears it if the server refuses. */
  async resume(): Promise<boolean> {
    if (!(await this.refresh())) {
      await this.expire();
      return false;
    }
    this._unlocked.set(true);
    this.note($localize`:@@login.log.resumed:Face ID passed, session refreshed`);
    return true;
  }

  /** Reads `GET /me`. A stale access token is refreshed and the call retried by the interceptor. */
  async fetchProfile(): Promise<boolean> {
    try {
      this.profile.set(await firstValueFrom(this.http.get<Profile>(`${API_BASE_URL}/me`)));
      return true;
    } catch {
      return false;
    }
  }

  /** Tells the server, then forgets everything. The server call is best effort: signing out must not depend on the network. */
  async logout(): Promise<void> {
    const refreshToken = this.tokens()?.refreshToken;
    if (refreshToken) {
      try {
        await firstValueFrom(this.http.post(`${API_BASE_URL}/auth/logout`, { refreshToken }));
      } catch {
        // Offline, say. The tokens go either way.
      }
    }
    await this.clear();
    this._activity.set([]);
  }

  /** The refresh failed: drop the session, keep the log so the reason can be read. Returns whether there was a session to drop. */
  async expire(): Promise<boolean> {
    if (this.tokens() === null) return false;
    await this.clear();
    this.note($localize`:@@login.log.expired:Refresh refused, session closed`);
    return true;
  }

  /**
   * Simulates closing the app: the in-memory unlock is gone and the refresh token stays, which is
   * the state a fresh launch finds. The way back in is Face ID (or the password).
   */
  lock(): void {
    this._unlocked.set(false);
    this.profile.set(null);
    this.note($localize`:@@login.log.locked:Locked, refresh token kept`);
  }

  /** Adds a line to the activity log. */
  note(text: string): void {
    this._activity.update((list) => [{ id: ++this.entries, at: this.clock(), text }, ...list].slice(0, LOG_LIMIT));
  }

  private async clear(): Promise<void> {
    this._unlocked.set(false);
    this.profile.set(null);
    await this.storage.remove(TOKENS_KEY);
  }
}
