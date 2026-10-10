import { Component } from '@angular/core';
import { SafeAreaView, ScrollView, Text, View } from '@ng-native/components';
import { NativeHeader } from '@ng-native/router';
import { AppearanceCard } from './cards/appearance-card.ts';
import { LocationCard } from './cards/location-card.ts';
import { NetworkCard } from './cards/network-card.ts';
import { SafeAreaCard } from './cards/safe-area-card.ts';

/**
 * A panel with one card per device signal from `@ng-native/device` and `@ng-native/expo`, each
 * showing its live value: theme and screen, safe areas, network and location.
 */
@Component({
  selector: 'app-device-screen',
  imports: [AppearanceCard, LocationCard, NativeHeader, NetworkCard, SafeAreaCard, SafeAreaView, ScrollView, Text, View],
  host: { style: 'flex: 1' },
  template: `
    <native-header [title]="title" />
    <safe-area-view [edges]="['bottom']" class="flex-1 bg-canvas dark:bg-canvas-dk">
      <scroll-view [contentContainerStyle]="{ padding: 20, gap: 16, paddingBottom: 48 }">
        <view class="gap-1">
          <text testID="device-heading" accessibilityRole="header" class="text-h1 font-black text-ink dark:text-ink-dk" i18n="@@device.heading">Your device, live</text>
          <text class="text-body text-ink2 dark:text-ink2-dk" i18n="@@device.intro">Every value below is a signal. Switch the theme or go offline and watch it change.</text>
        </view>
        <app-appearance-card />
        <app-safe-area-card />
        <app-network-card />
        <app-location-card />
      </scroll-view>
    </safe-area-view>
  `,
})
export class DeviceScreen {
  protected readonly title = $localize`:@@device.title:Device`;
}
