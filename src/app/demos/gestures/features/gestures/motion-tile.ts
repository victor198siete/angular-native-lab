import { Component, input } from '@angular/core';
import { Text, View } from '@ng-native/components';

/** One square with its name and how it is set up to run; the moving element is projected in. */
@Component({
  selector: 'app-motion-tile',
  imports: [Text, View],
  host: { style: 'flex: 1; min-width: 0' },
  template: `
    <view class="flex-1 gap-2 overflow-hidden rounded-md bg-raised p-3 dark:bg-raised-dk" [testID]="testId()">
      <view class="h-8 justify-center">
        <ng-content />
      </view>
      <text class="text-caption font-bold text-ink dark:text-ink-dk">{{ title() }}</text>
      <text class="text-over text-ink2 dark:text-ink2-dk">{{ how() }}</text>
    </view>
  `,
})
export class MotionTile {
  readonly title = input.required<string>();
  readonly how = input.required<string>();
  readonly testId = input.required<string>();
}
