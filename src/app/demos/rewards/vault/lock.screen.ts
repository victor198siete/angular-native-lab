import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Pressable, SafeAreaView, Text, View } from '@ng-native/components';
import { NgIcon } from '@ng-native/icons';
import { NativeHeader } from '@ng-native/router';
import { Theme } from '../../../core/theme.ts';
import { ICON_COLOR, provideUiIcons } from '../shared/icons.ts';
import { biometricError, biometricName } from './biometric-text.ts';
import { VaultLock } from './vault-lock.ts';

/**
 * Shown on launch while the lock is on. Asks once by itself, then waits for the button. With no
 * usable sensor it offers to turn the lock off: the lab has no password to fall back to (a real
 * app would send the person to sign in again instead).
 */
@Component({
  selector: 'app-lock-screen',
  imports: [NativeHeader, NgIcon, Pressable, SafeAreaView, Text, View],
  providers: [provideUiIcons()],
  host: { style: 'flex: 1' },
  template: `
    <native-header [hidden]="true" />
    <safe-area-view class="flex-1 items-center justify-center gap-6 bg-canvas px-8 dark:bg-canvas-dk">
      <view class="h-24 w-24 items-center justify-center rounded-full bg-raised dark:bg-raised-dk">
        <ng-icon name="lucideLock" [size]="44" [color]="ink()" />
      </view>
      <view class="items-center gap-2">
        <text testID="lock-title" class="text-center text-h1 font-black text-ink dark:text-ink-dk" i18n="@@vault.lock.title">Your rewards are locked</text>
        <text class="text-center text-body text-ink2 dark:text-ink2-dk">{{ subtitle() }}</text>
      </view>
      @if (lock.available() === false) {
        <text testID="lock-unavailable" class="text-center text-body font-semibold text-warn dark:text-warn-dk">{{ unavailableText }}</text>
        <pressable
          testID="lock-turn-off"
          class="h-12 items-center justify-center rounded-full bg-raised px-6 dark:bg-raised-dk"
          accessibilityRole="button"
          (press)="turnOff()"
        >
          <text class="text-body font-semibold text-ink dark:text-ink-dk" i18n="@@vault.lock.turnOff">Turn off the lock</text>
        </pressable>
      } @else {
        <pressable
          testID="lock-unlock"
          class="grad-brand h-14 w-full flex-row items-center justify-center gap-2 rounded-lg shadow-cta"
          accessibilityRole="button"
          [disabled]="lock.busy()"
          [accessibilityState]="{ disabled: lock.busy(), busy: lock.busy() }"
          (press)="unlock()"
        >
          <ng-icon name="lucideScanFace" [size]="22" color="#ffffff" />
          <text class="text-title font-bold text-white">{{ unlockText() }}</text>
        </pressable>
      }
      @if (errorText(); as message) {
        <text testID="lock-error" class="text-center text-caption font-semibold text-loss dark:text-loss-dk" accessibilityRole="alert">{{ message }}</text>
      }
    </safe-area-view>
  `,
})
export class LockScreen {
  protected readonly lock = inject(VaultLock);
  private readonly router = inject(Router);
  private readonly theme = inject(Theme);
  protected readonly ink = computed(() => (this.theme.isDark() ? ICON_COLOR.ink.dark : ICON_COLOR.ink.light));

  private readonly name = computed(() => biometricName(this.lock.kinds()));
  protected readonly subtitle = computed(() => {
    const name = this.name();
    return $localize`:@@vault.lock.subtitle:Use ${name}:name: to open the app.`;
  });
  protected readonly unlockText = computed(() => {
    const name = this.name();
    return $localize`:@@vault.lock.unlock:Unlock with ${name}:name:`;
  });
  protected readonly errorText = computed(() => {
    const error = this.lock.lastError();
    return error ? biometricError(error) : null;
  });
  protected readonly unavailableText = $localize`:@@vault.lock.unavailable:Biometrics are not available on this phone right now.`;

  constructor() {
    void this.start();
  }

  private async start(): Promise<void> {
    await this.lock.check();
    if (this.lock.available()) await this.unlock();
  }

  protected async unlock(): Promise<void> {
    const reason = $localize`:@@vault.prompt.open:Open your rewards`;
    if (await this.lock.authenticate(reason)) await this.enter();
  }

  protected async turnOff(): Promise<void> {
    await this.lock.setLockOnLaunch(false, '');
    await this.enter();
  }

  private async enter(): Promise<void> {
    await this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
