import { Component, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';

/**
 * Four shorthands (`border`, `box-shadow`, `background`, `font`) written three ways: in a stylesheet,
 * in a `style` attribute and in a `[style]` binding. Each row should draw the same three boxes.
 */
@Component({
  selector: 'app-style-shorthand-case',
  imports: [Text, View],
  template: `
    <view class="gap-2">
      <text class="text-caption font-semibold text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a20_2.sheet">Stylesheet</text>
      <view class="flex-row flex-wrap gap-2">
        <view testID="whats-new-a20-2-border-sheet" class="box sheet-border"></view>
        <view testID="whats-new-a20-2-shadow-sheet" class="box sheet-shadow"></view>
        <view testID="whats-new-a20-2-background-sheet" class="box sheet-background"></view>
        <text testID="whats-new-a20-2-font-sheet" class="sheet-font">Font</text>
      </view>
      <text class="text-caption font-semibold text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a20_2.attribute">Style attribute</text>
      <view class="flex-row flex-wrap gap-2">
        <view testID="whats-new-a20-2-border-attr" class="box" style="border: 3px solid crimson"></view>
        <view testID="whats-new-a20-2-shadow-attr" class="box" style="box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4)"></view>
        <view testID="whats-new-a20-2-background-attr" class="box" style="background: linear-gradient(90deg, gold, crimson)"></view>
        <text testID="whats-new-a20-2-font-attr" style="font: italic 700 20px serif">Font</text>
      </view>
      <text class="text-caption font-semibold text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a20_2.bound">Style binding</text>
      <view class="flex-row flex-wrap gap-2">
        <view testID="whats-new-a20-2-border-bound" class="box" [style]="border()"></view>
        <view testID="whats-new-a20-2-shadow-bound" class="box" [style]="shadow()"></view>
        <view testID="whats-new-a20-2-background-bound" class="box" [style]="background()"></view>
        <text testID="whats-new-a20-2-font-bound" [style]="font()">Font</text>
      </view>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a20_2.hint">Expected: the three rows look the same, a crimson border, a soft shadow, a gold to crimson gradient and an italic bold serif word. Before, the attribute and bound shorthands drew nothing.</text>
    </view>
  `,
  styles: `
    .box {
      width: 56px;
      height: 56px;
      border-radius: 8px;
      background-color: #ece8dc;
    }
    .sheet-border {
      border: 3px solid crimson;
    }
    .sheet-shadow {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
    }
    .sheet-background {
      background: linear-gradient(90deg, gold, crimson);
    }
    .sheet-font {
      font: italic 700 20px serif;
    }
  `,
})
export class StyleShorthandCase {
  protected readonly border = signal({ border: '3px solid crimson' });
  protected readonly shadow = signal({ 'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.4)' });
  protected readonly background = signal({ background: 'linear-gradient(90deg, gold, crimson)' });
  protected readonly font = signal({ font: 'italic 700 20px serif' });
}
