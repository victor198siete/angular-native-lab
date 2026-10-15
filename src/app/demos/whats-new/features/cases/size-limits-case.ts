import { Component, computed, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';

/** A minimum over a maximum: `min-height: 80` over `max-height: 40`, the width the same, and padding plus border over `max-height: 20`. */
@Component({
  selector: 'app-size-limits-case',
  imports: [Text, View],
  template: `
    <view class="gap-2">
      <view class="flex-row items-start gap-3">
        <view testID="whats-new-a14-5-height" class="tall" (layout)="tall.set($event.nativeEvent.layout.height)"></view>
        <view testID="whats-new-a14-5-width" class="wide" (layout)="wide.set($event.nativeEvent.layout.width)"></view>
        <view testID="whats-new-a14-5-box" class="boxed" (layout)="boxed.set($event.nativeEvent.layout.height)"></view>
      </view>
      <text testID="whats-new-a14-5-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a14_5.hint">Expected: height 80 (min over max 40), width 160 (min over max 100), box 36 (16+16 padding and 2+2 border over max 20).</text>
    </view>
  `,
  styles: `
    .tall {
      width: 40px;
      max-height: 40px;
      min-height: 80px;
      background-color: crimson;
    }
    .wide {
      height: 24px;
      max-width: 100px;
      min-width: 160px;
      background-color: royalblue;
    }
    .boxed {
      width: 40px;
      max-height: 20px;
      padding: 16px;
      border-width: 2px;
      border-color: #12131a;
      background-color: gold;
    }
  `,
})
export class SizeLimitsCase {
  protected readonly tall = signal(0);
  protected readonly wide = signal(0);
  protected readonly boxed = signal(0);
  protected readonly readout = computed(() => {
    const height = Math.round(this.tall());
    const width = Math.round(this.wide());
    const box = Math.round(this.boxed());
    return $localize`:@@whatsNew.a14_5.readout:Measured: height ${height}:height: / width ${width}:width: / box ${box}:box:`;
  });
}
