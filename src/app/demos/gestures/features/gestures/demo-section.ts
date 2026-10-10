import { Component, input } from '@angular/core';
import { Text, View } from '@ng-native/components';

/** The card every demo of this screen sits in: a title, one line about it, and the demo itself. */
@Component({
  selector: 'app-demo-section',
  imports: [Text, View],
  template: `
    <view class="gap-3 rounded-lg bg-surface p-4 shadow-card dark:bg-surface-dk dark:shadow-card-dk">
      <view class="gap-1">
        <text [testID]="testId()" accessibilityRole="header" class="text-h2 font-bold text-ink dark:text-ink-dk">{{ title() }}</text>
        <text class="text-body text-ink2 dark:text-ink2-dk">{{ hint() }}</text>
      </view>
      <view class="gap-3">
        <ng-content />
      </view>
    </view>
  `,
})
export class DemoSection {
  readonly title = input.required<string>();
  readonly hint = input.required<string>();
  readonly testId = input.required<string>();
}
