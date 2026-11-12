import { Component, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

const COLORS = ['#12131a', '#be123c'] as const;

/**
 * #1395: `background-image: var(--g)` draws the gradient the token holds, and a background token whose
 * last layer is `currentColor` takes the colour of the text. The second box sits in a view whose
 * `color` a button flips, beside the text that shows it. Before, both declarations were dropped.
 */
@Component({
  selector: 'app-background-token-case',
  imports: [Text, View, WnButton],
  template: `
    <view class="gap-3">
      <view testID="whats-new-a22-3-scope" class="scope" [style.color]="color()">
        <view testID="whats-new-a22-3-gradient" class="box gradient"></view>
        <view testID="whats-new-a22-3-current" class="box current"></view>
        <text testID="whats-new-a22-3-readout" class="text-body font-semibold">{{ readout() }}</text>
      </view>
      <app-wn-button testId="whats-new-a22-3-flip" [label]="flipLabel" (act)="flip()" />
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a22_3.hint">Expected: the first box is filled with a gradient, and the second box is the colour of the text beside it, dark for the ink and crimson for the accent; the button flips both together. Before, both were left empty.</text>
    </view>
  `,
  styles: `
    .scope {
      flex-direction: row;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-radius: 14px;
      background-color: #ece8dc;
    }
    .box {
      width: 56px;
      height: 56px;
      border-radius: 8px;
    }
    .gradient {
      --g: linear-gradient(135deg, #f59e0b, #be123c);
      background-image: var(--g);
    }
    .current {
      --fill: currentColor;
      background: var(--fill);
    }
  `,
})
export class BackgroundTokenCase {
  private readonly index = signal(0);
  protected readonly color = () => COLORS[this.index()];
  protected readonly flipLabel = $localize`:@@whatsNew.a22_3.flip:Flip the text colour`;
  protected readonly readout = () => {
    const color = this.color();
    return $localize`:@@whatsNew.a22_3.readout:Text colour ${color}:color:`;
  };

  protected flip(): void {
    this.index.update((index) => (index + 1) % COLORS.length);
  }
}
