import { Component, computed, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';

/**
 * Tokens that are never set, so only the fallback applies: `border-radius: var(--r, 50% 50% 50% 0)`
 * gives each corner its own radius (a teardrop), `margin: var(--gap, 0 24px)` puts the inner box at
 * x 24 and y 0, and `transform: var(--t, translateX(40px) rotate(45deg))` takes the whole list.
 * Before, the radius was every corner alike, the margin nothing and the transform dropped.
 */
@Component({
  selector: 'app-var-fallback-case',
  imports: [Text, View],
  template: `
    <view class="gap-2">
      <view class="flex-row items-center gap-4">
        <view testID="whats-new-a6-7-drop" class="drop"></view>
        <view class="frame"><view testID="whats-new-a6-7-gap" class="gapbox" (layout)="gap.set($event.nativeEvent.layout)"></view></view>
        <view class="turn-slot"><view testID="whats-new-a6-7-turn" class="turn"></view></view>
      </view>
      <text testID="whats-new-a6-7-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a6_7.hint">Expected: a teardrop with one square corner, the green box at x 24 and y 0 in its frame, and the blue square pushed right and turned.</text>
    </view>
  `,
  styles: `
    .drop {
      width: 64px;
      height: 64px;
      background-color: crimson;
      border-radius: var(--r, 50% 50% 50% 0);
    }
    .frame {
      width: 88px;
      height: 64px;
      background-color: #ece8dc;
    }
    .gapbox {
      width: 40px;
      height: 40px;
      background-color: seagreen;
      margin: var(--gap, 0 24px);
    }
    .turn-slot {
      width: 80px;
      height: 64px;
    }
    .turn {
      width: 32px;
      height: 32px;
      background-color: royalblue;
      transform: var(--t, translateX(40px) rotate(45deg));
    }
  `,
})
export class VarFallbackCase {
  protected readonly gap = signal({ x: 0, y: 0 });
  protected readonly readout = computed(() => {
    const x = Math.round(this.gap().x);
    const y = Math.round(this.gap().y);
    return $localize`:@@whatsNew.a6_7.readout:Green box at x ${x}:x: / y ${y}:y:`;
  });
}
