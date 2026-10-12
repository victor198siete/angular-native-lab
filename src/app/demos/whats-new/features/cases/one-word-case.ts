import { Component, signal } from '@angular/core';
import { Text, View, type TextLayoutEvent } from '@ng-native/components';

/** A 90 pt box with one long word, and one with three words: the word is a single line. */
@Component({
  selector: 'app-one-word-case',
  imports: [Text, View],
  template: `
    <view class="gap-2">
      <view class="flex-row gap-3">
        <view class="box" testID="whats-new-a10-6-word">
          <text class="copy" (textLayout)="word.set(lines($event))">Supercalifragilistic</text>
        </view>
        <view class="box" testID="whats-new-a10-6-words">
          <text class="copy" (textLayout)="words.set(lines($event))">Three short words</text>
        </view>
      </view>
      <text testID="whats-new-a10-6-readout" class="text-caption text-ink2 dark:text-ink2-dk">{{ readout() }}</text>
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
export class OneWordCase {
  protected readonly word = signal(0);
  protected readonly words = signal(0);
  protected readonly readout = () =>
    $localize`:@@whatsNew.a10_6.readout:Lines drawn: one word ${this.word()}:word:, three words ${this.words()}:words:`;
  protected readonly lines = (event: TextLayoutEvent): number => event.nativeEvent.lines.length;
}
