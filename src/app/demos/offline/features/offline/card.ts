import { Component, input } from '@angular/core';
import { Text, View } from '@ng-native/components';

/** The white card every section sits in: an over-line heading, then whatever is projected. */
@Component({
  selector: 'app-offline-card',
  imports: [Text, View],
  template: `
    <view class="gap-3 rounded-lg bg-surface p-5 shadow-card dark:bg-surface-dk dark:shadow-card-dk">
      <text accessibilityRole="header" class="text-over font-bold text-ink2 dark:text-ink2-dk">{{ title() }}</text>
      <ng-content />
    </view>
  `,
})
export class OfflineCard {
  readonly title = input.required<string>();
}
