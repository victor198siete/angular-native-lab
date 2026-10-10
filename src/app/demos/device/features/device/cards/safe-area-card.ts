import { Component, computed, inject } from '@angular/core';
import { View } from '@ng-native/components';
import { SafeArea } from '@ng-native/device';
import { points } from '../../../core/geo.ts';
import { yesNo } from './appearance-card.ts';
import { CardTitle } from './card-title.ts';
import { DeviceRow } from './row.ts';

/** `SafeArea`: what the system occupies on each edge, the frame it measured and whether it has reported yet. */
@Component({
  selector: 'app-safe-area-card',
  imports: [CardTitle, DeviceRow, View],
  template: `
    <view testID="card-safe-area" class="gap-3 rounded-lg bg-surface p-5 shadow-card dark:bg-surface-dk dark:shadow-card-dk">
      <app-card-title icon="lucideScan" [label]="title" />
      <app-device-row [label]="knownLabel" [value]="known()" valueId="safe-known" />
      <app-device-row [label]="topLabel" [value]="top()" valueId="safe-top" />
      <app-device-row [label]="rightLabel" [value]="right()" valueId="safe-right" />
      <app-device-row [label]="bottomLabel" [value]="bottom()" valueId="safe-bottom" />
      <app-device-row [label]="leftLabel" [value]="left()" valueId="safe-left" />
      <app-device-row [label]="frameLabel" [value]="frame()" valueId="safe-frame" />
    </view>
  `,
})
export class SafeAreaCard {
  private readonly safeArea = inject(SafeArea);

  protected readonly title = $localize`:@@device.safe.title:SAFE AREAS`;
  protected readonly knownLabel = $localize`:@@device.safe.known:Measured`;
  protected readonly topLabel = $localize`:@@device.safe.top:Top`;
  protected readonly rightLabel = $localize`:@@device.safe.right:Right`;
  protected readonly bottomLabel = $localize`:@@device.safe.bottom:Bottom`;
  protected readonly leftLabel = $localize`:@@device.safe.left:Left`;
  protected readonly frameLabel = $localize`:@@device.safe.frame:Frame`;

  protected readonly known = computed(() => yesNo(this.safeArea.known()));
  protected readonly top = computed(() => points(this.safeArea.insets().top));
  protected readonly right = computed(() => points(this.safeArea.insets().right));
  protected readonly bottom = computed(() => points(this.safeArea.insets().bottom));
  protected readonly left = computed(() => points(this.safeArea.insets().left));
  protected readonly frame = computed(() => {
    const frame = this.safeArea.frame();
    return frame ? `${points(frame.width)} x ${points(frame.height)}` : '-';
  });
}
