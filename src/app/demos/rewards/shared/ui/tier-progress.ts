import { Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { formatPoints } from '../format.ts';

/**
 * Progress bar toward the next tier, on the hero card (white text on a dark gradient).
 * The fill starts empty and grows to its value on the next tick, through a CSS width transition.
 */
@Component({
  selector: 'app-tier-progress',
  imports: [Text, View],
  template: `
    <view class="gap-2">
      <view
        class="h-2 overflow-hidden rounded-full bg-black/25"
        accessibilityRole="progressbar"
        [accessibilityLabel]="nextName() ? 'Progreso a ' + nextName() : 'Nivel máximo'"
        [accessibilityValue]="{ min: 0, max: 100, now: percent() }"
      >
        <view class="bar-fill grad-brand h-full rounded-full" [style]="{ width: fill() + '%' }"></view>
      </view>
      <view class="flex-row justify-between">
        <text class="text-caption text-white/90">{{ caption() }}</text>
        <text class="text-caption font-semibold tabular-nums text-white">{{ percent() }}%</text>
      </view>
    </view>
  `,
})
export class TierProgress {
  /** 0..1 */
  readonly progress = input.required<number>();
  readonly nextName = input<string | null>(null);
  readonly missing = input(0);

  private readonly armed = signal(false);
  protected readonly percent = computed(() => Math.round(this.progress() * 100));
  protected readonly fill = computed(() => (this.armed() ? this.percent() : 0));
  protected readonly caption = computed(() =>
    this.nextName() ? `Te faltan ${formatPoints(this.missing())} pts para ${this.nextName()}` : 'Nivel máximo',
  );

  constructor() {
    const timer = setTimeout(() => this.armed.set(true), 80);
    inject(DestroyRef).onDestroy(() => clearTimeout(timer));
  }
}
