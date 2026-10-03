import { Component, DestroyRef, LOCALE_ID, computed, inject, input, signal } from '@angular/core';
import { Pressable, SafeAreaView, ScrollView, Text, View } from '@ng-native/components';
import { Sharing } from '@ng-native/device';
import { Brightness } from '@ng-native/expo/brightness';
import { Clipboard } from '@ng-native/expo/clipboard';
import { Haptics } from '@ng-native/expo/haptics';
import { KeepAwake } from '@ng-native/expo/keep-awake';
import { ScreenCapture } from '@ng-native/expo/screen-capture';
import { NgIcon } from '@ng-native/icons';
import { NativeHeader } from '@ng-native/router';
import { RewardsStore } from '../../core/rewards.store.ts';
import { dayLabel } from '../../shared/format.ts';
import { provideUiIcons } from '../../shared/icons.ts';
import { qrSvg } from '../../shared/qr.ts';
import { voucherCode } from '../../shared/voucher-code.ts';

/** Tag for the keep-awake hold and the screen-capture key, so other screens do not undo them. */
const HOLD = 'voucher';
const COPIED_MS = 2000;

/**
 * A redemption's code, ready to show at the counter: a QR the partner scans, at full brightness,
 * with the screen kept on and kept out of screenshots. Everything is put back when the screen
 * closes.
 */
@Component({
  selector: 'app-voucher-screen',
  imports: [NativeHeader, NgIcon, Pressable, SafeAreaView, ScrollView, Text, View],
  providers: [provideUiIcons()],
  host: { style: 'flex: 1' },
  template: `
    <native-header [title]="title" />
    @let v = voucher();
    @if (!v) {
      <view class="flex-1 items-center justify-center bg-canvas px-5 dark:bg-canvas-dk">
        <text testID="voucher-missing" class="text-h2 font-bold text-ink dark:text-ink-dk" i18n="@@voucher.notFound">Code not found</text>
      </view>
    } @else {
      <safe-area-view [edges]="['bottom']" class="flex-1 bg-canvas dark:bg-canvas-dk">
        <scroll-view [contentContainerStyle]="{ padding: 20, gap: 20, alignItems: 'center' }">
          <text class="text-center text-body text-ink2 dark:text-ink2-dk" i18n="@@voucher.hint">Show this code at the counter.</text>
          <view class="w-full items-center gap-4 rounded-xl bg-white p-6 shadow-card">
            <ng-icon testID="voucher-qr" [svg]="qr()" [size]="240" [accessibilityLabel]="qrLabel()" />
            <text testID="voucher-code" class="text-h2 font-bold tracking-widest tabular-nums text-black">{{ v.code }}</text>
          </view>
          <view class="items-center gap-1">
            <text class="text-center text-title font-semibold text-ink dark:text-ink-dk">{{ v.title }}</text>
            <text class="text-caption text-ink2 dark:text-ink2-dk">{{ v.day }}</text>
          </view>
          @if (tookScreenshot()) {
            <text testID="voucher-screenshot" class="text-center text-caption font-semibold text-warn dark:text-warn-dk" accessibilityRole="alert" i18n="@@voucher.screenshot">A screenshot was taken. Anyone with it can use your code.</text>
          }
          <view class="w-full flex-row gap-3">
            <pressable
              testID="voucher-copy"
              class="h-12 flex-1 items-center justify-center rounded-full bg-raised dark:bg-raised-dk"
              accessibilityRole="button"
              (press)="copy()"
            >
              <text class="text-body font-semibold text-ink dark:text-ink-dk">{{ copied() ? copiedText : copyText }}</text>
            </pressable>
            <pressable
              testID="voucher-share"
              class="h-12 flex-1 items-center justify-center rounded-full bg-raised dark:bg-raised-dk"
              accessibilityRole="button"
              (press)="share()"
            >
              <text class="text-body font-semibold text-ink dark:text-ink-dk" i18n="@@voucher.share">Share</text>
            </pressable>
          </view>
        </scroll-view>
      </safe-area-view>
    }
  `,
})
export class VoucherScreen {
  /** The redeem movement's id, bound from `:id`. */
  readonly id = input.required<string>();

  private readonly store = inject(RewardsStore);
  private readonly locale = inject(LOCALE_ID);
  private readonly clipboard = inject(Clipboard);
  private readonly sharing = inject(Sharing);
  private readonly haptics = inject(Haptics);
  private readonly capture = inject(ScreenCapture);

  protected readonly title = $localize`:@@voucher.title:Your code`;
  protected readonly copyText = $localize`:@@voucher.copy:Copy`;
  protected readonly copiedText = $localize`:@@voucher.copied:Copied`;

  protected readonly voucher = computed(() => {
    const movement = this.store.movements().find((m) => m.id === this.id() && m.type === 'redeem');
    if (!movement) return null;
    return {
      title: movement.description,
      code: voucherCode(movement.id),
      day: dayLabel(movement.date.slice(0, 10), this.locale, new Date(), false),
    };
  });
  protected readonly qr = computed(() => qrSvg(this.voucher()?.code ?? '').svg);
  protected readonly qrLabel = computed(() => {
    const code = this.voucher()?.code ?? '';
    return $localize`:@@voucher.qr.a11y:QR code for ${code}:code:`;
  });

  /** Screenshots taken while this screen is open (the counter is app-wide). */
  private readonly screenshotsAtOpen = this.capture.screenshots();
  protected readonly tookScreenshot = computed(
    () => this.capture.screenshots() > this.screenshotsAtOpen,
  );

  protected readonly copied = signal(false);
  private copiedTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    const restoreBrightness = inject(Brightness).set(1);
    const releaseScreen = inject(KeepAwake).hold(HOLD);
    void this.capture.prevent(HOLD);
    inject(DestroyRef).onDestroy(() => {
      restoreBrightness();
      releaseScreen();
      void this.capture.allow(HOLD);
      clearTimeout(this.copiedTimer);
    });
  }

  protected async copy(): Promise<void> {
    const v = this.voucher();
    if (!v) return;
    await this.clipboard.write(v.code);
    this.haptics.select();
    this.copied.set(true);
    clearTimeout(this.copiedTimer);
    this.copiedTimer = setTimeout(() => this.copied.set(false), COPIED_MS);
  }

  protected async share(): Promise<void> {
    const v = this.voucher();
    if (!v) return;
    const message = $localize`:@@voucher.share.message:My code for ${v.title}:title:: ${v.code}:code:`;
    await this.sharing.share({ message });
  }
}
