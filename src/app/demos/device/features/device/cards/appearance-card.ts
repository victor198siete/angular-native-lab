import { Component, computed, inject } from '@angular/core';
import { ColorScheme, Screen } from '@ng-native/device';
import { View } from '@ng-native/components';
import { points } from '../../../core/geo.ts';
import { CardTitle } from './card-title.ts';
import { DeviceRow } from './row.ts';

/** `ColorScheme` and `Screen`: the theme, the window, its orientation and whether it is a phone layout. */
@Component({
  selector: 'app-appearance-card',
  imports: [CardTitle, DeviceRow, View],
  template: `
    <view testID="card-appearance" class="gap-3 rounded-lg bg-surface p-5 shadow-card dark:bg-surface-dk dark:shadow-card-dk">
      <app-card-title icon="lucideSunMoon" [label]="title" />
      <app-device-row [label]="schemeLabel" [value]="scheme()" valueId="appearance-scheme" />
      <app-device-row [label]="windowLabel" [value]="windowSize()" valueId="appearance-window" />
      <app-device-row [label]="orientationLabel" [value]="orientation()" valueId="appearance-orientation" />
      <app-device-row [label]="compactLabel" [value]="compact()" valueId="appearance-compact" />
    </view>
  `,
})
export class AppearanceCard {
  private readonly colorScheme = inject(ColorScheme);
  private readonly screen = inject(Screen);

  protected readonly title = $localize`:@@device.appearance.title:THEME AND SCREEN`;
  protected readonly schemeLabel = $localize`:@@device.appearance.scheme:Theme`;
  protected readonly windowLabel = $localize`:@@device.appearance.window:Window`;
  protected readonly orientationLabel = $localize`:@@device.appearance.orientation:Orientation`;
  protected readonly compactLabel = $localize`:@@device.appearance.compact:Compact layout`;

  protected readonly scheme = computed(() =>
    this.colorScheme.current() === 'dark'
      ? $localize`:@@device.scheme.dark:Dark`
      : $localize`:@@device.scheme.light:Light`,
  );
  protected readonly windowSize = computed(() => {
    const { width, height } = this.screen.window();
    return `${points(width)} x ${points(height)}`;
  });
  protected readonly orientation = computed(() =>
    this.screen.orientation() === 'portrait'
      ? $localize`:@@device.orientation.portrait:Portrait`
      : $localize`:@@device.orientation.landscape:Landscape`,
  );
  protected readonly compact = computed(() => yesNo(this.screen.compact()));
}

export const yesNo = (value: boolean): string => (value ? $localize`:@@device.yes:Yes` : $localize`:@@device.no:No`);
