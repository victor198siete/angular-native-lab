import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NavigationBar, type NavigationBarStyle } from '@ng-native/device';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

const STYLES: readonly (NavigationBarStyle | null)[] = [null, 'dark', 'light', 'auto'];

/**
 * #907: `NavigationBar`, a stack of claims on Android's navigation bar. One button claims `hidden`
 * and gives it back; another walks the button style through dark, light and auto, each as a claim
 * of its own on top of the last. The claims are dropped when the card leaves. On iOS the claims
 * are kept in `state` and change nothing, which the readout shows.
 */
@Component({
  selector: 'app-navigation-bar-case',
  imports: [Text, View, WnButton],
  template: `
    <view class="gap-2">
      <text testID="whats-new-a15-6-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <view class="flex-row flex-wrap gap-2">
        <app-wn-button testId="whats-new-a15-6-hidden" [label]="hiding() ? showLabel : hideLabel" (act)="toggleHidden()" />
        <app-wn-button testId="whats-new-a15-6-style" [label]="styleLabel" (act)="nextStyle()" />
      </view>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a15_6.hint">Expected on Android: Hide the bar hides the system navigation bar until a swipe from the edge shows it for a moment, and Button style changes the colour of its buttons (three-button navigation, Android 8+). The readout follows the claims on both platforms.</text>
    </view>
  `,
})
export class NavigationBarCase {
  private readonly bar = inject(NavigationBar);

  protected readonly hiding = signal(false);
  private dropHidden: (() => void) | undefined;
  private dropStyle: (() => void) | undefined;
  private styleIndex = 0;

  protected readonly hideLabel = $localize`:@@whatsNew.a15_6.hide:Hide the bar`;
  protected readonly showLabel = $localize`:@@whatsNew.a15_6.show:Give the bar back`;
  protected readonly styleLabel = $localize`:@@whatsNew.a15_6.style:Button style`;
  protected readonly readout = () => {
    const { style, hidden } = this.bar.state();
    const styleText = style ?? '-';
    const hiddenText = hidden ? 'yes' : 'no';
    return $localize`:@@whatsNew.a15_6.readout:Bar claims: style ${styleText}:style: / hidden ${hiddenText}:hidden:`;
  };

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.dropHidden?.();
      this.dropStyle?.();
    });
  }

  protected toggleHidden(): void {
    if (this.dropHidden) {
      this.dropHidden();
      this.dropHidden = undefined;
      this.hiding.set(false);
    } else {
      this.dropHidden = this.bar.push({ hidden: true });
      this.hiding.set(true);
    }
  }

  protected nextStyle(): void {
    this.dropStyle?.();
    this.dropStyle = undefined;
    this.styleIndex = (this.styleIndex + 1) % STYLES.length;
    const style = STYLES[this.styleIndex];
    if (style) this.dropStyle = this.bar.push({ style });
  }
}
