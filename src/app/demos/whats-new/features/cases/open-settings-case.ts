import { Component, inject, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { DeepLinks } from '@ng-native/device';
import { WnButton } from '../shared/action-button.ts';

/**
 * `DeepLinks.openSettings()`: a button that sends a person to the app's own page in the system
 * settings, where a permission that `blocked()` reports is turned back on. The readout counts the
 * presses; what the platform then does (which page opens) is read from the screen, not from here.
 */
@Component({
  selector: 'app-open-settings-case',
  imports: [Text, View, WnButton],
  template: `
    <view class="gap-2">
      <app-wn-button testId="whats-new-a11-1-open" [label]="openLabel" (act)="open()" />
      <text testID="whats-new-a11-1-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a11_1.hint">Expected: the system Settings open on this app's own page. Come back with the app switcher or Back; the app keeps running.</text>
    </view>
  `,
})
export class OpenSettingsCase {
  private readonly links = inject(DeepLinks);
  protected readonly openLabel = $localize`:@@whatsNew.a11_1.open:Open this app's Settings`;
  private readonly presses = signal(0);
  protected readonly readout = () => {
    const count = this.presses();
    return $localize`:@@whatsNew.a11_1.readout:openSettings() called: ${count}:count: times`;
  };

  protected open(): void {
    this.links.openSettings();
    this.presses.update((count) => count + 1);
  }
}
