import { Component, computed, inject, signal } from '@angular/core';
import { FormField, email, form, minLength, pattern, required, submit, validate } from '@angular/forms/signals';
import { Pressable, SafeAreaView, ScrollView, Switch, Text, TextInput } from '@ng-native/components';
import { Haptics } from '@ng-native/expo/haptics';
import { NativeHeader, NativeNavigation } from '@ng-native/router';
import { MEMBERSHIP_API } from '../../core/membership.api.ts';

interface JoinForm {
  name: string;
  email: string;
  phone: string;
  promotions: boolean;
  terms: boolean;
}

const EMPTY: JoinForm = { name: '', email: '', phone: '', promotions: false, terms: false };

/**
 * "Join the program": Signal Forms bound straight to native controls - `<text-input>` takes
 * `value`, `<switch>` takes `checked`, no adapter. Validation runs as the person types; the
 * "already registered" answer comes back from the sign-up call and lands on the email field
 * like any other error. Layout and copy use plain HTML elements, which 0.4.0 draws natively.
 */
@Component({
  selector: 'app-join-screen',
  imports: [FormField, NativeHeader, Pressable, SafeAreaView, ScrollView, Switch, Text, TextInput],
  host: { style: 'flex: 1' },
  template: `
    <native-header [title]="title" />
    <safe-area-view [edges]="['bottom']" class="flex-1 bg-canvas dark:bg-canvas-dk">
      @if (joined()) {
        <section class="flex-1 items-center justify-center gap-3 px-8">
          <h1 testID="join-success" class="text-center text-h1 font-black text-ink dark:text-ink-dk" i18n="@@join.success.title">Welcome aboard!</h1>
          <p class="text-center text-body text-ink2 dark:text-ink2-dk">{{ welcomeText() }}</p>
          <pressable class="mt-4 h-12 items-center justify-center rounded-full bg-raised px-6 dark:bg-raised-dk" accessibilityRole="button" (press)="done()">
            <text class="text-body font-semibold text-ink dark:text-ink-dk" i18n="@@join.success.done">Back to my wallet</text>
          </pressable>
        </section>
      } @else {
        <scroll-view keyboardShouldPersistTaps="handled" [contentContainerStyle]="{ padding: 20, gap: 16, paddingBottom: 48 }">
          <p class="text-body text-ink2 dark:text-ink2-dk" i18n="@@join.intro">Earn points on every purchase and redeem them for rewards.</p>

          <section class="gap-1">
            <label class="text-caption font-semibold text-ink2 dark:text-ink2-dk" i18n="@@join.name">Full name</label>
            <text-input testID="join-name" class="field" [formField]="f.name" [accessibilityLabel]="nameLabel" autoComplete="name" textContentType="name" autoCapitalize="words" returnKeyType="next" />
            @if (errorOf(f.name); as message) {
              <p testID="join-name-error" class="error" accessibilityRole="alert">{{ message }}</p>
            }
          </section>

          <section class="gap-1">
            <label class="text-caption font-semibold text-ink2 dark:text-ink2-dk" i18n="@@join.email">Email</label>
            <text-input testID="join-email" class="field" [formField]="f.email" [accessibilityLabel]="emailLabel" keyboardType="email-address" autoComplete="email" textContentType="emailAddress" autoCapitalize="none" returnKeyType="next" />
            @if (errorOf(f.email); as message) {
              <p testID="join-email-error" class="error" accessibilityRole="alert">{{ message }}</p>
            }
          </section>

          <section class="gap-1">
            <label class="text-caption font-semibold text-ink2 dark:text-ink2-dk" i18n="@@join.phone">Phone (optional, 10 digits)</label>
            <text-input testID="join-phone" class="field" [formField]="f.phone" [accessibilityLabel]="phoneLabel" keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" returnKeyType="done" />
            @if (errorOf(f.phone); as message) {
              <p testID="join-phone-error" class="error" accessibilityRole="alert">{{ message }}</p>
            }
          </section>

          <div class="flex-row items-center gap-3 rounded-lg bg-surface px-4 py-3 dark:bg-surface-dk">
            <p class="flex-1 text-body text-ink dark:text-ink-dk" i18n="@@join.promotions">Send me offers and news</p>
            <switch testID="join-promotions" [formField]="f.promotions" [accessibilityLabel]="promotionsLabel" />
          </div>
          <div class="gap-1">
            <div class="flex-row items-center gap-3 rounded-lg bg-surface px-4 py-3 dark:bg-surface-dk">
              <p class="flex-1 text-body text-ink dark:text-ink-dk" i18n="@@join.terms">I accept the program's terms</p>
              <switch testID="join-terms" [formField]="f.terms" [accessibilityLabel]="termsLabel" />
            </div>
            @if (errorOf(f.terms); as message) {
              <p testID="join-terms-error" class="error" accessibilityRole="alert">{{ message }}</p>
            }
          </div>

          <pressable
            testID="join-submit"
            class="grad-brand h-14 items-center justify-center rounded-lg shadow-cta"
            accessibilityRole="button"
            [disabled]="f().submitting()"
            [accessibilityState]="{ disabled: f().submitting(), busy: f().submitting() }"
            (press)="join()"
          >
            <text class="text-title font-bold text-white">{{ f().submitting() ? joiningText : joinText }}</text>
          </pressable>
        </scroll-view>
      }
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
export class JoinScreen {
  private readonly api = inject(MEMBERSHIP_API);
  private readonly haptics = inject(Haptics);
  private readonly navigation = inject(NativeNavigation);

  protected readonly title = $localize`:@@join.title:Join the program`;
  protected readonly nameLabel = $localize`:@@join.name:Full name`;
  protected readonly emailLabel = $localize`:@@join.email:Email`;
  protected readonly phoneLabel = $localize`:@@join.phone:Phone (optional, 10 digits)`;
  protected readonly promotionsLabel = $localize`:@@join.promotions:Send me offers and news`;
  protected readonly termsLabel = $localize`:@@join.terms:I accept the program's terms`;
  protected readonly joinText = $localize`:@@join.submit:Join`;
  protected readonly joiningText = $localize`:@@join.submitting:Joining…`;

  protected readonly data = signal<JoinForm>({ ...EMPTY });
  protected readonly f = form(this.data, (path) => {
    required(path.name, { message: $localize`:@@join.error.nameRequired:Enter your name.` });
    minLength(path.name, 3, { message: $localize`:@@join.error.nameShort:At least 3 characters.` });
    required(path.email, { message: $localize`:@@join.error.emailRequired:Enter your email.` });
    email(path.email, { message: $localize`:@@join.error.emailInvalid:That email doesn't look right.` });
    // Optional: like every Angular validator but required(), pattern() lets an empty value pass.
    pattern(path.phone, /^\d{10}$/, { message: $localize`:@@join.error.phone:10 digits, numbers only.` });
    validate(path.terms, ({ value }) =>
      value() ? undefined : { kind: 'terms', message: $localize`:@@join.error.terms:Accept the terms to join.` },
    );
  });

  protected readonly joined = signal(false);
  protected readonly welcomeText = computed(() => {
    const name = this.data().name.trim().split(/\s+/)[0] ?? '';
    return $localize`:@@join.success.text:${name}:name:, your account is ready. Your first points are on the way.`;
  });

  /** The first message of a field's errors, once the person has been through it. */
  protected errorOf(field: (typeof this.f)['name'] | (typeof this.f)['terms']): string | null {
    const state = field();
    return state.touched() && state.invalid() ? (state.errors()[0]?.message ?? null) : null;
  }

  protected async join(): Promise<void> {
    await submit(this.f, {
      action: async () => {
        const result = await this.api.join(this.data());
        if (!result.ok) {
          this.haptics.notify('error');
          return {
            kind: 'email-taken',
            message: $localize`:@@join.error.taken:This email is already registered.`,
            fieldTree: this.f.email,
          };
        }
        this.haptics.notify('success');
        this.joined.set(true);
        return;
      },
      onInvalid: () => this.haptics.notify('warning'),
    });
  }

  protected done(): void {
    this.navigation.back();
  }
}
