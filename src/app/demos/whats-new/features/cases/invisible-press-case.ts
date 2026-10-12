import { Component, computed, signal } from '@angular/core';
import { Pressable, Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

/**
 * A pressable that fades to `opacity: 0` by a transition. Once faded it is invisible, and on iOS it
 * must still hear a press: the counter keeps climbing while pressing where it was.
 */
@Component({
  selector: 'app-invisible-press-case',
  imports: [Pressable, Text, View, WnButton],
  template: `
    <view class="gap-2">
      <pressable
        testID="whats-new-a9-4-target"
        class="target"
        [class.faded]="faded()"
        accessibilityRole="button"
        [accessibilityLabel]="targetLabel"
        (press)="hear()"
      >
        <text class="text-body font-bold text-white">{{ targetLabel }}</text>
      </pressable>
      <text testID="whats-new-a9-4-count" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <view class="flex-row gap-2">
        <app-wn-button testId="whats-new-a9-4-fade" [label]="fadeLabel" (act)="faded.set(true)" />
        <app-wn-button testId="whats-new-a9-4-reset" [label]="resetLabel" (act)="reset()" />
      </view>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a9_4.hint">Tap Fade it out, wait a moment, then tap where the red button was. The counter should still go up.</text>
    </view>
  `,
  styles: `
    .target {
      height: 56px;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      background-color: crimson;
      opacity: 1;
      transition: opacity 400ms ease-out;
    }
    .target.faded {
      opacity: 0;
    }
  `,
})
export class InvisiblePressCase {
  protected readonly faded = signal(false);
  protected readonly presses = signal(0);
  protected readonly targetLabel = $localize`:@@whatsNew.a9_4.target:Press me`;
  protected readonly fadeLabel = $localize`:@@whatsNew.a9_4.fade:Fade it out`;
  protected readonly resetLabel = $localize`:@@whatsNew.a9_4.reset:Reset`;
  protected readonly readout = computed(
    () => $localize`:@@whatsNew.a9_4.readout:Presses heard: ${this.presses()}:count: (${this.faded() ? $localize`:@@whatsNew.a9_4.hidden:faded` : $localize`:@@whatsNew.a9_4.shown:visible`}:state:)`,
  );

  protected hear(): void {
    this.presses.update((count) => count + 1);
  }

  protected reset(): void {
    this.faded.set(false);
    this.presses.set(0);
  }
}
