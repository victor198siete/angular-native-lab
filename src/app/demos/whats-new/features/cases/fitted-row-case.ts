import { Component, computed, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';

/**
 * A segmented control: a row with `align-self: flex-start` holding three `flex: 1` tabs, so the row is
 * as wide as its labels and the tabs share that width. The second row is the same control stretched
 * to the line. Each row's `(layout)` is the measured width.
 */
@Component({
  selector: 'app-fitted-row-case',
  imports: [Text, View],
  template: `
    <view class="gap-2">
      <view testID="whats-new-a20-1-fitted" class="control fitted" (layout)="fitted.set($event.nativeEvent.layout.width)">
        <view class="tab"><text class="label">Day</text></view>
        <view class="tab"><text class="label">Week</text></view>
        <view class="tab"><text class="label">Month</text></view>
      </view>
      <view testID="whats-new-a20-1-stretched" class="control" (layout)="stretched.set($event.nativeEvent.layout.width)">
        <view class="tab"><text class="label">Day</text></view>
        <view class="tab"><text class="label">Week</text></view>
        <view class="tab"><text class="label">Month</text></view>
      </view>
      <view testID="whats-new-a20-1-line" (layout)="line.set($event.nativeEvent.layout.width)"></view>
      <text testID="whats-new-a20-1-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a20_1.hint">Expected: the first control is only as wide as its three labels, with the tabs sharing that width; the second one fills the line. Before, the fitted row filled the screen too.</text>
    </view>
  `,
  styles: `
    .control {
      flex-direction: row;
      background-color: #ece8dc;
      border-radius: 8px;
    }
    .fitted {
      align-self: flex-start;
    }
    .tab {
      flex: 1;
      align-items: center;
      padding: 8px 12px;
    }
    .label {
      font-size: 14px;
      color: #12131a;
    }
  `,
})
export class FittedRowCase {
  protected readonly fitted = signal(0);
  protected readonly stretched = signal(0);
  protected readonly line = signal(0);
  protected readonly readout = computed(() => {
    const fitted = Math.round(this.fitted());
    const stretched = Math.round(this.stretched());
    const line = Math.round(this.line());
    return $localize`:@@whatsNew.a20_1.readout:Fitted ${fitted}:fitted: / stretched ${stretched}:stretched: / line ${line}:line:`;
  });
}
