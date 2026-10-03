import { Component, LOCALE_ID, computed, inject } from '@angular/core';
import { Pressable, Switch, Text, View } from '@ng-native/components';
import { NgIcon } from '@ng-native/icons';
import { Theme } from '../../../core/theme.ts';
import { RewardsStore } from '../core/rewards.store.ts';
import { dayLabel } from '../shared/format.ts';
import { ICON_COLOR, provideUiIcons } from '../shared/icons.ts';
import { voucherCode } from '../shared/voucher-code.ts';
import { biometricError, biometricName } from './biometric-text.ts';
import { VaultLock } from './vault-lock.ts';

const MASK = 'LAB-••••-••••';
const SHOWN = 5;

/**
 * The wallet's vault: the voucher codes of recent redemptions, hidden until the person
 * authenticates, and the opt-in lock on launch. The codes come from the redeem movements, as they
 * would come from the API in a real app; nothing about them is stored on the device.
 */
@Component({
  selector: 'app-vault-panel',
  imports: [NgIcon, Pressable, Switch, Text, View],
  providers: [provideUiIcons()],
  template: `
    <view class="gap-3">
      <view class="flex-row items-center justify-between">
        <text class="text-h2 font-bold text-ink dark:text-ink-dk" i18n="@@vault.codes.title">My codes</text>
        @if (codes().length > 0 && !revealed()) {
          <pressable
            testID="vault-reveal"
            class="min-h-11 flex-row items-center gap-1 justify-center"
            accessibilityRole="button"
            [accessibilityLabel]="revealText()"
            [disabled]="lock.busy()"
            (press)="reveal()"
          >
            <ng-icon name="lucideEye" [size]="18" [color]="brand()" />
            <text class="text-body font-semibold text-brand-text dark:text-brand-text-dk">{{ revealText() }}</text>
          </pressable>
        }
      </view>
      <view class="overflow-hidden rounded-xl bg-surface dark:bg-surface-dk">
        @for (item of codes(); track item.id; let last = $last) {
          <view class="h-16 flex-row items-center gap-3 px-5" [class]="last ? '' : 'border-b border-line dark:border-line-dk'">
            <ng-icon name="lucideTicket" [size]="20" [color]="brand()" />
            <view class="flex-1 gap-0.5">
              <text class="text-body font-semibold text-ink dark:text-ink-dk" [numberOfLines]="1">{{ item.title }}</text>
              <text class="text-caption text-ink2 dark:text-ink2-dk">{{ item.day }}</text>
            </view>
            <text testID="vault-code" class="text-body font-bold tracking-widest tabular-nums text-ink dark:text-ink-dk">{{ revealed() ? item.code : mask }}</text>
          </view>
        } @empty {
          <text class="px-5 py-4 text-body text-ink2 dark:text-ink2-dk" i18n="@@vault.codes.empty">Redeem a reward to get a code.</text>
        }
      </view>
      @if (errorText(); as message) {
        <text testID="vault-error" class="text-caption font-semibold text-loss dark:text-loss-dk" accessibilityRole="alert">{{ message }}</text>
      }

      <view class="flex-row items-center gap-3 rounded-xl bg-surface px-5 py-3 dark:bg-surface-dk">
        <ng-icon name="lucideLock" [size]="20" [color]="ink()" />
        <view class="flex-1 gap-0.5">
          <text class="text-body font-semibold text-ink dark:text-ink-dk">{{ lockText() }}</text>
          @if (lock.available() === false) {
            <text testID="vault-lock-unavailable" class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@vault.lockOnLaunch.unavailable">Not available on this phone.</text>
          }
        </view>
        <switch
          testID="vault-lock-switch"
          [accessibilityLabel]="lockText()"
          [checked]="lock.lockOnLaunch()"
          [disabled]="lock.available() !== true || lock.busy()"
          (checkedChange)="toggleLock($event)"
        />
      </view>
    </view>
  `,
})
export class VaultPanel {
  protected readonly lock = inject(VaultLock);
  private readonly store = inject(RewardsStore);
  private readonly theme = inject(Theme);
  private readonly locale = inject(LOCALE_ID);
  protected readonly ink = computed(() => (this.theme.isDark() ? ICON_COLOR.ink.dark : ICON_COLOR.ink.light));
  protected readonly brand = computed(() => (this.theme.isDark() ? ICON_COLOR.brand.dark : ICON_COLOR.brand.light));
  protected readonly mask = MASK;

  /** One authentication unlocks the session: the codes, like the app, stay open until restart. */
  protected readonly revealed = this.lock.unlocked;

  protected readonly codes = computed(() =>
    [...this.store.movements()]
      .filter((m) => m.type === 'redeem')
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, SHOWN)
      .map((m) => ({
        id: m.id,
        title: m.description,
        day: dayLabel(m.date.slice(0, 10), this.locale, new Date(), false),
        code: voucherCode(m.id),
      })),
  );

  private readonly name = computed(() => biometricName(this.lock.kinds()));
  protected readonly revealText = computed(() => {
    const name = this.name();
    return $localize`:@@vault.codes.reveal:Show with ${name}:name:`;
  });
  protected readonly lockText = computed(() => {
    const name = this.name();
    return $localize`:@@vault.lockOnLaunch:Ask for ${name}:name: when the app opens`;
  });
  protected readonly errorText = computed(() => {
    const error = this.lock.lastError();
    return error ? biometricError(error) : null;
  });

  constructor() {
    void this.lock.check();
  }

  protected async reveal(): Promise<void> {
    const reason = $localize`:@@vault.prompt.codes:Show your voucher codes`;
    await this.lock.authenticate(reason);
  }

  protected async toggleLock(on: boolean): Promise<void> {
    const reason = $localize`:@@vault.prompt.enable:Turn on the lock`;
    await this.lock.setLockOnLaunch(on, reason);
  }
}
