import { Component, DestroyRef, LOCALE_ID, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Pressable, SafeAreaView, ScrollView, Text, View } from '@ng-native/components';
import { NgIcon } from '@ng-native/icons';
import { Haptics } from '@ng-native/expo/haptics';
import { NativeHeader, NativeNavigation } from '@ng-native/router';
import { RewardsStore, type RedeemResult } from '../../core/rewards.store.ts';
import { Theme } from '../../../../core/theme.ts';
import { animatedNumber } from '../../shared/animated-number.ts';
import { ICON_COLOR, REWARD_ICON_NAME, provideRewardIcons, provideUiIcons } from '../../shared/icons.ts';
import { formatPoints } from '../../shared/format.ts';
import { categoryLabel } from '../../shared/labels.ts';
import { CATEGORY_GRADIENT } from '../../shared/tier-style.ts';
import { voucherCode } from '../../shared/voucher-code.ts';
import { RedeemSheet } from './redeem-sheet.ts';

type Phase = 'idle' | 'confirming' | 'processing' | 'success';
type Failure = Exclude<RedeemResult['status'], 'ok'>;

/** Simulated network time, so the "Processing…" state is visible. */
const PROCESSING_MS = 700;


@Component({
  selector: 'app-reward-detail-screen',
  imports: [NativeHeader, NgIcon, Pressable, RedeemSheet, SafeAreaView, ScrollView, Text, View],
  providers: [provideRewardIcons(), provideUiIcons()],
  template: `
    <native-header title="" [backTitle]="backTitle" />
    @let r = reward();
    @if (!r) {
      <view class="flex-1 items-center justify-center gap-3 bg-canvas px-5 dark:bg-canvas-dk">
        <ng-icon name="lucideSearchX" [size]="56" [color]="muted()" />
        <text testID="detail-title" class="text-h2 font-bold text-ink dark:text-ink-dk" i18n="@@detail.notFound">Reward not found</text>
      </view>
    } @else if (phase() === 'success') {
      <view class="flex-1 items-center justify-center gap-6 bg-canvas px-5 dark:bg-canvas-dk">
        <view class="pop h-28 w-28 items-center justify-center rounded-full grad-brand shadow-cta">
          <ng-icon name="lucideCheck" [size]="64" color="#ffffff" [strokeWidth]="3" />
        </view>
        <view class="items-center gap-1">
          <text class="text-center text-h1 font-black text-ink dark:text-ink-dk" accessibilityRole="alert" [accessibilityLabel]="successLabel()" i18n="@@detail.redeemed">Redeemed!</text>
          <text class="text-center text-title font-medium text-brand-text dark:text-brand-text-dk" i18n="@@detail.enjoy">Enjoy your reward</text>
        </view>
        <view class="items-center gap-1">
          <text class="chip-float text-h2 font-bold tabular-nums text-loss dark:text-loss-dk">{{ spentLabel() }}</text>
          <text testID="success-balance" class="text-display font-black tabular-nums text-ink dark:text-ink-dk">{{ balanceShown() }}</text>
          <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@detail.pointsAvailable">points available</text>
        </view>
        <view class="items-center gap-1 rounded-lg bg-surface px-5 py-4 dark:bg-surface-dk">
          <text class="text-over font-bold tracking-widest text-ink2 dark:text-ink2-dk" i18n="@@detail.code">YOUR CODE</text>
          <text testID="voucher-code" class="text-h2 font-bold tracking-widest tabular-nums text-ink dark:text-ink-dk">{{ code() }}</text>
        </view>
        <view class="items-center gap-2">
          <pressable
            testID="show-in-store"
            class="grad-brand h-12 items-center justify-center rounded-full px-6 shadow-cta"
            accessibilityRole="button"
            (press)="showInStore()"
          >
            <text class="text-body font-bold text-white" i18n="@@detail.showInStore">Show at the counter</text>
          </pressable>
          <pressable
            testID="back-to-catalog"
            class="h-12 items-center justify-center rounded-full bg-raised px-6 dark:bg-raised-dk hover:opacity-80"
            accessibilityRole="button"
            (press)="back()"
          >
            <text class="text-body font-semibold text-ink dark:text-ink-dk" i18n="@@detail.back">Back to catalog</text>
          </pressable>
          <pressable class="min-h-11 justify-center" accessibilityRole="link" (press)="goHistory()">
            <text class="text-body font-semibold text-brand-text dark:text-brand-text-dk" i18n="@@detail.viewHistory">View in history</text>
          </pressable>
        </view>
      </view>
    } @else {
      <view class="flex-1 bg-canvas dark:bg-canvas-dk">
        <scroll-view contentInsetAdjustmentBehavior="automatic" [contentContainerStyle]="{ paddingBottom: 200 }">
          <view class="mx-5 mt-2 h-72 items-center justify-center overflow-hidden rounded-xl" [class]="gradient()">
            <view class="grad-glow absolute inset-0" pointerEvents="none"></view>
            <view class="pop"><ng-icon [name]="iconName()" [size]="96" color="#ffffff" [strokeWidth]="1.5" /></view>
          </view>
          <view class="gap-3 px-5 pt-5">
            <text class="text-over font-bold tracking-widest text-brand-text dark:text-brand-text-dk">{{ partnerUpper() }}</text>
            <text testID="detail-title" class="text-h1 font-black text-ink dark:text-ink-dk">{{ r.title }}</text>
            <view class="flex-row items-baseline gap-2">
              <text testID="detail-cost" class="text-[44px] font-black tabular-nums text-ink dark:text-ink-dk">{{ costLabel() }}</text>
              <text class="text-title font-semibold text-ink2 dark:text-ink2-dk">pts</text>
            </view>
            @if (missing() > 0) {
              <text testID="detail-missing" class="text-body font-semibold text-warn dark:text-warn-dk">{{ shortLabel() }}</text>
            }
            <text class="text-body text-ink2 dark:text-ink2-dk">{{ r.description }}</text>
            <view class="gap-2 rounded-lg bg-surface p-4 dark:bg-surface-dk">
              <view class="flex-row justify-between">
                <text class="text-body text-ink2 dark:text-ink2-dk" i18n="@@detail.category">Category</text>
                <text class="text-body font-semibold text-ink dark:text-ink-dk">{{ categoryName() }}</text>
              </view>
              <view class="flex-row justify-between">
                <text class="text-body text-ink2 dark:text-ink2-dk" i18n="@@detail.availability">Availability</text>
                <text class="text-body font-semibold text-ink dark:text-ink-dk">{{ stockLabel() }}</text>
              </view>
            </view>
          </view>
        </scroll-view>

        <safe-area-view [edges]="['bottom']" class="absolute bottom-0 left-0 right-0 border-t border-line bg-canvas dark:border-line-dk dark:bg-canvas-dk">
          <view class="gap-2 px-5 pb-4 pt-3">
            <view class="flex-row justify-between">
              <text class="text-body text-ink2 dark:text-ink2-dk" i18n="@@detail.balance">Your balance</text>
              <text testID="detail-balance" class="text-body font-semibold tabular-nums text-ink dark:text-ink-dk">{{ balanceLine() }}</text>
            </view>
            @if (canRedeem()) {
              <pressable
                testID="redeem-button"
                class="grad-brand h-14 items-center justify-center rounded-lg shadow-cta hover:opacity-80"
                accessibilityRole="button"
                [accessibilityLabel]="redeemLabel()"
                (press)="phase.set('confirming')"
              >
                <text class="text-title font-bold text-white" i18n="@@detail.redeemFor">Redeem for {{ costLabel() }} pts</text>
              </pressable>
            } @else {
              <pressable
                testID="redeem-button"
                class="h-14 items-center justify-center rounded-lg bg-raised dark:bg-raised-dk"
                [disabled]="true"
                accessibilityRole="button"
                [accessibilityLabel]="disabledLabel()"
                [accessibilityState]="{ disabled: true }"
              >
                <text class="text-title font-bold text-ink2 dark:text-ink2-dk">{{ disabledText() }}</text>
              </pressable>
              @if (!soldOut()) {
                <view class="gap-1">
                  <view class="h-1.5 overflow-hidden rounded-full bg-raised dark:bg-raised-dk">
                    <view class="grad-brand h-full rounded-full" [style]="{ width: reachedPercent() + '%' }"></view>
                  </view>
                  <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@detail.reached">You're at {{ reachedPercent() }}%</text>
                </view>
              }
            }
            @if (failure(); as f) {
              <text testID="redeem-error" class="text-caption font-semibold text-loss dark:text-loss-dk" accessibilityRole="alert">{{ failureText(f) }}</text>
            }
          </view>
        </safe-area-view>

        <app-redeem-sheet
          [reward]="r"
          [balance]="balance()"
          [visible]="phase() === 'confirming' || phase() === 'processing'"
          [processing]="phase() === 'processing'"
          (confirm)="confirm()"
          (cancel)="cancel()"
        />
      </view>
    }
  `,
})
export class RewardDetailScreen {
  /** Bound from the `:id` route param by `withComponentInputBinding()`. */
  readonly id = input.required<string>();

  private readonly store = inject(RewardsStore);
  private readonly router = inject(Router);
  private readonly navigation = inject(NativeNavigation);
  private readonly haptics = inject(Haptics);
  private readonly theme = inject(Theme);
  private readonly locale = inject(LOCALE_ID);
  protected readonly backTitle = $localize`:@@tabs.catalog:Catalog`;
  protected readonly muted = computed(() => (this.theme.isDark() ? ICON_COLOR.muted.dark : ICON_COLOR.muted.light));
  private timer: ReturnType<typeof setTimeout> | undefined;

  protected readonly phase = signal<Phase>('idle');
  protected readonly failure = signal<Failure | null>(null);
  private readonly voucherSeed = signal('');

  protected readonly reward = computed(() => this.store.rewardById(this.id()));
  protected readonly balance = computed(() => this.store.member().points);
  /** Counts down from the old balance to the new one once the redeem lands. */
  protected readonly balanceShown = computed(() => formatPoints(this.balanceTween(), this.locale));
  private readonly balanceTween = animatedNumber(() => this.store.member().points, { duration: 1200 });
  /** Cost captured at redeem time: the success view reads it after the reward's stock changed. */
  private readonly spent = signal(0);

  protected readonly gradient = computed(() => {
    const r = this.reward();
    return r ? CATEGORY_GRADIENT[r.category] : '';
  });
  protected readonly iconName = computed(() => {
    const r = this.reward();
    return r ? REWARD_ICON_NAME[r.icon] : '';
  });
  protected readonly partnerUpper = computed(() => (this.reward()?.partner ?? '').toUpperCase());
  protected readonly costLabel = computed(() => formatPoints(this.reward()?.costPoints ?? 0, this.locale));
  protected readonly missing = computed(() => Math.max(0, (this.reward()?.costPoints ?? 0) - this.balance()));
  protected readonly missingLabel = computed(() => formatPoints(this.missing(), this.locale));
  protected readonly shortLabel = computed(() => {
    const missing = this.missingLabel();
    return $localize`:@@reward.short:${missing}:missing: pts short`;
  });
  protected readonly categoryName = computed(() => {
    const r = this.reward();
    return r ? categoryLabel(r.category) : '';
  });
  protected readonly redeemLabel = computed(() => {
    const cost = this.costLabel();
    return $localize`:@@detail.redeemFor.a11y:Redeem for ${cost}:cost: points`;
  });
  protected readonly soldOut = computed(() => {
    const stock = this.reward()?.stock;
    return stock !== undefined && stock <= 0;
  });
  protected readonly canRedeem = computed(() => !this.soldOut() && this.missing() === 0);
  protected readonly reachedPercent = computed(() => {
    const cost = this.reward()?.costPoints ?? 0;
    return cost === 0 ? 100 : Math.min(100, Math.floor((this.balance() / cost) * 100));
  });
  protected readonly stockLabel = computed(() => {
    const stock = this.reward()?.stock;
    if (stock === undefined) return $localize`:@@detail.unlimited:Unlimited`;
    if (stock <= 0) return $localize`:@@reward.soldOut:Sold out`;
    const left = formatPoints(stock, this.locale);
    return $localize`:@@detail.stockLeft:${left}:left: left`;
  });
  protected readonly balanceLine = computed(() => {
    const after = this.balance() - (this.reward()?.costPoints ?? 0);
    return this.canRedeem()
      ? `${formatPoints(this.balance(), this.locale)} → ${formatPoints(after, this.locale)}`
      : formatPoints(this.balance(), this.locale);
  });
  protected readonly disabledText = computed(() =>
    this.soldOut() ? $localize`:@@reward.soldOut:Sold out` : this.shortLabel(),
  );
  protected readonly disabledLabel = computed(() => {
    const missing = this.missingLabel();
    return this.soldOut()
      ? $localize`:@@detail.unavailable.soldOut:Can't redeem, sold out`
      : $localize`:@@detail.unavailable.short:Can't redeem, ${missing}:missing: points short`;
  });
  protected readonly spentLabel = computed(() => `−${formatPoints(this.spent(), this.locale)}`);
  protected readonly code = computed(() => voucherCode(this.voucherSeed()));
  protected readonly successLabel = computed(() => {
    const left = formatPoints(this.balance(), this.locale);
    return $localize`:@@detail.success.a11y:Redeemed. You have ${left}:left: points left. Code ${this.code()}:code:.`;
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected cancel(): void {
    if (this.phase() === 'confirming') this.phase.set('idle');
  }

  protected confirm(): void {
    if (this.phase() !== 'confirming') return;
    this.failure.set(null);
    this.phase.set('processing');
    this.timer = setTimeout(() => this.finish(), PROCESSING_MS);
  }

  private finish(): void {
    const result = this.store.redeem(this.id());
    if (result.status === 'ok') {
      this.haptics.notify('success');
      this.spent.set(result.movement.points);
      this.voucherSeed.set(result.movement.id);
      this.phase.set('success');
    } else {
      this.haptics.notify('error');
      this.failure.set(result.status);
      this.phase.set('idle');
    }
  }

  protected failureText(failure: Failure): string {
    switch (failure) {
      case 'insufficient':
        return $localize`:@@detail.error.insufficient:You don't have enough points for this reward.`;
      case 'out-of-stock':
        return $localize`:@@detail.error.soldOut:This reward is sold out.`;
      default:
        return $localize`:@@detail.error.notFound:We couldn't find this reward.`;
    }
  }

  protected back(): void {
    this.navigation.back();
  }

  protected showInStore(): void {
    void this.router.navigate(['/voucher', this.voucherSeed()]);
  }

  protected goHistory(): void {
    void this.router.navigateByUrl('/history');
  }
}
