import { Component, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideMapPin } from '@ng-icons/lucide';
import { NgIcon } from '@ng-native/icons';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

const ACCENTS = ['#be123c', '#0369a1', '#15803d'] as const;

/**
 * `color="var(--accent)"` on an icon: the token is set on the view around it and a button moves it.
 * The icon should take the token's colour and follow it; it used to be sent to native as the text
 * `var(--accent)`, which paints nothing.
 */
@Component({
  selector: 'app-icon-color-var-case',
  imports: [NgIcon, Text, View, WnButton],
  providers: [provideIcons({ lucideMapPin })],
  template: `
    <view class="gap-2">
      <view testID="whats-new-a13-2-scope" class="self-start" [style.--accent]="accent()">
        <ng-icon testID="whats-new-a13-2-icon" name="lucideMapPin" [size]="48" color="var(--accent)" />
      </view>
      <text testID="whats-new-a13-2-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <app-wn-button testId="whats-new-a13-2-next" [label]="nextLabel" (act)="next()" />
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a13_2.hint">Expected: the pin is drawn in the colour --accent holds, and changes with the button.</text>
    </view>
  `,
})
export class IconColorVarCase {
  private readonly index = signal(0);
  protected readonly accent = () => ACCENTS[this.index()];
  protected readonly nextLabel = $localize`:@@whatsNew.a13_2.next:Change --accent`;
  protected readonly readout = () => {
    const accent = this.accent();
    return $localize`:@@whatsNew.a13_2.readout:--accent is ${accent}:accent:`;
  };

  protected next(): void {
    this.index.update((index) => (index + 1) % ACCENTS.length);
  }
}
