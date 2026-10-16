import { Component, computed, inject, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { Theme } from '../../../../core/theme.ts';
import { WnButton } from '../shared/action-button.ts';

const SHARES = [0.2, 0.4, 0.6, 0.8, 1] as const;

/**
 * Two swatches. The first reads a custom property written with `light-dark(#fef3c7, #1e293b)`: it
 * follows the lab's scheme (the toggle). The second is `color-mix(in srgb, var(--ink) calc(var(--share) * 100%),
 * transparent)` with a share token the buttons move: crimson at that share over the card.
 */
@Component({
  selector: 'app-light-dark-mix-case',
  imports: [Text, View, WnButton],
  template: `
    <view class="gap-2">
      <view testID="whats-new-a6-9-tone" class="tone"><text class="text-body font-bold swatch-text">light-dark(#fef3c7, #1e293b)</text></view>
      <view class="mix-row">
        <view testID="whats-new-a6-9-mix" class="mix" [style.--share]="share()"></view>
        <text class="text-body font-semibold text-ink dark:text-ink-dk">color-mix(var(--ink) {{ percent() }}%)</text>
      </view>
      <text testID="whats-new-a6-9-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <view class="flex-row flex-wrap gap-3">
        <app-wn-button testId="whats-new-a6-9-toggle" [label]="toggleLabel" (act)="theme.toggle()" />
        <app-wn-button testId="whats-new-a6-9-less" [label]="lessLabel" (act)="move(-1)" />
        <app-wn-button testId="whats-new-a6-9-more" [label]="moreLabel" (act)="move(1)" />
      </view>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a6_9.hint">Toggle dark mode: the first swatch flips from pale amber to dark slate. Share down and up: the second swatch is crimson at 20% to 100%.</text>
    </view>
  `,
  styles: `
    .tone {
      --tone: light-dark(#fef3c7, #1e293b);
      --on: light-dark(#78350f, #f8fafc);
      height: 56px;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background-color: var(--tone);
    }
    .swatch-text {
      color: var(--on);
    }
    .mix-row {
      flex-direction: row;
      align-items: center;
      gap: 12px;
    }
    .mix {
      --ink: crimson;
      width: 56px;
      height: 56px;
      border-radius: 8px;
      background-color: color-mix(in srgb, var(--ink) calc(var(--share) * 100%), transparent);
    }
  `,
})
export class LightDarkMixCase {
  protected readonly theme = inject(Theme);
  private readonly step = signal(1);
  protected readonly share = computed(() => String(SHARES[this.step()]));
  protected readonly percent = computed(() => Math.round(SHARES[this.step()]! * 100));
  protected readonly toggleLabel = $localize`:@@whatsNew.a6_9.toggle:Toggle dark mode`;
  protected readonly lessLabel = $localize`:@@whatsNew.a6_9.less:Share down`;
  protected readonly moreLabel = $localize`:@@whatsNew.a6_9.more:Share up`;
  protected readonly readout = computed(() => {
    const percent = this.percent();
    return this.theme.isDark()
      ? $localize`:@@whatsNew.a6_9.dark:Scheme: dark, share ${percent}:percent:%`
      : $localize`:@@whatsNew.a6_9.light:Scheme: light, share ${percent}:percent:%`;
  });

  protected move(direction: 1 | -1): void {
    this.step.update((step) => Math.min(SHARES.length - 1, Math.max(0, step + direction)));
  }
}
