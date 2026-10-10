import { Component, computed, inject } from '@angular/core';
import { Pressable, Text, View } from '@ng-native/components';
import { clockTime } from '../../../core/geo.ts';
import { LocationTracking } from '../../../core/location-tracking.ts';
import { CardTitle } from './card-title.ts';
import { DeviceRow } from './row.ts';

/**
 * `Location`: the permission, a button to ask for it, then live tracking with the position and the
 * address of the latest fix. Foreground only. The tracking service is the card's own, so leaving
 * the screen stops the watcher.
 */
@Component({
  selector: 'app-location-card',
  imports: [CardTitle, DeviceRow, Pressable, Text, View],
  providers: [LocationTracking],
  template: `
    <view testID="card-location" class="gap-3 rounded-lg bg-surface p-5 shadow-card dark:bg-surface-dk dark:shadow-card-dk">
      <app-card-title icon="lucideMapPin" [label]="title" />
      <app-device-row [label]="permissionLabel" [value]="permissionText()" valueId="location-permission" />

      @if (tracking.permission.blocked()) {
        <text testID="location-blocked" class="text-caption text-loss dark:text-loss-dk" i18n="@@device.location.blocked">Location is off for this app. Turn it on in Settings, then come back.</text>
      } @else if (!tracking.permission.granted()) {
        <pressable
          testID="location-allow"
          class="h-12 items-center justify-center rounded-full bg-raised dark:bg-raised-dk"
          accessibilityRole="button"
          [disabled]="tracking.busy()"
          [accessibilityState]="{ disabled: tracking.busy(), busy: tracking.busy() }"
          (press)="tracking.requestPermission()"
        >
          <text class="text-body font-semibold text-ink dark:text-ink-dk" i18n="@@device.location.allow">Allow location</text>
        </pressable>
      } @else {
        <pressable
          testID="location-toggle"
          [class]="tracking.tracking() ? 'h-12 items-center justify-center rounded-full bg-raised dark:bg-raised-dk' : 'grad-brand h-12 items-center justify-center rounded-full shadow-cta'"
          accessibilityRole="button"
          [disabled]="tracking.busy()"
          [accessibilityState]="{ disabled: tracking.busy(), busy: tracking.busy() }"
          (press)="toggle()"
        >
          <text [class]="tracking.tracking() ? 'text-body font-semibold text-ink dark:text-ink-dk' : 'text-body font-bold text-white'">{{ toggleText() }}</text>
        </pressable>
      }

      @if (tracking.startFailed()) {
        <text testID="location-start-failed" class="text-caption text-loss dark:text-loss-dk" i18n="@@device.location.startFailed">Location services are off or limited on this device. Turn them on and try again.</text>
      }

      @if (position(); as fix) {
        <app-device-row [label]="latLabel" [value]="fix.latitude.toFixed(5)" valueId="location-latitude" />
        <app-device-row [label]="lonLabel" [value]="fix.longitude.toFixed(5)" valueId="location-longitude" />
        <app-device-row [label]="accuracyLabel" [value]="accuracy()" valueId="location-accuracy" />
        <app-device-row [label]="timeLabel" [value]="time()" valueId="location-time" />
        <app-device-row [label]="addressLabel" [value]="address()" valueId="location-address" />
      } @else {
        <text testID="location-empty" class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@device.location.empty">No position yet. Start tracking to see it.</text>
      }
    </view>
  `,
})
export class LocationCard {
  protected readonly tracking = inject(LocationTracking);

  protected readonly title = $localize`:@@device.location.title:LOCATION`;
  protected readonly permissionLabel = $localize`:@@device.location.permission:Permission`;
  protected readonly latLabel = $localize`:@@device.location.latitude:Latitude`;
  protected readonly lonLabel = $localize`:@@device.location.longitude:Longitude`;
  protected readonly accuracyLabel = $localize`:@@device.location.accuracy:Accuracy`;
  protected readonly timeLabel = $localize`:@@device.location.time:Updated`;
  protected readonly addressLabel = $localize`:@@device.location.address:Address`;

  protected readonly position = this.tracking.position;

  protected readonly permissionText = computed(() => {
    switch (this.tracking.permission.status()) {
      case 'granted':
        return $localize`:@@device.permission.granted:Granted`;
      case 'denied':
        return $localize`:@@device.permission.denied:Denied`;
      case 'undetermined':
        return $localize`:@@device.permission.undetermined:Not asked yet`;
      default:
        return $localize`:@@device.permission.unknown:Checking…`;
    }
  });
  protected readonly toggleText = computed(() =>
    this.tracking.tracking()
      ? $localize`:@@device.location.stop:Stop tracking`
      : $localize`:@@device.location.start:Start tracking`,
  );
  protected readonly accuracy = computed(() => {
    const metres = this.position()?.accuracy;
    return metres == null ? '-' : $localize`:@@device.location.metres:${Math.round(metres)}:metres: m`;
  });
  protected readonly time = computed(() => {
    const fix = this.position();
    return fix ? clockTime(fix.timestamp) : '-';
  });
  protected readonly address = computed(() => {
    if (this.tracking.addressFailed()) return $localize`:@@device.location.addressFailed:Not available`;
    return this.tracking.address() ?? $localize`:@@device.location.addressLooking:Looking up…`;
  });

  protected toggle(): void {
    if (this.tracking.tracking()) this.tracking.stop();
    else void this.tracking.start();
  }
}
