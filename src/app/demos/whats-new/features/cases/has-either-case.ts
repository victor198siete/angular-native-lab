import { Component } from '@angular/core';
import { Text, View } from '@ng-native/components';

/**
 * #863: `:has()` with a list that has an ancestor test in it matches either alternative. The rule
 * is `.card:has(.x:is(.p *, .y))`: a card holding an `.x` that is inside a `.p`, or that is also a
 * `.y`. Card A has only the `.y` half, card B only the `.p` half, card C neither. A and B turn
 * green; before, a card needed both halves.
 */
@Component({
  selector: 'app-has-either-case',
  imports: [Text, View],
  template: `
    <view class="gap-2">
      <view testID="whats-new-a15-7-a" class="card"><view class="x y"></view><text class="label">A: .x that is also .y</text></view>
      <view testID="whats-new-a15-7-b" class="card"><view class="p"><view class="x"></view></view><text class="label">B: .x inside .p</text></view>
      <view testID="whats-new-a15-7-c" class="card"><view class="x"></view><text class="label">C: .x alone</text></view>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a15_7.hint">Expected: A and B are green, C stays grey. Before, neither A nor B matched.</text>
    </view>
  `,
  styles: `
    .card {
      flex-direction: row;
      align-items: center;
      gap: 8px;
      padding: 10px;
      border-radius: 8px;
      background-color: #e5e7eb;
    }
    .card:has(.x:is(.p *, .y)) {
      background-color: #86efac;
    }
    .x {
      width: 16px;
      height: 16px;
      background-color: #374151;
    }
    .label {
      font-size: 13px;
      color: #12131a;
    }
  `,
})
export class HasEitherCase {}
