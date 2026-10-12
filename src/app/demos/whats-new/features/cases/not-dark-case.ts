import { Component, inject } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { Theme } from '../../../../core/theme.ts';
import { WnButton } from '../shared/action-button.ts';

/**
 * Tailwind's `not-dark:` with the class-based dark variant. The swatch is amber in light and zinc in
 * dark; before 0.8 the amber still applied in dark. It follows the lab's scheme (the system's, or
 * the toggle).
 */
@Component({
  selector: 'app-not-dark-case',
  imports: [Text, View, WnButton],
  template: `
    <view class="gap-2">
      <view testID="whats-new-a8-6-swatch" class="h-16 items-center justify-center rounded-md not-dark:bg-amber-200 dark:bg-zinc-800">
        <text class="text-body font-bold not-dark:text-zinc-900 dark:text-white">not-dark:bg-amber-200 dark:bg-zinc-800</text>
      </view>
      <text testID="whats-new-a8-6-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <app-wn-button testId="whats-new-a8-6-toggle" [label]="toggleLabel" (act)="theme.toggle()" />
    </view>
  `,
})
export class NotDarkCase {
  protected readonly theme = inject(Theme);
  protected readonly toggleLabel = $localize`:@@whatsNew.a8_6.toggle:Toggle dark mode`;
  protected readonly readout = () =>
    this.theme.isDark()
      ? $localize`:@@whatsNew.a8_6.dark:Scheme: dark (the swatch should be zinc)`
      : $localize`:@@whatsNew.a8_6.light:Scheme: light (the swatch should be amber)`;
}
