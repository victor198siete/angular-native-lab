import { Component, computed, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';

/**
 * CSS written in a `style` attribute, read as a stylesheet reads it: `padding: 4px 8px` sets each
 * side (the inner view sits at x 8, y 4) and a unitless `line-height: 1.5` is a multiple of the font
 * size (a 20 pt line is 30 tall; it used to be 1.5 points).
 */
@Component({
  selector: 'app-style-attribute-case',
  imports: [Text, View],
  template: `
    <view class="gap-2">
      <view testID="whats-new-a14-12-pad" class="self-start" style="padding: 4px 8px; background-color: #ece8dc">
        <view testID="whats-new-a14-12-inner" class="inner" (layout)="inner.set($event.nativeEvent.layout)"></view>
      </view>
      <view class="self-start" style="background-color: #ece8dc">
        <text testID="whats-new-a14-12-line" style="font-size: 20px; line-height: 1.5" (layout)="line.set($event.nativeEvent.layout.height)">Line height</text>
      </view>
      <text testID="whats-new-a14-12-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a14_12.hint">Expected: the red square starts at x 8, y 4; the 20 pt text line is 30 tall.</text>
    </view>
  `,
  styles: `
    .inner {
      width: 40px;
      height: 24px;
      background-color: crimson;
    }
  `,
})
export class StyleAttributeCase {
  protected readonly inner = signal({ x: 0, y: 0 });
  protected readonly line = signal(0);
  protected readonly readout = computed(() => {
    const x = Math.round(this.inner().x);
    const y = Math.round(this.inner().y);
    const line = Math.round(this.line());
    return $localize`:@@whatsNew.a14_12.readout:Padding ${x}:x: / ${y}:y: / line ${line}:line:`;
  });
}
