import { Component, DestroyRef, inject, input } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { MountCounter } from '../../core/mount-counter.ts';
import type { MockRow } from '../../core/mock-rows.ts';

export const ROW_HEIGHT = 64;

/** The one row both renderers draw, so the comparison is between renderers and not between rows. */
@Component({
  selector: 'app-list-row',
  imports: [Text, View],
  template: `
    <view
      class="flex-row items-center gap-3 border-b border-line px-5 dark:border-line-dk"
      [style]="{ height: rowHeight }"
      accessible
      [accessibilityLabel]="row().name + ', ' + row().line"
    >
      <view class="h-10 w-10 items-center justify-center rounded-full bg-raised dark:bg-raised-dk">
        <text class="text-caption font-bold tabular-nums text-ink2 dark:text-ink2-dk">{{ row().id + 1 }}</text>
      </view>
      <view class="flex-1 gap-0.5">
        <text class="text-title font-semibold text-ink dark:text-ink-dk" [numberOfLines]="1">{{ row().name }}</text>
        <text class="text-caption text-ink2 dark:text-ink2-dk" [numberOfLines]="1">{{ row().line }}</text>
      </view>
    </view>
  `,
})
export class ListRow {
  readonly row = input.required<MockRow>();
  protected readonly rowHeight = ROW_HEIGHT;

  constructor() {
    inject(DestroyRef).onDestroy(inject(MountCounter).mounted());
  }
}
