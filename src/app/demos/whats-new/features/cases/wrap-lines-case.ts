import { Component, computed, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';

/** A wrapping row 160 tall that says nothing of `align-content`, with four items that have no height: two lines, each stretches to 80. */
@Component({
  selector: 'app-wrap-lines-case',
  imports: [Text, View],
  template: `
    <view class="gap-2">
      <view testID="whats-new-a14-6-wrap" class="wrap">
        <view testID="whats-new-a14-6-first" class="item a" (layout)="first.set($event.nativeEvent.layout.height)"></view>
        <view class="item b"></view>
        <view testID="whats-new-a14-6-third" class="item c" (layout)="third.set($event.nativeEvent.layout.height)"></view>
        <view class="item d"></view>
      </view>
      <text testID="whats-new-a14-6-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a14_6.hint">Expected: four squares-to-be that fill the box, two lines of 80. Before: items with no height drew nothing.</text>
    </view>
  `,
  styles: `
    .wrap {
      flex-direction: row;
      flex-wrap: wrap;
      height: 160px;
      background-color: #ece8dc;
    }
    .item {
      width: 50%;
    }
    .a {
      background-color: crimson;
    }
    .b {
      background-color: royalblue;
    }
    .c {
      background-color: seagreen;
    }
    .d {
      background-color: gold;
    }
  `,
})
export class WrapLinesCase {
  protected readonly first = signal(0);
  protected readonly third = signal(0);
  protected readonly readout = computed(() => {
    const first = Math.round(this.first());
    const third = Math.round(this.third());
    return $localize`:@@whatsNew.a14_6.readout:Line 1 item ${first}:first: / line 2 item ${third}:third: tall`;
  });
}
