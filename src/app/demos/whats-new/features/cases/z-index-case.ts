import { Component } from '@angular/core';
import { Text, View } from '@ng-native/components';

/**
 * Three overlapping boxes with z-index 3, 2, 1. The first sits inside a plain view and the others
 * follow it in the tree, so without the fix they were drawn over it. Expected: 3 over 2 over 1.
 */
@Component({
  selector: 'app-z-index-case',
  imports: [Text, View],
  template: `
    <view class="stage" testID="whats-new-a10-z-stage">
      <view>
        <view class="chip three" testID="whats-new-a10-7-3"><text class="num">3</text></view>
      </view>
      <view class="chip two" testID="whats-new-a10-7-2"><text class="num">2</text></view>
      <view class="chip one" testID="whats-new-a10-7-1"><text class="num">1</text></view>
    </view>
    <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a10_7.hint">Expected, from the top: 3, then 2, then 1, whatever the order in the tree.</text>
  `,
  styles: `
    .stage {
      height: 130px;
    }
    .chip {
      position: absolute;
      width: 90px;
      height: 90px;
      border-radius: 12px;
      align-items: center;
      justify-content: center;
    }
    .three {
      left: 0;
      top: 0;
      z-index: 3;
      background-color: crimson;
    }
    .two {
      left: 40px;
      top: 20px;
      z-index: 2;
      background-color: royalblue;
    }
    .one {
      left: 80px;
      top: 40px;
      z-index: 1;
      background-color: seagreen;
    }
    .num {
      font-size: 28px;
      font-weight: 800;
      color: white;
    }
  `,
})
export class ZIndexCase {}
