import { Component, input, output } from '@angular/core';
import { Pressable, Text } from '@ng-native/components';

/** A small button; `label` is both what it shows and what a screen reader says. */
@Component({
  selector: 'app-action-button',
  imports: [Pressable, Text],
  template: `
    <pressable
      class="min-h-11 items-center justify-center self-start rounded-full border border-line bg-raised px-5 dark:border-line-dk dark:bg-raised-dk"
      [nativeID]="testId()"
      [testID]="testId()"
      accessibilityRole="button"
      [accessibilityLabel]="label()"
      (press)="act.emit()"
    >
      <text class="text-body font-semibold text-ink dark:text-ink-dk">{{ label() }}</text>
    </pressable>
  `,
})
export class ActionButton {
  readonly label = input.required<string>();
  readonly testId = input.required<string>();
  readonly act = output<void>();
}
