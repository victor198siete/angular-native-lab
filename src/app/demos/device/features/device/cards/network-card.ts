import { Component, computed, inject } from '@angular/core';
import { View } from '@ng-native/components';
import { type ConnectionType, Network } from '@ng-native/expo/network';
import { yesNo } from './appearance-card.ts';
import { CardTitle } from './card-title.ts';
import { DeviceRow } from './row.ts';

/** `Network`: connected, over what, and reachable. Reachable is null until the platform knows, which is not offline. */
@Component({
  selector: 'app-network-card',
  imports: [CardTitle, DeviceRow, View],
  template: `
    <view testID="card-network" class="gap-3 rounded-lg bg-surface p-5 shadow-card dark:bg-surface-dk dark:shadow-card-dk">
      <app-card-title icon="lucideWifi" [label]="title" />
      <app-device-row [label]="connectedLabel" [value]="connected()" valueId="network-connected" />
      <app-device-row [label]="typeLabel" [value]="type()" valueId="network-type" />
      <app-device-row [label]="reachableLabel" [value]="reachable()" valueId="network-reachable" />
    </view>
  `,
})
export class NetworkCard {
  private readonly network = inject(Network);

  protected readonly title = $localize`:@@device.network.title:NETWORK`;
  protected readonly connectedLabel = $localize`:@@device.network.connected:Connected`;
  protected readonly typeLabel = $localize`:@@device.network.type:Connection`;
  protected readonly reachableLabel = $localize`:@@device.network.reachable:Internet reachable`;

  protected readonly connected = computed(() => yesNo(this.network.connected()));
  protected readonly type = computed(() => connectionName(this.network.type()));
  protected readonly reachable = computed(() => {
    const reachable = this.network.reachable();
    return reachable === null ? $localize`:@@device.network.checking:Checking…` : yesNo(reachable);
  });
}

const connectionName = (type: ConnectionType): string => {
  switch (type) {
    case 'wifi':
      return $localize`:@@device.network.wifi:Wi-Fi`;
    case 'cellular':
      return $localize`:@@device.network.cellular:Cellular`;
    case 'ethernet':
      return $localize`:@@device.network.ethernet:Ethernet`;
    case 'bluetooth':
      return $localize`:@@device.network.bluetooth:Bluetooth`;
    case 'vpn':
      return $localize`:@@device.network.vpn:VPN`;
    case 'other':
      return $localize`:@@device.network.other:Other`;
    case 'none':
      return $localize`:@@device.network.none:None`;
    default:
      return $localize`:@@device.network.unknown:Unknown`;
  }
};
