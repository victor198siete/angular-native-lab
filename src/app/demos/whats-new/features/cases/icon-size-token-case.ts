import { Component, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideMapPin } from '@ng-icons/lucide';
import { NgIcon } from '@ng-native/icons';
import { Text, View } from '@ng-native/components';

/**
 * With no `size`, an icon is `var(--ng-icon__size, 1em)`: it takes `--ng-icon__size` when something
 * around it sets it (an `<ng-icon-stack size>` does), and the text size otherwise. The first icon
 * sits in a view that sets 32px; the second has nothing around it. Each view's `(layout)` is the
 * drawn size.
 */
@Component({
  selector: 'app-icon-size-token-case',
  imports: [NgIcon, Text, View],
  providers: [provideIcons({ lucideMapPin })],
  template: `
    <view class="gap-2">
      <view class="flex-row items-end gap-4">
        <view class="self-end" [style.--ng-icon__size]="'32px'">
          <view testID="whats-new-a13-6-token" class="self-start" (layout)="token.set($event.nativeEvent.layout.width)">
            <ng-icon name="lucideMapPin" color="#be123c" />
          </view>
        </view>
        <view testID="whats-new-a13-6-plain" class="self-end" (layout)="plain.set($event.nativeEvent.layout.width)">
          <ng-icon name="lucideMapPin" color="#be123c" />
        </view>
      </view>
      <text testID="whats-new-a13-6-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a13_6.hint">Expected: the first pin draws at 32 points; the second, with nothing around it, at the text size (16).</text>
    </view>
  `,
})
export class IconSizeTokenCase {
  protected readonly token = signal(0);
  protected readonly plain = signal(0);
  protected readonly readout = () => {
    const token = Math.round(this.token());
    const plain = Math.round(this.plain());
    return $localize`:@@whatsNew.a13_6.readout:Drawn: ${token}:token: / ${plain}:plain: points`;
  };
}
