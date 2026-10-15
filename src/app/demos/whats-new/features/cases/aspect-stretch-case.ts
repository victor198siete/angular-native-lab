import { Component, computed, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';

/** A 200 pt column holding a view with `aspect-ratio: 2` and no width: it stretches to 200 and is 100 tall. */
@Component({
  selector: 'app-aspect-stretch-case',
  imports: [Text, View],
  template: `
    <view class="gap-2">
      <view class="column">
        <view testID="whats-new-a14-4-box" class="ratio" (layout)="size.set($event.nativeEvent.layout)"></view>
      </view>
      <text testID="whats-new-a14-4-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a14_4.hint">Expected: 200 wide (the column) and 100 tall (ratio 2).</text>
    </view>
  `,
  styles: `
    .column {
      width: 200px;
      background-color: #ece8dc;
    }
    .ratio {
      aspect-ratio: 2;
      background-color: crimson;
    }
  `,
})
export class AspectStretchCase {
  protected readonly size = signal({ width: 0, height: 0 });
  protected readonly readout = computed(() => {
    const width = Math.round(this.size().width);
    const height = Math.round(this.size().height);
    return $localize`:@@whatsNew.a14_4.readout:Drawn: ${width}:width: x ${height}:height:`;
  });
}
