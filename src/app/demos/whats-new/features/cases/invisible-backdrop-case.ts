import { Component, computed, signal } from '@angular/core';
import { Pressable, Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

/**
 * A see-through backdrop (`opacity: 0`) laid over a button, as behind a menu. On iOS it used to hear
 * nothing (iOS sends no touch to a view whose alpha is under a hundredth) and the press reached the
 * button under it. Now a press anywhere counts for the backdrop and not for the button.
 */
@Component({
  selector: 'app-invisible-backdrop-case',
  imports: [Pressable, Text, View, WnButton],
  template: `
    <view class="gap-2">
      <view class="stage">
        <pressable testID="whats-new-a6-8-button" class="button" accessibilityRole="button" [accessibilityLabel]="buttonLabel" (press)="button.update((n) => n + 1)">
          <text class="text-body font-bold text-white">{{ buttonLabel }}</text>
        </pressable>
        <pressable testID="whats-new-a6-8-backdrop" nativeID="whats-new-a6-8-backdrop" class="backdrop" accessibilityRole="button" [accessibilityLabel]="backdropLabel" (press)="backdrop.update((n) => n + 1)"></pressable>
      </view>
      <text testID="whats-new-a6-8-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <app-wn-button testId="whats-new-a6-8-reset" [label]="resetLabel" (act)="reset()" />
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a6_8.hint">Press the red button: only the backdrop above it counts.</text>
    </view>
  `,
  styles: `
    .stage {
      height: 96px;
      border-radius: 8px;
      background-color: #ece8dc;
      justify-content: center;
    }
    .button {
      margin: 0 24px;
      height: 48px;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background-color: crimson;
    }
    .backdrop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0;
    }
  `,
})
export class InvisibleBackdropCase {
  protected readonly button = signal(0);
  protected readonly backdrop = signal(0);
  protected readonly buttonLabel = $localize`:@@whatsNew.a6_8.button:Button under the backdrop`;
  protected readonly backdropLabel = $localize`:@@whatsNew.a6_8.backdrop:Invisible backdrop`;
  protected readonly resetLabel = $localize`:@@whatsNew.a6_8.reset:Reset`;
  protected readonly readout = computed(() => {
    const backdrop = this.backdrop();
    const button = this.button();
    return $localize`:@@whatsNew.a6_8.readout:Backdrop heard ${backdrop}:backdrop: / button heard ${button}:button:`;
  });

  protected reset(): void {
    this.backdrop.set(0);
    this.button.set(0);
  }
}
