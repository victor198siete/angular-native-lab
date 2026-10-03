import type { Provider } from '@angular/core';
import { Sharing, type NativeSharing } from '@ng-native/device';
import { Brightness, type NativeBrightness } from '@ng-native/expo/brightness';
import { Clipboard, type NativeClipboard } from '@ng-native/expo/clipboard';
import { Haptics, type NativeHaptics } from '@ng-native/expo/haptics';
import { KeepAwake, type NativeKeepAwake } from '@ng-native/expo/keep-awake';
import { ScreenCapture, type NativeScreenCapture } from '@ng-native/expo/screen-capture';
import { vi } from 'vitest';

/**
 * The native side of the in-store modules, as spies: tests check what the app asked the phone
 * to do, and fire a screenshot the way iOS would.
 */
export function fakeStoreModules() {
  let onScreenshot: (() => void) | undefined;
  const brightness = {
    get: vi.fn(async () => 0.4),
    set: vi.fn(async () => {}),
    restore: vi.fn(async () => {}),
  } satisfies NativeBrightness;
  const keepAwake = {
    activate: vi.fn(async () => {}),
    deactivate: vi.fn(async () => {}),
  } satisfies NativeKeepAwake;
  const capture = {
    isAvailableAsync: vi.fn(async () => true),
    preventScreenCaptureAsync: vi.fn(async () => {}),
    allowScreenCaptureAsync: vi.fn(async () => {}),
    enableAppSwitcherProtectionAsync: vi.fn(async () => {}),
    disableAppSwitcherProtectionAsync: vi.fn(async () => {}),
    addScreenshotListener: vi.fn((listener: () => void) => {
      onScreenshot = listener;
      return { remove: () => (onScreenshot = undefined) };
    }),
    getPermissionsAsync: vi.fn(),
    requestPermissionsAsync: vi.fn(),
  } as unknown as NativeScreenCapture;
  const clipboard = {
    getStringAsync: vi.fn(async () => ''),
    setStringAsync: vi.fn(async () => true),
    addClipboardListener: vi.fn(() => ({ remove: () => {} })),
  } satisfies NativeClipboard;
  const sharing = {
    share: vi.fn(async () => ({ action: 'sharedAction' })),
  } satisfies NativeSharing;
  const haptics = {
    impactAsync: vi.fn(async () => {}),
    notificationAsync: vi.fn(async () => {}),
    selectionAsync: vi.fn(async () => {}),
  } satisfies NativeHaptics;

  const providers: Provider[] = [
    { provide: Brightness.SOURCE, useValue: brightness },
    { provide: KeepAwake.SOURCE, useValue: keepAwake },
    { provide: ScreenCapture.SOURCE, useValue: capture },
    { provide: Clipboard.SOURCE, useValue: clipboard },
    { provide: Sharing.SOURCE, useValue: sharing },
    { provide: Haptics.SOURCE, useValue: haptics },
  ];
  return {
    providers,
    brightness,
    keepAwake,
    capture,
    clipboard,
    sharing,
    haptics,
    takeScreenshot: () => onScreenshot?.(),
  };
}
