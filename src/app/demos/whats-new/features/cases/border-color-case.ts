import { Component } from '@angular/core';
import { Text, View } from '@ng-native/components';

/** Two boxes with a 3 pt border and no `border-color`, in crimson text; the second names black. */
@Component({
  selector: 'app-border-color-case',
  imports: [Text, View],
  template: `
    <view class="flex-row gap-3">
      <view class="crimson box" testID="whats-new-a10-5-bare">
        <text class="label">{{ bare }}</text>
      </view>
      <view class="crimson box black" testID="whats-new-a10-5-black">
        <text class="label">{{ black }}</text>
      </view>
    </view>
  `,
  styles: `
    .crimson {
      color: crimson;
    }
    .box {
      flex: 1;
      min-height: 64px;
      padding: 8px;
      border-width: 3px;
      border-radius: 8px;
    }
    .black {
      border-color: black;
    }
    .label {
      font-size: 12px;
    }
  `,
})
export class BorderColorCase {
  protected readonly bare = $localize`:@@whatsNew.a10_5.bare:No border-color: crimson`;
  protected readonly black = $localize`:@@whatsNew.a10_5.black:border-color: black`;
}
