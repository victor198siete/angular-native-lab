import { Component, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

const BRANDS = ['#0369a1', '#be123c', '#15803d'] as const;

/**
 * #866: a colour bound as a style and made of tokens. `--brand` is set on the view around the
 * swatches and a button moves it. The first swatch is the token itself (the control, which worked
 * before); the others are `color-mix()` with white, a relative colour that changes nothing, and a
 * relative colour whose red channel is `clamp(0.6, r, 1)`. Before, the last three reached native as
 * text and painted nothing.
 */
@Component({
  selector: 'app-token-colors-case',
  imports: [Text, View, WnButton],
  template: `
    <view class="gap-2">
      <view testID="whats-new-a15-1-scope" class="gap-2" [style.--brand]="brand()">
        <view class="flex-row gap-2">
          <view testID="whats-new-a15-1-base" class="swatch" [style.backgroundColor]="base"></view>
          <view testID="whats-new-a15-1-mix" class="swatch" [style.backgroundColor]="mix"></view>
          <view testID="whats-new-a15-1-relative" class="swatch" [style.backgroundColor]="relative"></view>
          <view testID="whats-new-a15-1-clamp" class="swatch" [style.backgroundColor]="clamped"></view>
        </view>
      </view>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a15_1.labels">From the left: var(--brand), color-mix with white 20%, a relative colour, a relative colour with clamp() on red.</text>
      <text testID="whats-new-a15-1-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <app-wn-button testId="whats-new-a15-1-next" [label]="nextLabel" (act)="next()" />
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a15_1.hint">Expected: four swatches, none blank. The second is paler than the first, the third equals the first, the fourth has more red; all follow the button.</text>
    </view>
  `,
  styles: `
    .swatch {
      width: 56px;
      height: 56px;
      border-radius: 8px;
    }
  `,
})
export class TokenColorsCase {
  protected readonly base = 'var(--brand)';
  protected readonly mix = 'color-mix(in srgb, var(--brand), white 20%)';
  protected readonly relative = 'color(from var(--brand) srgb r g b)';
  protected readonly clamped = 'color(from var(--brand) srgb clamp(0.6, r, 1) g b)';

  private readonly index = signal(0);
  protected readonly brand = () => BRANDS[this.index()];
  protected readonly nextLabel = $localize`:@@whatsNew.a15_1.next:Change --brand`;
  protected readonly readout = () => {
    const brand = this.brand();
    return $localize`:@@whatsNew.a15_1.readout:--brand is ${brand}:brand:`;
  };

  protected next(): void {
    this.index.update((index) => (index + 1) % BRANDS.length);
  }
}
