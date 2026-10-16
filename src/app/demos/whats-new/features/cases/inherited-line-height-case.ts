import { Component, computed, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';

/**
 * `.card { font-size: 10px; line-height: 2 }` holds a 20 px text of three lines: the number 2 is
 * inherited, so each line is 40 tall and the text 120. Beside it a card with a fixed
 * `line-height: 20px` has 20-point lines (60 tall), which is what the card's 10 px times 2 gave
 * before.
 */
@Component({
  selector: 'app-inherited-line-height-case',
  imports: [Text, View],
  template: `
    <view class="gap-2">
      <view class="flex-row gap-3">
        <view class="card unitless">
          <text testID="whats-new-a7-5-unitless" class="big" (layout)="unitless.set($event.nativeEvent.layout.height)">{{ lines }}</text>
        </view>
        <view class="card exact">
          <text testID="whats-new-a7-5-fixed" class="big" (layout)="fixed.set($event.nativeEvent.layout.height)">{{ lines }}</text>
        </view>
      </view>
      <text testID="whats-new-a7-5-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a7_5.hint">Left: line-height 2 on a 10 px card. Right: line-height 20px. Expected heights: 120 and about 60 points.</text>
    </view>
  `,
  styles: `
    .card {
      flex: 1;
      padding: 4px 8px;
      border-radius: 8px;
      background-color: #ece8dc;
      font-size: 10px;
    }
    .unitless {
      line-height: 2;
    }
    .exact {
      line-height: 20px;
    }
    .big {
      font-size: 20px;
      color: #12131a;
    }
  `,
})
export class InheritedLineHeightCase {
  protected readonly lines = 'Line one\nLine two\nLine three';
  protected readonly unitless = signal(0);
  protected readonly fixed = signal(0);
  protected readonly readout = computed(() => {
    const unitless = Math.round(this.unitless());
    const fixed = Math.round(this.fixed());
    return $localize`:@@whatsNew.a7_5.readout:Heights: unitless ${unitless}:unitless: / fixed ${fixed}:fixed:`;
  });
}
