import { DestroyRef, Service, effect, inject, signal, untracked } from '@angular/core';
import { Location, type Position } from '@ng-native/expo/location';
import { distanceMeters, formatAddress } from './geo.ts';

/**
 * The address is looked up when the position first arrives and then only after moving this far from
 * the point last looked up. The platform geocoders are rate limited (iOS throttles them hard), and a
 * fix every few seconds while standing still would burn the quota for the same street. A distance
 * threshold is simpler than a timer-based debounce and answers the real question: did it move?
 */
export const GEOCODE_MIN_DISTANCE_M = 100;

/**
 * What the location card shows: the permission, a start/stop for live tracking and the address of
 * the latest position. Provided by the card, so tracking stops (and the native watcher is removed)
 * when the screen is destroyed.
 */
@Service()
export class LocationTracking {
  private readonly location = inject(Location);

  readonly permission = this.location.permission;
  readonly position = this.location.position;
  readonly tracking = signal(false);
  readonly busy = signal(false);
  readonly address = signal<string | null>(null);
  readonly addressFailed = signal(false);
  /** The watcher could not start: on Android, location services off or the accuracy prompt declined. */
  readonly startFailed = signal(false);

  private stopWatching: (() => void) | null = null;
  private destroyed = false;
  private lastLookedUp: Position | null = null;
  /** Answers to a lookup older than the last one asked are dropped. */
  private lookupId = 0;

  constructor() {
    // Learn the current answer without showing a dialog.
    void this.permission.check();
    effect(() => {
      const position = this.position();
      if (position) untracked(() => void this.lookUp(position));
    });
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      this.stop();
    });
  }

  /** Shows the system dialog. A no is read from `permission`, not thrown. */
  async requestPermission(): Promise<void> {
    this.busy.set(true);
    try {
      await this.permission.request();
    } finally {
      this.busy.set(false);
    }
  }

  async start(): Promise<void> {
    if (this.tracking() || this.busy()) return;
    this.busy.set(true);
    this.startFailed.set(false);
    try {
      if (!(await this.permission.ensure())) return;
      const stop = await this.location.start({ accuracy: 'balanced', distance: 10 });
      if (this.destroyed) {
        stop(); // the screen closed while the watcher was starting
        return;
      }
      this.stopWatching = stop;
      this.tracking.set(true);
    } catch {
      // expo-location rejects with "unsatisfied device settings" when Android's Location Accuracy
      // prompt is declined or location is off. The card says so; pressing Start asks again.
      this.startFailed.set(true);
    } finally {
      this.busy.set(false);
    }
  }

  stop(): void {
    this.stopWatching?.();
    this.stopWatching = null;
    this.tracking.set(false);
  }

  private async lookUp(position: Position): Promise<void> {
    if (this.lastLookedUp && distanceMeters(this.lastLookedUp, position) < GEOCODE_MIN_DISTANCE_M) return;
    this.lastLookedUp = position;
    const id = ++this.lookupId;
    try {
      const [first] = await this.location.reverseGeocode(position);
      if (id !== this.lookupId || this.destroyed) return;
      this.address.set(first ? formatAddress(first) : null);
      this.addressFailed.set(false);
    } catch {
      if (id !== this.lookupId || this.destroyed) return;
      this.addressFailed.set(true);
      this.lastLookedUp = null; // try again on the next fix
    }
  }
}
