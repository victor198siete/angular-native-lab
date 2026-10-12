import { Component, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

/** The tiers the select cycles through; any other value takes the `other` case. */
const TIERS = ['gold', 'silver', 'bronze'] as const;

/**
 * The ICU sample: an ICU plural and an ICU select, each in a text of its own (the whole expression is one message
 * under its id), driven by a stepper and a tier button; and an `i18n-accessibilityLabel` attribute.
 * Angular has no `#` in a plural: the number is an interpolation inside the case.
 */
@Component({
  selector: 'app-icu-sample',
  imports: [Text, View, WnButton],
  template: `
    <view class="gap-2">
      <text
        testID="whats-new-a9-1-count"
        class="text-h2 font-bold text-ink dark:text-ink-dk"
        i18n="@@whatsNew.a9_1.count"
        i18n-accessibilityLabel="@@whatsNew.a9_1.countLabel"
        accessibilityLabel="Rewards in the basket"
      >{count(), plural, =0 {No rewards} one {{{ count() }} reward} other {{{ count() }} rewards}}</text>
      <text testID="whats-new-a9-1-tier" class="text-body font-semibold text-ink dark:text-ink-dk" i18n="@@whatsNew.a9_1.tier">{tier(), select, gold {Gold member} silver {Silver member} other {Member}}</text>
      <view class="flex-row gap-2">
        <app-wn-button testId="whats-new-a9-1-minus" [label]="minusLabel" (act)="step(-1)" />
        <app-wn-button testId="whats-new-a9-1-plus" [label]="plusLabel" (act)="step(1)" />
        <app-wn-button testId="whats-new-a9-1-tier-next" [label]="tierLabel" (act)="nextTier()" />
      </view>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a9_1.hint">Step from 0 to 1 to 5 and the sentence changes case; Spanish picks its case by its own rules. The counter's accessibility label comes from an i18n- attribute.</text>
    </view>
  `,
})
export class IcuSample {
  protected readonly count = signal(0);
  protected readonly tier = signal<string>(TIERS[0]);

  protected readonly minusLabel = $localize`:@@whatsNew.a9_1.minus:One fewer`;
  protected readonly plusLabel = $localize`:@@whatsNew.a9_1.plus:One more`;
  protected readonly tierLabel = $localize`:@@whatsNew.a9_1.nextTier:Next tier`;

  protected step(by: number): void {
    this.count.update((n) => Math.max(0, n + by));
  }

  protected nextTier(): void {
    this.tier.update((t) => TIERS[(TIERS.indexOf(t as (typeof TIERS)[number]) + 1) % TIERS.length]);
  }
}
