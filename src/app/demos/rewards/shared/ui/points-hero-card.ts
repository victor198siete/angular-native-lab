import { Component, computed, input } from '@angular/core';
import { Text, View } from '@ng-native/components';
import type { Tier } from '../../core/models/index.ts';
import { formatPoints, pointsToMoney } from '../format.ts';
import { TIER_COLOR } from '../tier-style.ts';
import { TierProgress } from './tier-progress.ts';

/** The wallet hero: gradient card with the (animated) balance, tier pill and tier progress. */
@Component({
  selector: 'app-points-hero-card',
  imports: [Text, TierProgress, View],
  template: `
    <view
      class="grad-hero gap-4 overflow-hidden rounded-xl p-6 shadow-hero"
      accessible
      accessibilityRole="summary"
      [accessibilityLabel]="summary()"
    >
      <view class="grad-glow absolute inset-0" pointerEvents="none"></view>
      <text class="text-over font-bold tracking-widest text-white/80">PUNTOS DISPONIBLES</text>
      <text testID="hero-balance" class="text-display font-black tracking-tight tabular-nums text-white">{{ shown() }}</text>
      <view class="flex-row items-center gap-2">
        <view class="flex-row items-center gap-2 rounded-full bg-black/25 px-3 py-1.5">
          <view class="h-2.5 w-2.5 rounded-full" [style]="{ backgroundColor: tierColor() }"></view>
          <text class="text-caption font-semibold text-white">Nivel {{ tier().name }}</text>
        </view>
        <text class="text-caption text-white/80">{{ approx() }}</text>
      </view>
      <app-tier-progress [progress]="progress()" [nextName]="nextTier()?.name ?? null" [missing]="missing()" />
    </view>
  `,
})
export class PointsHeroCard {
  /** Final balance (used for the screen-reader summary). */
  readonly balance = input.required<number>();
  /** The number currently drawn: lets the parent count it up or down. */
  readonly displayed = input<number | undefined>(undefined);
  readonly tier = input.required<Tier>();
  readonly nextTier = input<Tier | null>(null);
  readonly progress = input.required<number>();
  readonly missing = input(0);

  protected readonly shown = computed(() => formatPoints(this.displayed() ?? this.balance()));
  protected readonly approx = computed(() => '≈ $' + pointsToMoney(this.balance()));
  protected readonly tierColor = computed(() => TIER_COLOR[this.tier().name]);
  protected readonly summary = computed(() => {
    const next = this.nextTier();
    const tail = next
      ? `Te faltan ${formatPoints(this.missing())} puntos para ${next.name}.`
      : 'Nivel máximo alcanzado.';
    return `Tienes ${formatPoints(this.balance())} puntos. Nivel ${this.tier().name}. ${tail}`;
  });
}
