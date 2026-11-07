import { Component } from '@angular/core';
import { Text, View } from '@ng-native/components';

/**
 * #1376, #1369: a text with `font-size: 0`, one with `calc(4px - 8px)` (clamped to 0) and a normal
 * one as control. Android used to throw `FontSize should be a positive value`; iOS drew the two at
 * its default size.
 */
@Component({
  selector: 'app-font-size-zero-case',
  imports: [Text, View],
  template: `
    <view class="gap-2">
      <view class="line">
        <text testID="whats-new-a21-1-zero" class="zero">ZERO-NOT-VISIBLE</text>
        <text testID="whats-new-a21-1-zero-label" class="text-caption text-ink2 dark:text-ink2-dk">font-size: 0</text>
      </view>
      <view class="line">
        <text testID="whats-new-a21-1-clamped" class="clamped">CLAMPED-NOT-VISIBLE</text>
        <text testID="whats-new-a21-1-clamped-label" class="text-caption text-ink2 dark:text-ink2-dk">font-size: calc(4px - 8px)</text>
      </view>
      <view class="line">
        <text testID="whats-new-a21-1-control" class="control text-body font-semibold text-ink dark:text-ink-dk">Control text</text>
        <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a21_1.control">normal size</text>
      </view>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a21_1.hint">Expected: the screen draws with no red error on Android; the first two lines show only their grey label, no text at the default size. The control line stays readable.</text>
    </view>
  `,
  styles: `
    .line {
      flex-direction: row;
      align-items: center;
      gap: 12px;
      min-height: 24px;
    }
    .control {
      font-size: 16px;
    }
    .zero {
      font-size: 0;
    }
    .clamped {
      font-size: calc(4px - 8px);
    }
  `,
})
export class FontSizeZeroCase {}
