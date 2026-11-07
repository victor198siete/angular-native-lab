import { Component, computed, ElementRef, inject } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideMapPin } from '@ng-icons/lucide';
import { injectToken } from '@ng-native/device';
import { Text, View } from '@ng-native/components';
import { NgIcon } from '@ng-native/icons';
import { Theme } from '../../../../core/theme.ts';
import { WnButton } from '../shared/action-button.ts';

/**
 * #1411, #1410: `injectToken('--accent')` reads a custom property's resolved value as a signal that
 * follows the colour scheme. The lab has no accent token of its own (its colours are `@theme` pairs
 * substituted at build time), so this case defines `--accent` on the root with `light-dark()`. The
 * icon takes the token as a prop, the text shows its value and the SVG shape paints
 * `fill="var(--accent)"`. The toggle switches the scheme; nothing reloads.
 */
@Component({
  selector: 'app-accent-token-case',
  imports: [NgIcon, Text, View, WnButton],
  providers: [provideIcons({ lucideMapPin })],
  template: `
    <view class="gap-2">
      <view class="flex-row items-center gap-3">
        <ng-icon testID="whats-new-a22-1-icon" name="lucideMapPin" [size]="40" [color]="accent()" />
        <ng-icon testID="whats-new-a22-1-shape" [svg]="shape" [size]="40" />
        <text testID="whats-new-a22-1-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      </view>
      <app-wn-button testId="whats-new-a22-1-toggle" [label]="toggleLabel" (act)="theme.toggle()" />
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a22_1.hint">Expected: the value, the pin and the square change colour when the scheme changes, with no reload. Before, the token had to be copied as a literal and stayed the same in both schemes.</text>
    </view>
  `,
  styles: `
    :host {
      --accent: light-dark(#be123c, #ff6b85);
    }
  `,
})
export class AccentTokenCase {
  protected readonly theme = inject(Theme);
  protected readonly accent = injectToken('--accent', { at: inject(ElementRef).nativeElement });
  protected readonly shape = '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" fill="var(--accent)"/></svg>';
  protected readonly toggleLabel = $localize`:@@whatsNew.a22_1.toggle:Toggle dark mode`;
  protected readonly readout = computed(() => {
    const accent = this.accent() ?? '-';
    return $localize`:@@whatsNew.a22_1.readout:--accent is ${accent}:accent:`;
  });
}
