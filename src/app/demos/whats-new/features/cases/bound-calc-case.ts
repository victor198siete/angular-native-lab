import { Component, computed, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';

/**
 * `calc()` in a bound `[style]`: a width of `calc(2 * 1rem)`, a flex basis of `calc(10px + 10px)`
 * (measured as the height of an item in an auto-height column of its own, where the basis is all there
 * is; in a row beside a taller block the item grew to that block's height on iOS), an
 * opacity of `calc(1 - 0.5)` and a shift of `translateX(1em)` at a 16 pt font. A translation does not
 * change layout, so the shift is judged by eye against the ruler and by the committed props in Node.
 */
@Component({
  selector: 'app-bound-calc-case',
  imports: [Text, View],
  template: `
    <view class="gap-2">
      <view testID="whats-new-a20-3-scope" class="gap-2" [style]="scope">
        <view testID="whats-new-a20-3-width" class="bar" [style]="width" (layout)="measured.set($event.nativeEvent.layout.width)"></view>
        <!-- A column of its own: beside the 40 pt block in a row it grew to 40 on iOS, even self-start -->
        <view>
          <view testID="whats-new-a20-3-basis" class="basis-block" [style]="basis" (layout)="basisHeight.set($event.nativeEvent.layout.height)"></view>
        </view>
        <view testID="whats-new-a20-3-opacity" class="bar-block" [style]="opacity"></view>
        <view class="ruler"></view>
        <view testID="whats-new-a20-3-shift" class="mark" [style]="shift"></view>
      </view>
      <text testID="whats-new-a20-3-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a20_3.hint">Expected: width 32, basis 20, the second block at half opacity, and the gold mark moved 16 pt to the right of the ruler's left end. Before, these values were committed as text and dropped.</text>
    </view>
  `,
  styles: `
    .bar {
      height: 12px;
      border-radius: 6px;
      background-color: royalblue;
    }
    .basis-block {
      width: 40px;
      background-color: royalblue;
    }
    .bar-block {
      width: 40px;
      height: 40px;
      background-color: crimson;
    }
    .ruler {
      width: 16px;
      height: 4px;
      background-color: #12131a;
    }
    .mark {
      width: 16px;
      height: 8px;
      background-color: gold;
    }
  `,
})
export class BoundCalcCase {
  protected readonly scope = { fontSize: 16 };
  protected readonly width = { width: 'calc(2 * 1rem)' };
  protected readonly basis = { flex: '1 1 calc(10px + 10px)' };
  protected readonly opacity = { opacity: 'calc(1 - 0.5)' };
  protected readonly shift = { transform: 'translateX(1em)' };
  protected readonly measured = signal(0);
  protected readonly basisHeight = signal(0);
  protected readonly readout = computed(() => {
    const width = Math.round(this.measured());
    const basis = Math.round(this.basisHeight());
    return $localize`:@@whatsNew.a20_3.readout:Width ${width}:width: / basis ${basis}:basis:`;
  });
}
