import { Service, computed, inject } from '@angular/core';
import { Network } from '@ng-native/expo/network';
import { SecureStorage } from '@ng-native/expo/secure-store';

/** Keychain key of the lab switch. */
export const SIMULATE_OFFLINE_KEY = 'offline.simulate';

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
  private readonly storage = inject(SecureStorage);

  /**
   * The lab switch. Kept across a restart on purpose: that is how a redemption queued offline can
   * be seen waiting after the app is closed and opened again, on a simulator that has a network.
   */
  readonly simulateOffline = this.storage.signal<boolean>(SIMULATE_OFFLINE_KEY, false);
  readonly online = computed(() => this.network.connected() && !this.simulateOffline());
}
