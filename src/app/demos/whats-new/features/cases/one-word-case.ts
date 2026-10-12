import { Component } from '@angular/core';
import { Text, View } from '@ng-native/components';

/** A 90 pt box with one long word, and one with three words: the word is a single line. */
@Component({
  selector: 'app-one-word-case',
  imports: [Text, View],
  template: `
    <view class="gap-2">
      <view class="flex-row gap-3">
        <view class="box" testID="whats-new-a10-6-word">
          <text class="copy">Supercalifragilistic</text>
        </view>
        <view class="box" testID="whats-new-a10-6-words">
          <text class="copy">Three short words</text>
        </view>
      </view>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a10_6.hint">Expected: the word on one line, cut at the edge of its box; the three words on three lines.</text>
    </view>
  `,
  styles: `
    .box {
      width: 90px;
      padding: 4px;
      border-width: 1px;
      border-color: #9a9aa5;
      border-radius: 6px;
    }
    .copy {
      font-size: 16px;
      color: #12131a;
    }
  `,
})
export class OneWordCase {}
