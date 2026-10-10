import { Component, input } from '@angular/core';
import { Text, View } from '@ng-native/components';

/** A label on the left and its live value on the right. The value's `testID` is `valueId`. */
@Component({
  selector: 'app-device-row',
  imports: [Text, View],
  template: `
    <view class="flex-row items-center justify-between gap-3">
      <text class="text-body text-ink2 dark:text-ink2-dk">{{ label() }}</text>
      <text [testID]="valueId()" class="flex-1 text-right text-body font-semibold text-ink dark:text-ink-dk">{{ value() }}</text>
    </view>
  `,
})
export class DeviceRow {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly valueId = input.required<string>();
}
