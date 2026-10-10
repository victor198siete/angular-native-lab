import { Component, input, output } from '@angular/core';
import { Pressable, Text, View } from '@ng-native/components';

export interface SegmentOption<T extends string | number> {
  readonly value: T;
  readonly label: string;
  readonly testId: string;
}

/** A row of mutually exclusive buttons; the chosen one reads as selected to screen readers. */
@Component({
  selector: 'app-segmented',
  imports: [Pressable, Text, View],
  template: `
    <view class="flex-row gap-2" accessibilityRole="radiogroup" [accessibilityLabel]="label()">
      @for (option of options(); track option.value) {
        <pressable
          class="min-h-11 flex-1 items-center justify-center rounded-full border px-4"
          [class]="option.value === selected() ? 'border-brand bg-brand' : 'border-line bg-surface dark:border-line-dk dark:bg-surface-dk'"
          [nativeID]="option.testId"
          [testID]="option.testId"
          accessibilityRole="button"
          [accessibilityLabel]="option.label"
          [accessibilityState]="{ selected: option.value === selected() }"
          (press)="pick.emit(option.value)"
        >
          <text
            class="text-body font-semibold"
            [class]="option.value === selected() ? 'text-white' : 'text-ink dark:text-ink-dk'"
          >{{ option.label }}</text>
        </pressable>
      }
    </view>
  `,
})
export class Segmented<T extends string | number> {
  readonly options = input.required<readonly SegmentOption<T>[]>();
  readonly selected = input.required<T>();
  readonly label = input.required<string>();
  readonly pick = output<T>();
}
