import { Component, signal } from '@angular/core';
import { NgIcon } from '@ng-native/icons';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

/**
 * #864: an SVG shape whose `fill` or `stroke` holds a colour React Native cannot read is drawn with
 * no paint of its own instead of stopping the app. The left bar takes `var(--paint)` for both; the
 * right bar is a fixed blue. The button sets `--paint` to a typo, `notacolour`.
 */
@Component({
  selector: 'app-svg-bad-paint-case',
  imports: [NgIcon, Text, View, WnButton],
  template: `
    <view class="gap-2">
      <view testID="whats-new-a15-10-scope" class="self-start" [style.--paint]="paint()">
        <ng-icon testID="whats-new-a15-10-icon" [svg]="bars" [size]="72" />
      </view>
      <text testID="whats-new-a15-10-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <app-wn-button testId="whats-new-a15-10-break" [label]="breakLabel" (act)="broken.update((was) => !was)" />
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a15_10.hint">Expected: the app keeps running after Set a typo; the left bar loses its paint and the blue bar stays. Before, the app stopped.</text>
    </view>
  `,
})
export class SvgBadPaintCase {
  protected readonly bars =
    '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="9" height="20" fill="var(--paint)" stroke="var(--paint)" stroke-width="2"/>' +
    '<rect x="13" y="2" width="9" height="20" fill="#0369a1"/></svg>';

  protected readonly broken = signal(false);
  protected readonly paint = () => (this.broken() ? 'notacolour' : '#be123c');
  protected readonly breakLabel = $localize`:@@whatsNew.a15_10.break:Set or fix the typo`;
  protected readonly readout = () => {
    const paint = this.paint();
    return $localize`:@@whatsNew.a15_10.readout:--paint is ${paint}:paint:`;
  };
}
