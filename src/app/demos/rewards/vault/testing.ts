import type { Provider } from '@angular/core';
import { Biometrics, type AuthenticationResult, type NativeBiometrics } from '@ng-native/expo/biometrics';
import { SecureStorage } from '@ng-native/expo/secure-store';
import { Store, type NativeStore } from '@ng-native/expo/store';
import { vi } from 'vitest';

/** expo-local-authentication's FACIAL_RECOGNITION. */
const FACE = 2;

/** A phone with Face ID whose prompt answers `results` in order (then the last one again). */
export function fakeBiometrics(
  results: AuthenticationResult[] = [{ success: true }],
  device: { hardware?: boolean; enrolled?: boolean } = {},
) {
  let call = 0;
  const native = {
    hasHardwareAsync: vi.fn(async () => device.hardware ?? true),
    isEnrolledAsync: vi.fn(async () => device.enrolled ?? true),
    supportedAuthenticationTypesAsync: vi.fn(async () => (device.hardware === false ? [] : [FACE])),
    authenticateAsync: vi.fn(async () => results[Math.min(call++, results.length - 1)]),
  } satisfies NativeBiometrics;
  return { native, provider: { provide: Biometrics.SOURCE, useValue: native } as Provider };
}

/** A keychain held in memory, readable synchronously like the real one. */
export function fakeKeychain(initial: Record<string, unknown> = {}) {
  const data = new Map(Object.entries(initial).map(([k, v]) => [k, JSON.stringify(v)]));
  const native: NativeStore = {
    get: async (key) => data.get(key) ?? null,
    getSync: (key) => data.get(key) ?? null,
    set: async (key, value) => void data.set(key, value),
    remove: async (key) => void data.delete(key),
  };
  return { data, provider: { provide: SecureStorage, useValue: new Store(native) } as Provider };
}
