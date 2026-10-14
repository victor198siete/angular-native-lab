import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideMapPin } from '@ng-icons/lucide';
import { NgIcon } from '@ng-native/icons';
import { Text, View } from '@ng-native/components';

/**
 * A static `aria-label` on an icon labels it for a screen reader, as `accessibilityLabel` does. The
 * second icon has none and stays out of the accessibility tree. The label is also written on the
 * screen, so a UI test that reads accessibility labels (Maestro) can find the icon by it.
 */
@Component({
  selector: 'app-icon-label-case',
  imports: [NgIcon, Text, View],
  providers: [provideIcons({ lucideMapPin })],
  template: `
    <view class="gap-2">
      <view class="flex-row items-center gap-4">
        <ng-icon testID="whats-new-a13-5-labelled" name="lucideMapPin" [size]="40" color="#be123c" aria-label="Pin on the map" />
        <ng-icon testID="whats-new-a13-5-decorative" name="lucideMapPin" [size]="40" color="#6b7280" />
      </view>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a13_5.hint">Expected: the red pin is read as an image named "Pin on the map"; the gray one is skipped by a screen reader. Before: neither was an accessibility element.</text>
    </view>
  `,
})
export class IconLabelCase {}
