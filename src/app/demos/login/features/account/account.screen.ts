import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Pressable, SafeAreaView, ScrollView, Text, View } from '@ng-native/components';
import { NgIcon } from '@ng-native/icons';
import { NativeHeader, NativeNavigation } from '@ng-native/router';
import { Theme } from '../../../../core/theme.ts';
import { ICON_COLOR, provideUiIcons } from '../../../rewards/shared/icons.ts';
import { AUTH_CLOCK } from '../../core/mock-auth/mock-auth.config.ts';
import { Session } from '../../core/session.ts';

const pad = (n: number) => String(n).padStart(2, '0');

/** HH:MM:SS from a timestamp, in the phone's time zone. Not locale formatted: it reads the same in both languages. */
const clockTime = (at: number) => {
  const date = new Date(at);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

/**
 * The signed-in side: the profile from `GET /me`, a countdown to the access token's expiry, a
 * button that calls the API (press it after the countdown reaches zero and the activity log shows
 * the refresh and the retry), "Lock" to simulate closing the app, and "Log out".
 */
@Component({
  selector: 'app-account-screen',
  imports: [NativeHeader, NgIcon, Pressable, SafeAreaView, ScrollView, Text, View],
  providers: [provideUiIcons()],
  host: { style: 'flex: 1' },
  template: `
    <native-header [title]="title" [hideBackButton]="true" />
    <safe-area-view [edges]="['bottom']" class="flex-1 bg-canvas dark:bg-canvas-dk">
      <scroll-view [contentContainerStyle]="{ padding: 20, gap: 16, paddingBottom: 48 }">
        <view class="gap-1 rounded-lg bg-surface p-5 shadow-card dark:bg-surface-dk dark:shadow-card-dk">
          @if (session.profile(); as profile) {
            <text testID="account-name" class="text-h2 font-black text-ink dark:text-ink-dk">{{ profile.name }}</text>
            <text testID="account-email" class="text-body text-ink2 dark:text-ink2-dk">{{ profile.email }}</text>
            <text class="text-caption text-ink2 dark:text-ink2-dk">{{ memberSinceText(profile.memberSince) }}</text>
          } @else {
            <text testID="account-loading" class="text-body text-ink2 dark:text-ink2-dk" i18n="@@login.account.loading">Loading your profile…</text>
          }
        </view>

        <view class="gap-1 rounded-lg bg-surface p-5 shadow-card dark:bg-surface-dk dark:shadow-card-dk">
          <text class="text-over font-bold text-ink2 dark:text-ink2-dk" i18n="@@login.account.token">ACCESS TOKEN</text>
          <text
            testID="account-countdown"
            [class]="isExpired() ? 'text-h1 font-black text-loss dark:text-loss-dk' : 'text-h1 font-black text-ink dark:text-ink-dk'"
          >{{ countdownText() }}</text>
          <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@login.account.tokenHint">Short on purpose. After it reaches zero, the next call refreshes it by itself.</text>
        </view>

        <pressable
          testID="account-call"
          class="grad-brand h-14 flex-row items-center justify-center gap-2 rounded-lg shadow-cta"
          accessibilityRole="button"
          [disabled]="calling()"
          [accessibilityState]="{ disabled: calling(), busy: calling() }"
          (press)="callApi()"
        >
          <text class="text-title font-bold text-white">{{ calling() ? callingText : callText }}</text>
        </pressable>
        @if (callFailed()) {
          <text testID="account-call-error" class="text-center text-caption font-semibold text-loss dark:text-loss-dk" accessibilityRole="alert" i18n="@@login.account.callFailed">The call failed.</text>
        }

        <view class="gap-2">
          <text class="text-over font-bold text-ink2 dark:text-ink2-dk" i18n="@@login.account.activity">ACTIVITY</text>
          @for (entry of session.activity(); track entry.id) {
            <view class="flex-row gap-3 rounded-md bg-surface px-4 py-3 dark:bg-surface-dk">
              <text class="text-caption font-semibold text-ink2 dark:text-ink2-dk">{{ timeOf(entry.at) }}</text>
              <text class="flex-1 text-caption text-ink dark:text-ink-dk">{{ entry.text }}</text>
            </view>
          } @empty {
            <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@login.account.noActivity">Nothing yet.</text>
          }
        </view>

        <view class="flex-row gap-3">
          <pressable
            testID="account-lock"
            class="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-full bg-raised dark:bg-raised-dk"
            accessibilityRole="button"
            (press)="lock()"
          >
            <ng-icon name="lucideLock" [size]="18" [color]="ink()" />
            <text class="text-body font-semibold text-ink dark:text-ink-dk" i18n="@@login.account.lock">Lock</text>
          </pressable>
          <pressable
            testID="account-logout"
            class="h-12 flex-1 items-center justify-center rounded-full bg-raised dark:bg-raised-dk"
            accessibilityRole="button"
            [disabled]="leaving()"
            [accessibilityState]="{ disabled: leaving(), busy: leaving() }"
            (press)="logout()"
          >
            <text class="text-body font-semibold text-loss dark:text-loss-dk" i18n="@@login.account.logout">Log out</text>
          </pressable>
        </view>
      </scroll-view>
    </safe-area-view>
  `,
})
export class AccountScreen {
  protected readonly session = inject(Session);
  private readonly navigation = inject(NativeNavigation);
  private readonly clock = inject(AUTH_CLOCK);
  private readonly theme = inject(Theme);

  protected readonly title = $localize`:@@login.account.title:Account`;
  protected readonly callText = $localize`:@@login.account.call:Call the API`;
  protected readonly callingText = $localize`:@@login.account.calling:Calling…`;

  protected readonly calling = signal(false);
  protected readonly callFailed = signal(false);
  protected readonly leaving = signal(false);
  protected readonly ink = computed(() => (this.theme.isDark() ? ICON_COLOR.ink.dark : ICON_COLOR.ink.light));

  /** Ticks once a second; the countdown is derived from it, not stored. */
  private readonly now = signal(this.clock());
  protected readonly remainingSeconds = computed(() => {
    const expiresAt = this.session.accessExpiresAt();
    return expiresAt === null ? null : Math.max(0, Math.ceil((expiresAt - this.now()) / 1000));
  });
  protected readonly isExpired = computed(() => this.remainingSeconds() === 0);
  protected readonly countdownText = computed(() => {
    const seconds = this.remainingSeconds();
    if (seconds === null) return '-';
    return seconds === 0
      ? $localize`:@@login.account.expired:Expired`
      : $localize`:@@login.account.expiresIn:${seconds}:seconds: s left`;
  });

  constructor() {
    const timer = setInterval(() => this.now.set(this.clock()), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
    // The profile is the first thing the account needs: fetched on arrival, through the same path as the button.
    if (this.session.profile() === null) void this.session.fetchProfile();
  }

  protected timeOf(at: number): string {
    return clockTime(at);
  }

  protected memberSinceText(date: string): string {
    return $localize`:@@login.account.memberSince:Member since ${date}:date:`;
  }

  protected async callApi(): Promise<void> {
    this.calling.set(true);
    this.callFailed.set(false);
    try {
      // The expired-token case is the interceptor's: it refreshes and retries, and this just waits.
      this.callFailed.set(!(await this.session.fetchProfile()));
    } finally {
      this.calling.set(false);
    }
  }

  protected async lock(): Promise<void> {
    this.session.lock();
    await this.navigation.reset('/login');
  }

  protected async logout(): Promise<void> {
    this.leaving.set(true);
    try {
      await this.session.logout();
      await this.navigation.reset('/login');
    } finally {
      this.leaving.set(false);
    }
  }
}
