import { Component, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

const STEPS = [10, 30, 50, 70, 90] as const;

/**
 * A track whose `background: var(--x)` reads a gradient that is set as a custom property on the
 * element at run time (`[style.--x]`), which is how a colour slider works its track out. Buttons move
 * the middle stop. The second track reads the same value with `background-color: var(--x)`, which the
 * note says is a colour or nothing.
 */
@Component({
  selector: 'app-gradient-var-case',
  imports: [Text, View, WnButton],
  template: `
    <view class="gap-2">
      <view class="gap-1">
        <text class="text-caption font-semibold text-ink dark:text-ink-dk">background: var(--x)</text>
        <view testID="whats-new-a8-4-track" class="track" [style.--x]="gradient()"></view>
      </view>
      <view class="gap-1">
        <text class="text-caption font-semibold text-ink dark:text-ink-dk">background-color: var(--x)</text>
        <view testID="whats-new-a8-4-color" class="track-color" [style.--x]="gradient()"></view>
      </view>
      <text testID="whats-new-a8-4-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <view class="flex-row flex-wrap gap-3">
        <app-wn-button testId="whats-new-a8-4-less" [label]="lessLabel" (act)="move(-1)" />
        <app-wn-button testId="whats-new-a8-4-more" [label]="moreLabel" (act)="move(1)" />
      </view>
    </view>
  `,
  styles: `
    .track {
      height: 32px;
      border-radius: 16px;
      background: var(--x);
    }
    .track-color {
      height: 32px;
      border-radius: 16px;
      border: 1px solid #999;
      background-color: var(--x);
    }
  `,
})
export class GradientVarCase {
  private readonly step = signal(2);
  protected readonly stop = () => STEPS[this.step()];
  protected readonly gradient = () => gradientFor(this.stop());
  protected readonly lessLabel = $localize`:@@whatsNew.a8_4.less:Stop left`;
  protected readonly moreLabel = $localize`:@@whatsNew.a8_4.more:Stop right`;
  protected readonly readout = () => {
    const stop = this.stop();
    return $localize`:@@whatsNew.a8_4.readout:Middle stop at ${stop}:stop:%`;
  };

  protected move(direction: 1 | -1): void {
    this.step.update((step) => Math.min(STEPS.length - 1, Math.max(0, step + direction)));
  }
}

/** The value a colour slider would work out: red, a gold stop that moves, then blue. */
export const gradientFor = (stop: number): string =>
  `linear-gradient(90deg, red 0%, gold ${stop}%, blue 100%)`;
