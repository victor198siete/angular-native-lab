import { Component, signal } from '@angular/core';
import { provideIcons, provideNgIconsConfig } from '@ng-icons/core';
import { lucideMapPin } from '@ng-icons/lucide';
import { NgIcon } from '@ng-native/icons';
import { Text, View } from '@ng-native/components';

/**
 * `provideNgIconsConfig({ size, color, strokeWidth })` gives every icon under it its defaults, and an
 * icon's own input still wins. The first icon says nothing and should draw at 28 points in the config
 * colour with the config line weight; the second sets its own `size`. Each sits in a view that
 * shrinks to it, whose `(layout)` is the drawn size.
 */
@Component({
  selector: 'app-icon-config-case',
  imports: [NgIcon, Text, View],
  providers: [
    provideIcons({ lucideMapPin }),
    provideNgIconsConfig({ size: '28px', color: '#0369a1', strokeWidth: 3 }),
  ],
  template: `
    <view class="gap-2">
      <view class="flex-row items-end gap-4">
        <view testID="whats-new-a13-3-bare" class="self-end" (layout)="bare.set($event.nativeEvent.layout.width)">
          <ng-icon name="lucideMapPin" />
        </view>
        <view testID="whats-new-a13-3-own" class="self-end" (layout)="own.set($event.nativeEvent.layout.width)">
          <ng-icon name="lucideMapPin" [size]="44" />
        </view>
      </view>
      <text testID="whats-new-a13-3-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a13_3.hint">Expected: the first pin draws at 28 points, blue, with a heavy line; the second keeps its own 44. Before: the config was ignored.</text>
    </view>
  `,
})
export class IconConfigCase {
  protected readonly bare = signal(0);
  protected readonly own = signal(0);
  protected readonly readout = () => {
    const bare = Math.round(this.bare());
    const own = Math.round(this.own());
    return $localize`:@@whatsNew.a13_3.readout:Drawn: ${bare}:bare: / ${own}:own: points`;
  };
}
