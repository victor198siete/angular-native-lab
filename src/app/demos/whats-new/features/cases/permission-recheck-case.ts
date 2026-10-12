import { Component, inject, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { Location } from '@ng-native/expo/location';
import { WnButton } from '../shared/action-button.ts';

/**
 * `Permission.ensure()` and `blocked()` after the permission changes outside the app. It reads the
 * same `Location.permission` the Device demo's card does: refuse Location for the app, turn it on in
 * Settings, come back, and `blocked()` should flip by itself. "Ask with ensure()" is the second half
 * of the note: with the permission back on, `ensure()` answers true and shows no dialog.
 */
@Component({
  selector: 'app-permission-recheck-case',
  imports: [Text, View, WnButton],
  template: `
    <view class="gap-2">
      <view class="gap-1 rounded-md bg-raised p-3 dark:bg-raised-dk">
        <text testID="whats-new-a8-1-permission" class="text-body font-semibold text-ink dark:text-ink-dk">{{ statusText() }}</text>
        <text testID="whats-new-a8-1-blocked" class="text-body font-semibold text-ink dark:text-ink-dk">{{ blockedText() }}</text>
        <text testID="whats-new-a8-1-ensure" class="text-body font-semibold text-ink dark:text-ink-dk">{{ ensureText() }}</text>
      </view>
      <view class="flex-row flex-wrap gap-3">
        <app-wn-button testId="whats-new-a8-1-check" [label]="checkLabel" (act)="check()" />
        <app-wn-button testId="whats-new-a8-1-ask" [label]="askLabel" (act)="ask()" />
      </view>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a8_1.hint">Refuse Location for this app, leave for Settings, turn it on, and come back: blocked should go to no by itself, with no dialog and no restart.</text>
    </view>
  `,
})
export class PermissionRecheckCase {
  private readonly permission = inject(Location).permission;

  protected readonly checkLabel = $localize`:@@whatsNew.a8_1.check:Read the permission`;
  protected readonly askLabel = $localize`:@@whatsNew.a8_1.ask:Ask with ensure()`;

  /** What the last `ensure()` answered; `null` before the first press. */
  private readonly answer = signal<boolean | null>(null);

  protected readonly statusText = () =>
    $localize`:@@whatsNew.a8_1.status:Permission: ${this.permission.status()}:status:`;
  protected readonly blockedText = () =>
    this.permission.blocked()
      ? $localize`:@@whatsNew.a8_1.blockedYes:blocked(): yes`
      : $localize`:@@whatsNew.a8_1.blockedNo:blocked(): no`;
  protected readonly ensureText = () => {
    const answer = this.answer();
    if (answer === null) return $localize`:@@whatsNew.a8_1.ensureNone:ensure(): not asked yet`;
    return answer
      ? $localize`:@@whatsNew.a8_1.ensureYes:ensure(): granted`
      : $localize`:@@whatsNew.a8_1.ensureNo:ensure(): not granted`;
  };

  constructor() {
    // Learn the current answer without showing a dialog, as the Device card does.
    void this.permission.check();
  }

  /** Reads what the platform thinks, without a dialog. */
  protected check(): void {
    void this.permission.check();
  }

  protected async ask(): Promise<void> {
    this.answer.set(await this.permission.ensure());
  }
}
