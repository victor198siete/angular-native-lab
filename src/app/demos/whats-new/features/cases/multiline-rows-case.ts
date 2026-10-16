import { Component, computed, signal } from '@angular/core';
import { Text, TextInput, View } from '@ng-native/components';

/**
 * Three empty multiline fields with `rows` 1, 3 and 5, a 20 pt line height, 8 pt padding and a 1 pt
 * border: about rows x 20 + 16 + 2 tall (38, 78, 118). Before, each was one line tall.
 */
@Component({
  selector: 'app-multiline-rows-case',
  imports: [Text, TextInput, View],
  template: `
    <view class="gap-2">
      <text-input testID="whats-new-a6-3-r1" class="field" multiline rows="1" placeholder="rows 1" (layout)="h1.set($event.nativeEvent.layout.height)" />
      <text-input testID="whats-new-a6-3-r3" class="field" multiline rows="3" placeholder="rows 3" (layout)="h3.set($event.nativeEvent.layout.height)" />
      <text-input testID="whats-new-a6-3-r5" class="field" multiline rows="5" placeholder="rows 5" (layout)="h5.set($event.nativeEvent.layout.height)" />
      <text testID="whats-new-a6-3-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a6_3.hint">Expected: about 38, 78 and 118 points (lines of 20, plus padding and border).</text>
    </view>
  `,
  styles: `
    .field {
      padding: 8px;
      border: 1px solid #999;
      border-radius: 6px;
      font-size: 14px;
      line-height: 20px;
      background-color: white;
    }
  `,
})
export class MultilineRowsCase {
  protected readonly h1 = signal(0);
  protected readonly h3 = signal(0);
  protected readonly h5 = signal(0);
  protected readonly readout = computed(() => {
    const one = Math.round(this.h1());
    const three = Math.round(this.h3());
    const five = Math.round(this.h5());
    return $localize`:@@whatsNew.a6_3.readout:Heights: rows 1 ${one}:one: / rows 3 ${three}:three: / rows 5 ${five}:five:`;
  });
}
