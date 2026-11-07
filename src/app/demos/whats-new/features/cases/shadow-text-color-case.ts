import { Component, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

const COLORS = ['#12131a', '#be123c'] as const;

/**
 * #1389: a `box-shadow` with no colour takes the colour of the text around it. The box sits in a
 * view whose `color` a button flips between the ink and an accent; before, the declaration was
 * dropped with a warning and nothing was drawn.
 */
@Component({
  selector: 'app-shadow-text-color-case',
  imports: [Text, View, WnButton],
  template: `
    <view class="gap-3">
      <view testID="whats-new-a21-2-scope" class="scope" [style.color]="color()">
        <view testID="whats-new-a21-2-box" class="box"></view>
        <text testID="whats-new-a21-2-text" class="text-body font-semibold">{{ readout() }}</text>
      </view>
      <app-wn-button testId="whats-new-a21-2-flip" [label]="flipLabel" (act)="flip()" />
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a21_2.hint">Expected: a soft shadow under the box, in the colour of the text beside it, dark for the ink and crimson for the accent; the button flips both together.</text>
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
      background-color: #ffffff;
      box-shadow: 0 4px 12px;
    }
  `,
})
export class ShadowTextColorCase {
  private readonly index = signal(0);
  protected readonly color = () => COLORS[this.index()];
  protected readonly flipLabel = $localize`:@@whatsNew.a21_2.flip:Flip the text colour`;
  protected readonly readout = () => {
    const color = this.color();
    return $localize`:@@whatsNew.a21_2.readout:Text colour ${color}:color:`;
  };

  protected flip(): void {
    this.index.update((index) => (index + 1) % COLORS.length);
  }
}
