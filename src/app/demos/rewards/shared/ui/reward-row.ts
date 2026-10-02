import { Component, LOCALE_ID, computed, inject, input, output } from '@angular/core';
import { Pressable, Text, View } from '@ng-native/components';
import type { Reward } from '../../core/models/index.ts';
import { formatPoints } from '../format.ts';
import { RewardTile } from './reward-tile.ts';

/**
 * Catalog row, 80pt tall (the list adds 8pt of air). It never disables itself: an unaffordable
 * reward can still be opened. No transitions here, rows are recycled by the virtual list.
 */
@Component({
  selector: 'app-reward-row',
  imports: [Pressable, RewardTile, Text, View],
  template: `
    <pressable
      class="h-20 flex-row items-center gap-4 rounded-lg bg-surface px-3 dark:bg-surface-dk hover:opacity-80"
      [class]="affordable() ? '' : 'opacity-90'"
      accessibilityRole="button"
      [accessibilityLabel]="label()"
      [accessibilityHint]="hint"
      (press)="open.emit(reward().id)"
    >
      <app-reward-tile [icon]="reward().icon" [category]="reward().category" [size]="56" />
      <view class="flex-1 gap-0.5">
        <text class="text-title font-bold text-ink dark:text-ink-dk" [numberOfLines]="1">{{ reward().title }}</text>
        <text class="text-caption text-ink2 dark:text-ink2-dk" [numberOfLines]="1">{{ reward().partner }}</text>
      </view>
      <view class="items-end gap-0.5">
        <text
          class="text-title font-black tabular-nums"
          [class]="affordable() ? 'text-ink dark:text-ink-dk' : 'text-ink2 dark:text-ink2-dk'"
        >{{ cost() }}</text>
        <text
          class="text-caption font-semibold"
          [class]="status().ok ? 'text-gain dark:text-gain-dk' : 'text-warn dark:text-warn-dk'"
        >{{ status().text }}</text>
      </view>
    </pressable>
  `,
})
export class RewardRow {
  readonly reward = input.required<Reward>();
  /** Current balance; the row derives affordability from it. */
  readonly balance = input.required<number>();
  readonly open = output<string>();

  private readonly locale = inject(LOCALE_ID);
  protected readonly hint = $localize`:@@reward.row.hint:Opens the details`;
  protected readonly cost = computed(() => `${formatPoints(this.reward().costPoints, this.locale)} pts`);
  protected readonly soldOut = computed(() => {
    const stock = this.reward().stock;
    return stock !== undefined && stock <= 0;
  });
  protected readonly affordable = computed(() => this.balance() >= this.reward().costPoints);
  protected readonly status = computed(() => {
    if (this.soldOut()) return { ok: false, text: $localize`:@@reward.soldOut:Sold out` };
    if (this.affordable()) return { ok: true, text: $localize`:@@reward.available:Available` };
    const missing = formatPoints(this.reward().costPoints - this.balance(), this.locale);
    return { ok: false, text: $localize`:@@reward.short:${missing}:missing: pts short` };
  });
  protected readonly label = computed(() => {
    const r = this.reward();
    const missing = formatPoints(r.costPoints - this.balance(), this.locale);
    const state = this.soldOut()
      ? $localize`:@@reward.soldOut.a11y:sold out`
      : this.affordable()
        ? $localize`:@@reward.available.a11y:available`
        : $localize`:@@reward.short.a11y:${missing}:missing: points short`;
    const cost = formatPoints(r.costPoints, this.locale);
    return $localize`:@@reward.row.a11y:${r.title}:title:, ${r.partner}:partner:, ${cost}:cost: points, ${state}:state:`;
  });
}
