import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-native/icons';
import { Pressable, SafeAreaView, ScrollView, Text, View } from '@ng-native/components';
import { RewardsStore } from '../../core/rewards.store.ts';
import { Theme } from '../../../../core/theme.ts';
import { animatedNumber } from '../../shared/animated-number.ts';
import { ICON_COLOR, provideUiIcons } from '../../shared/icons.ts';
import { MovementRow } from '../../shared/ui/movement-row.ts';
import { PointsHeroCard } from '../../shared/ui/points-hero-card.ts';

@Component({
  selector: 'app-wallet-screen',
  imports: [MovementRow, NgIcon, Pressable, PointsHeroCard, SafeAreaView, ScrollView, Text, View],
  providers: [provideUiIcons()],
  template: `
    <safe-area-view [edges]="['top']" class="flex-1 bg-canvas dark:bg-canvas-dk">
      <scroll-view
        class="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        [contentContainerStyle]="{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 128, gap: 24 }"
      >
        <view class="flex-row items-center justify-between">
          <view class="gap-1">
            <text testID="wallet-greeting" class="text-h1 font-black text-ink dark:text-ink-dk" i18n="@@wallet.greeting">Hi, {{ store.member().name }}</text>
            <text class="text-body text-ink2 dark:text-ink2-dk">Tus puntos de hoy</text>
          </view>
          <pressable
            testID="theme-toggle"
            class="h-11 w-11 items-center justify-center rounded-full bg-raised dark:bg-raised-dk hover:opacity-70"
            accessibilityRole="switch"
            accessibilityLabel="Modo oscuro"
            [accessibilityState]="{ checked: theme.isDark() }"
            (press)="theme.toggle()"
          >
            <ng-icon [name]="theme.isDark() ? 'lucideSun' : 'lucideMoon'" [size]="22" [color]="ink()" />
          </pressable>
        </view>

        <view class="rise">
          <app-points-hero-card
            [balance]="store.member().points"
            [displayed]="displayed()"
            [tier]="store.tier()"
            [nextTier]="store.nextTier()"
            [progress]="store.progressToNextTier()"
            [missing]="store.pointsToNextTier()"
          />
        </view>

        <view class="rise-1 flex-row gap-3">
          <pressable
            class="flex-1 items-center gap-2 rounded-lg bg-surface py-4 shadow-card dark:bg-surface-dk dark:shadow-card-dk hover:opacity-80"
            accessibilityRole="button"
            accessibilityLabel="Ver catálogo de recompensas"
            (press)="go('/catalog')"
          >
            <ng-icon name="lucideGift" [size]="26" [color]="brand()" />
            <text class="text-caption font-semibold text-ink dark:text-ink-dk">Ver catálogo</text>
          </pressable>
          <pressable
            class="flex-1 items-center gap-2 rounded-lg bg-surface py-4 shadow-card dark:bg-surface-dk dark:shadow-card-dk hover:opacity-80"
            accessibilityRole="button"
            accessibilityLabel="Ver historial de movimientos"
            (press)="go('/history')"
          >
            <ng-icon name="lucideHistory" [size]="26" [color]="brand()" />
            <text class="text-caption font-semibold text-ink dark:text-ink-dk">Historial</text>
          </pressable>
        </view>

        <view class="rise-2 gap-3">
          <view class="flex-row items-center justify-between">
            <text class="text-h2 font-bold text-ink dark:text-ink-dk">Movimientos recientes</text>
            <pressable class="min-h-11 justify-center" accessibilityRole="link" accessibilityLabel="Ver todo el historial" (press)="go('/history')">
              <text class="text-body font-semibold text-brand-text dark:text-brand-text-dk">Ver todo</text>
            </pressable>
          </view>
          <view class="overflow-hidden rounded-xl bg-surface dark:bg-surface-dk">
            @for (movement of recent(); track movement.id; let last = $last) {
              <view [class]="last ? '' : 'border-b border-line dark:border-line-dk'">
                <app-movement-row [movement]="movement" [showDay]="true" />
              </view>
            }
          </view>
        </view>
      </scroll-view>
    </safe-area-view>
  `,
})
export class WalletScreen {
  protected readonly store = inject(RewardsStore);
  protected readonly theme = inject(Theme);
  protected readonly ink = computed(() => (this.theme.isDark() ? ICON_COLOR.ink.dark : ICON_COLOR.ink.light));
  protected readonly brand = computed(() => (this.theme.isDark() ? ICON_COLOR.brand.dark : ICON_COLOR.brand.light));
  private readonly router = inject(Router);

  /** Counts up from 0 on first render, and follows the balance afterwards. */
  protected readonly displayed = animatedNumber(() => this.store.member().points, { from: 0 });

  protected readonly recent = computed(() =>
    this.store
      .movementsByDate()
      .flatMap((group) => group.movements)
      .slice(0, 5),
  );

  protected go(url: string): void {
    void this.router.navigateByUrl(url);
  }
}
