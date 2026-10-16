import { Service, computed, inject, signal } from '@angular/core';
import { Network } from '@ng-native/expo/network';

/**
 * Whether the app should behave as online. The phone's connection comes from `Network`, and the lab
 * switch "Simulate offline" overrides it: an iOS simulator follows the Mac's network and cannot be
 * disconnected on its own, so the switch is what makes the offline path repeatable (and filmable).
 * With the switch on, everything below behaves exactly as with no network.
 *
 * `connected`, not `reachable`: `reachable` is null until the platform knows, which is not offline.
 */
@Service()
export class Connectivity {
  private readonly network = inject(Network);

  /** The lab switch. */
  readonly simulateOffline = signal(false);
  readonly online = computed(() => this.network.connected() && !this.simulateOffline());
}
