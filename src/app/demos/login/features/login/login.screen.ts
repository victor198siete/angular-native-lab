import { Component, computed, inject, signal } from '@angular/core';
import { FormField, email, form, required, submit } from '@angular/forms/signals';
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from '@ng-native/components';
import { Biometrics, type BiometricKind } from '@ng-native/expo/biometrics';
import { Haptics } from '@ng-native/expo/haptics';
import { NgIcon } from '@ng-native/icons';
import { NativeHeader, NativeNavigation } from '@ng-native/router';
import { biometricError, biometricName } from '../../../rewards/vault/biometric-text.ts';
import { provideUiIcons } from '../../../rewards/shared/icons.ts';
import { Session } from '../../core/session.ts';

interface LoginForm {
  email: string;
  password: string;
}

const EMPTY: LoginForm = { email: '', password: '' };

/**
 * Sign in with email and password (Signal Forms on native `<text-input>`s). When a refresh token
 * from an earlier run is in the keychain and the phone has a sensor, it also offers Face ID and asks
 * once by itself on arrival: a pass trades the refresh token for a new pair and opens the account;
 * a cancel or a failure shows the platform's own reason, and the password form below is the way in.
 */
@Component({
  selector: 'app-login-screen',
  imports: [FormField, NativeHeader, NgIcon, Pressable, SafeAreaView, ScrollView, Text, TextInput, View],
  providers: [provideUiIcons()],
  host: { style: 'flex: 1' },
  template: `
    <native-header [title]="title" />
    <safe-area-view [edges]="['bottom']" class="flex-1 bg-canvas dark:bg-canvas-dk">
      <scroll-view keyboardShouldPersistTaps="handled" [contentContainerStyle]="{ padding: 20, gap: 16, paddingBottom: 48 }">
        <view class="gap-1">
          <text testID="login-heading" class="text-h1 font-black text-ink dark:text-ink-dk" i18n="@@login.heading">Welcome back</text>
          <text class="text-body text-ink2 dark:text-ink2-dk" i18n="@@login.intro">Sign in to see your account.</text>
        </view>

        @if (canUseFaceId()) {
          <pressable
            testID="login-faceid"
            class="grad-brand h-14 flex-row items-center justify-center gap-2 rounded-lg shadow-cta"
            accessibilityRole="button"
            [disabled]="faceBusy()"
            [accessibilityState]="{ disabled: faceBusy(), busy: faceBusy() }"
            (press)="askFaceId()"
          >
            <ng-icon name="lucideScanFace" [size]="22" color="#ffffff" />
            <text class="text-title font-bold text-white">{{ faceIdText() }}</text>
          </pressable>
          @if (faceError(); as message) {
            <text testID="login-faceid-error" class="text-center text-caption font-semibold text-loss dark:text-loss-dk" accessibilityRole="alert">{{ message }}</text>
          }
          <text class="text-center text-caption font-semibold text-ink2 dark:text-ink2-dk" i18n="@@login.or">or use your password</text>
        }

        <view class="gap-1">
          <text class="text-caption font-semibold text-ink2 dark:text-ink2-dk" i18n="@@login.email">Email</text>
          <text-input testID="login-email" class="field" [formField]="f.email" [accessibilityLabel]="emailLabel" keyboardType="email-address" autoComplete="email" textContentType="emailAddress" autoCapitalize="none" [autoCorrect]="false" returnKeyType="next" />
          @if (errorOf(f.email); as message) {
            <text testID="login-email-error" class="error" accessibilityRole="alert">{{ message }}</text>
          }
        </view>

        <view class="gap-1">
          <text class="text-caption font-semibold text-ink2 dark:text-ink2-dk" i18n="@@login.password">Password</text>
          <text-input testID="login-password" class="field" [formField]="f.password" [accessibilityLabel]="passwordLabel" secureTextEntry autoComplete="current-password" textContentType="password" autoCapitalize="none" [autoCorrect]="false" returnKeyType="go" />
          @if (errorOf(f.password); as message) {
            <text testID="login-password-error" class="error" accessibilityRole="alert">{{ message }}</text>
          }
        </view>

        <pressable
          testID="login-submit"
          class="h-14 items-center justify-center rounded-lg bg-ink dark:bg-ink-dk"
          accessibilityRole="button"
          [disabled]="f().submitting()"
          [accessibilityState]="{ disabled: f().submitting(), busy: f().submitting() }"
          (press)="signIn()"
        >
          <text class="text-title font-bold text-canvas dark:text-canvas-dk">{{ f().submitting() ? signingInText : signInText }}</text>
        </pressable>
      </scroll-view>
    </safe-area-view>
  `,
  styles: `
    .field {
      border-width: 1px;
      border-color: var(--color-line, #e2ded5);
      border-radius: 14px;
      padding: 14px;
      font-size: 17px;
      background-color: #ffffff;
      color: #12131a;
    }
    .field[data-invalid][data-touched] {
      border-color: #be123c;
    }
    .error {
      color: #be123c;
      font-size: 13px;
      font-weight: 600;
    }
    @media (prefers-color-scheme: dark) {
      .field {
        border-color: #262a38;
        background-color: #12141c;
        color: #f4f5fa;
      }
      .field[data-invalid][data-touched] {
        border-color: #ff7a90;
      }
      .error {
        color: #ff7a90;
      }
    }
  `,
})
export class LoginScreen {
  protected readonly session = inject(Session);
  private readonly biometrics = inject(Biometrics);
  private readonly haptics = inject(Haptics);
  private readonly navigation = inject(NativeNavigation);

  protected readonly title = $localize`:@@login.title:Sign in`;
  protected readonly emailLabel = $localize`:@@login.email:Email`;
  protected readonly passwordLabel = $localize`:@@login.password:Password`;
  protected readonly signInText = $localize`:@@login.submit:Sign in`;
  protected readonly signingInText = $localize`:@@login.submitting:Signing in…`;

  protected readonly data = signal<LoginForm>({ ...EMPTY });
  protected readonly f = form(this.data, (path) => {
    required(path.email, { message: $localize`:@@login.error.emailRequired:Enter your email.` });
    email(path.email, { message: $localize`:@@login.error.emailInvalid:That email doesn't look right.` });
    required(path.password, { message: $localize`:@@login.error.passwordRequired:Enter your password.` });
  });

  private readonly sensorAvailable = signal(false);
  private readonly kinds = signal<readonly BiometricKind[]>([]);
  protected readonly faceBusy = signal(false);
  protected readonly faceError = signal<string | null>(null);

  /** Only worth offering when there is a session to reopen and a sensor to reopen it with. */
  protected readonly canUseFaceId = computed(() => this.session.hasRefreshToken() && this.sensorAvailable());
  protected readonly faceIdText = computed(() => {
    const name = biometricName(this.kinds());
    return $localize`:@@login.faceId:Continue with ${name}:name:`;
  });

  constructor() {
    void this.start();
  }

  private async start(): Promise<void> {
    const [available, kinds] = await Promise.all([this.biometrics.available(), this.biometrics.kinds()]);
    this.sensorAvailable.set(available);
    this.kinds.set(kinds);
    if (this.canUseFaceId()) await this.askFaceId();
  }

  /** The first message of a field's errors, once the person has been through it. */
  protected errorOf(field: (typeof this.f)['email'] | (typeof this.f)['password']): string | null {
    const state = field();
    return state.touched() && state.invalid() ? (state.errors()[0]?.message ?? null) : null;
  }

  protected async askFaceId(): Promise<void> {
    if (this.faceBusy()) return;
    this.faceBusy.set(true);
    this.faceError.set(null);
    try {
      const result = await this.biometrics.authenticate($localize`:@@login.prompt:Sign in to your account`);
      if (!result.success) {
        // The platform's own reason, inside the sentence: it is what a person (or a bug report) needs.
        this.faceError.set(biometricError(result.error));
      } else if (await this.session.resume()) {
        await this.enter();
      } else {
        this.faceError.set($localize`:@@login.error.ended:Your session ended. Sign in with your password.`);
      }
    } finally {
      this.faceBusy.set(false);
    }
  }

  protected async signIn(): Promise<void> {
    await submit(this.f, {
      action: async () => {
        const { email: address, password } = this.data();
        const result = await this.session.login(address, password);
        if (!result.ok) {
          this.haptics.notify('error');
          return {
            kind: result.reason,
            message:
              result.reason === 'invalid-credentials'
                ? $localize`:@@login.error.credentials:Wrong email or password.`
                : $localize`:@@login.error.network:Could not reach the server. Try again.`,
            fieldTree: this.f.password,
          };
        }
        this.haptics.notify('success');
        // The password does not outlive the attempt, not even in this screen's state.
        this.f().reset({ ...EMPTY });
        await this.enter();
        return;
      },
      onInvalid: () => this.haptics.notify('warning'),
    });
  }

  /**
   * `reset` empties the stack, so the account is the only screen and the login screen is gone for
   * good. A plain navigation back to `/login` later would pop to this very instance, with its state.
   */
  private async enter(): Promise<void> {
    await this.navigation.reset('/login/account');
  }
}
