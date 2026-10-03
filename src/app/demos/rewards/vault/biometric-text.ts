import type { BiometricKind } from '@ng-native/expo/biometrics';

// Functions, not constants: $localize at module level runs before the translations load.

/** "Face ID", "fingerprint"... for buttons that name the sensor the device really has. */
export function biometricName(kinds: readonly BiometricKind[]): string {
  if (kinds.includes('face')) return $localize`:@@vault.kind.face:Face ID`;
  if (kinds.includes('fingerprint')) return $localize`:@@vault.kind.fingerprint:fingerprint`;
  if (kinds.includes('iris')) return $localize`:@@vault.kind.iris:iris`;
  return $localize`:@@vault.kind.generic:biometrics`;
}

/** A sentence for the platform's reason a prompt did not pass. */
export function biometricError(error: string): string {
  switch (error) {
    case 'user_cancel':
    case 'system_cancel':
    case 'app_cancel':
      return $localize`:@@vault.error.cancel:Cancelled. Try again when you are ready.`;
    case 'lockout':
      return $localize`:@@vault.error.lockout:Too many attempts. Unlock your phone with its passcode, then try again.`;
    case 'not_enrolled':
      return $localize`:@@vault.error.notEnrolled:No biometrics are set up on this phone.`;
    case 'not_available':
      return $localize`:@@vault.error.notAvailable:This phone has no biometric sensor.`;
    case 'passcode_not_set':
      return $localize`:@@vault.error.passcode:Set a passcode on this phone first.`;
    default:
      return $localize`:@@vault.error.other:Could not verify it is you (${error}:error:).`;
  }
}
