import { Service, computed, inject, signal } from '@angular/core';
import { Biometrics, type BiometricKind } from '@ng-native/expo/biometrics';
import { SecureStorage } from '@ng-native/expo/secure-store';

/** Keychain key for the "ask for biometrics on launch" preference. */
export const LOCK_ON_LAUNCH_KEY = 'vault.lockOnLaunch';

/**
 * Biometric lock for the Rewards demo: an opt-in lock on launch, and the session's unlocked state
 * that also reveals the voucher codes. The preference lives in the keychain; the codes do not
 * (they come from the movements, as they would from an API).
 */
@Service()
export class VaultLock {
  private readonly biometrics = inject(Biometrics);
  private readonly storage = inject(SecureStorage);

  /** Persisted. Read synchronously from the keychain, so the launch guard sees the real value. */
  readonly lockOnLaunch = this.storage.signal<boolean>(LOCK_ON_LAUNCH_KEY, false);

  private readonly _unlocked = signal(false);
  /** Authenticated in this session (until the app restarts). */
  readonly unlocked = this._unlocked.asReadonly();
  /** What the launch guard checks. */
  readonly locked = computed(() => this.lockOnLaunch() && !this._unlocked());

  /** Set once `kinds()` has answered: from then on a `false` from the sensor reads as a no. */
  private readonly answered = signal(false);
  /**
   * `null` while the platform has not answered, then whether a prompt can succeed. Since 0.23.0
   * `Biometrics.available` is a signal that reads `false` until the platform answers, so a `false`
   * before `kinds()` has answered too is taken as "not known yet", not as "no sensor"; and a later
   * `true` (the sensor answering after `kinds()`, or a face enrolled in Settings) still comes through.
   */
  readonly available = computed<boolean | null>(() =>
    this.biometrics.available() ? true : this.answered() ? false : null,
  );
  readonly kinds = signal<readonly BiometricKind[]>([]);
  /** The platform's reason the last prompt did not pass (`user_cancel`, `lockout`...). */
  readonly lastError = signal<string | null>(null);
  readonly busy = signal(false);

  /** Asks the device whether a prompt can succeed, and which kind of sensor it has. */
  async check(): Promise<void> {
    this.kinds.set(await this.biometrics.kinds());
    this.answered.set(true);
  }

  /** Shows the system prompt. On success the session stays unlocked until the app restarts. */
  async authenticate(message: string): Promise<boolean> {
    if (this.busy()) return false;
    this.busy.set(true);
    try {
      const result = await this.biometrics.authenticate(message);
      if (result.success) {
        this._unlocked.set(true);
        this.lastError.set(null);
        return true;
      }
      this.lastError.set(result.error);
      return false;
    } finally {
      this.busy.set(false);
    }
  }

  /**
   * Turning the lock on asks first, so it cannot be enabled on a device that would then fail to
   * open it. Turning it off does not ask: the session is already unlocked to get here.
   */
  async setLockOnLaunch(on: boolean, message: string): Promise<boolean> {
    if (!on) {
      this.lockOnLaunch.set(false);
      return true;
    }
    if (!(await this.authenticate(message))) return false;
    this.lockOnLaunch.set(true);
    return true;
  }
}
