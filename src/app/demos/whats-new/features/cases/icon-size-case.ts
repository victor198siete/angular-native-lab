import { Component, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideMapPin } from '@ng-icons/lucide';
import { NgIcon } from '@ng-native/icons';
import { Text, View } from '@ng-native/components';

/**
 * `<ng-icon>` sizes as a web app writes them. Each icon sits in a view that shrinks to it, and that
 * view's `(layout)` is the drawn size. The last icon has a size nobody can read, so it takes the size
 * of the text around it.
 */
@Component({
  selector: 'app-icon-size-case',
  imports: [NgIcon, Text, View],
  providers: [provideIcons({ lucideMapPin })],
  template: `
    <view class="gap-2">
      <view class="flex-row items-end gap-4">
        <view testID="whats-new-a8-5-px" class="self-end" (layout)="px.set($event.nativeEvent.layout.width)">
          <ng-icon testID="whats-new-a8-5-px-icon" name="lucideMapPin" size="18px" color="#be123c" />
        </view>
        <view testID="whats-new-a8-5-rem" class="self-end" (layout)="rem.set($event.nativeEvent.layout.width)">
          <ng-icon testID="whats-new-a8-5-rem-icon" name="lucideMapPin" size="1.5rem" color="#be123c" />
        </view>
        <view testID="whats-new-a8-5-number" class="self-end" (layout)="number.set($event.nativeEvent.layout.width)">
          <ng-icon testID="whats-new-a8-5-number-icon" name="lucideMapPin" size="24" color="#be123c" />
        </view>
        <view testID="whats-new-a8-5-bad" class="self-end" (layout)="bad.set($event.nativeEvent.layout.width)">
          <ng-icon testID="whats-new-a8-5-bad-icon" name="lucideMapPin" size="big" color="#be123c" />
        </view>
      </view>
      <text testID="whats-new-a8-5-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a8_5.hint">Expected: 18px draws at 18 points, 1.5rem at 24, 24 at 24; the last one cannot be read and takes the size of the text around it.</text>
    </view>
  `,
})
export class IconSizeCase {
  protected readonly px = signal(0);
  protected readonly rem = signal(0);
  protected readonly number = signal(0);
  protected readonly bad = signal(0);

  protected readonly readout = () => {
    const px = Math.round(this.px());
    const rem = Math.round(this.rem());
    const number = Math.round(this.number());
    const bad = Math.round(this.bad());
    return $localize`:@@whatsNew.a8_5.readout:Drawn: ${px}:px: / ${rem}:rem: / ${number}:number: / ${bad}:bad: points`;
  };
}
