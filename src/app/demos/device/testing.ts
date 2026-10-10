import type { Provider } from '@angular/core';
import { ColorScheme, Screen, type ColorSchemeSource, type Scheme, type ScreenSource, type Sizes } from '@ng-native/device';
import type { Address, NativeLocation } from '@ng-native/expo/location';
import { Location } from '@ng-native/expo/location';
import { Network, type NetworkStatus } from '@ng-native/expo/network';
import type { Observed, PermissionResponse } from '@ng-native/expo';
import { vi } from 'vitest';

/** A value the test changes by hand: the shape every `SOURCE` here takes (`current` + `subscribe`). */
function liveValue<T>(initial: T) {
  let value = initial;
  const listeners = new Set<(value: T) => void>();
  return {
    value: () => value,
    current: async () => value,
    subscribe: (listener: (value: T) => void) => {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
    set(next: T) {
      value = next;
      listeners.forEach((listener) => listener(next));
    },
    get listenerCount() {
      return listeners.size;
    },
  };
}

export function fakeColorScheme(initial: Scheme = 'light') {
  const source = liveValue<Scheme>(initial);
  return { ...source, provider: { provide: ColorScheme.SOURCE, useValue: { current: source.value, subscribe: source.subscribe } satisfies ColorSchemeSource } as Provider };
}

export const sizes = (width: number, height: number): Sizes => ({ window: { width, height }, screen: { width, height } });

export function fakeScreen(initial: Sizes = sizes(393, 852)) {
  const source = liveValue<Sizes>(initial);
  return { ...source, provider: { provide: Screen.SOURCE, useValue: { current: source.value, subscribe: source.subscribe } satisfies ScreenSource } as Provider };
}

export function fakeNetwork(initial: NetworkStatus = { connected: true, type: 'wifi', reachable: true }) {
  const source = liveValue<NetworkStatus>(initial);
  return { ...source, provider: { provide: Network.SOURCE, useValue: source as Observed<NetworkStatus> } as Provider };
}

const GRANTED: PermissionResponse = { status: 'granted', granted: true, canAskAgain: true };
const DENIED: PermissionResponse = { status: 'denied', granted: false, canAskAgain: true };
const BLOCKED: PermissionResponse = { status: 'denied', granted: false, canAskAgain: false };
const UNDETERMINED: PermissionResponse = { status: 'undetermined', granted: false, canAskAgain: true };
export const permissions = { granted: GRANTED, denied: DENIED, blocked: BLOCKED, undetermined: UNDETERMINED };

type ExpoFix = Parameters<Parameters<NativeLocation['watchPositionAsync']>[1]>[0];

/** A fix as `expo-location` hands it over. */
export const fix = (latitude: number, longitude: number, timestamp = Date.UTC(2026, 9, 9, 12, 0, 0), accuracy = 12): ExpoFix => ({
  coords: { latitude, longitude, altitude: null, accuracy, altitudeAccuracy: null, heading: null, speed: null },
  timestamp,
});

export const MADRID: Address = {
  street: 'Calle de Alcalá', streetNumber: '1', city: 'Madrid', region: 'Madrid', country: 'Spain',
  name: null, district: null, subregion: null, postalCode: null, isoCountryCode: 'ES', timezone: null, formattedAddress: null,
};

/**
 * A phone's location module: the permission starts as `permission`, the dialog answers
 * `onRequest`, and `emit` sends a fix to whoever is watching. `geocode` answers every
 * reverse geocode, or throws when it is an Error.
 */
export function fakeLocation(options: {
  permission?: PermissionResponse;
  onRequest?: PermissionResponse;
  geocode?: Address[] | Error;
} = {}) {
  let permission = options.permission ?? UNDETERMINED;
  let watcher: ((fix: ExpoFix) => void) | null = null;
  const remove = vi.fn();
  const native = {
    getForegroundPermissionsAsync: vi.fn(async () => permission),
    requestForegroundPermissionsAsync: vi.fn(async () => (permission = options.onRequest ?? GRANTED)),
    getCurrentPositionAsync: vi.fn(async () => fix(0, 0)),
    watchPositionAsync: vi.fn(async (_options: unknown, callback: (value: ExpoFix) => void) => {
      watcher = callback;
      return { remove };
    }),
    reverseGeocodeAsync: vi.fn(async () => {
      const answer = options.geocode ?? [MADRID];
      if (answer instanceof Error) throw answer;
      return answer;
    }),
  };
  return {
    native,
    remove,
    emit: (latitude: number, longitude: number, timestamp?: number) => watcher?.(fix(latitude, longitude, timestamp)),
    provider: { provide: Location.SOURCE, useValue: native as unknown as NativeLocation } as Provider,
  };
}
