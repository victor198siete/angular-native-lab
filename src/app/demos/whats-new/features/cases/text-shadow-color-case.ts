import { Component, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

const COLORS = ['#12131a', '#be123c'] as const;

/**
 * #1398: a `text-shadow` with no colour takes the colour of the text, as A21-2 does for a box. The
 * texts sit in a view whose `color` a button flips between the ink and an accent; the second text has
 * a colour of its own and draws the inherited shadow in it. Before, the declaration was dropped with
 * a warning and no shadow was drawn.
 */
@Component({
  selector: 'app-text-shadow-color-case',
  imports: [Text, View, WnButton],
  template: `
    <view class="gap-3">
      <view testID="whats-new-a22-2-scope" class="scope" [style.color]="color()">
        <text testID="whats-new-a22-2-sample" class="sample">Shadow</text>
        <text testID="whats-new-a22-2-own" class="sample own">Own colour</text>
        <text testID="whats-new-a22-2-readout" class="text-body font-semibold">{{ readout() }}</text>
      </view>
      <app-wn-button testId="whats-new-a22-2-flip" [label]="flipLabel" (act)="flip()" />
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a22_2.hint">Expected: a soft shadow under the first word in its own colour, dark for the ink and crimson for the accent, and one under the blue word in blue; the button flips the first one. Before, the shadow was dropped.</text>
    </view>
  `,
  styles: `
    .scope {
      gap: 8px;
      padding: 16px;
      border-radius: 14px;
      background-color: #ece8dc;
    }
    .sample {
      font-size: 28px;
      font-weight: 800;
      text-shadow: 0 2px 4px;
    }
    .own {
      color: #1d4ed8;
    }
  `,
})
export class TextShadowColorCase {
  private readonly index = signal(0);
  protected readonly color = () => COLORS[this.index()];
  protected readonly flipLabel = $localize`:@@whatsNew.a22_2.flip:Flip the text colour`;
  protected readonly readout = () => {
    const color = this.color();
    return $localize`:@@whatsNew.a22_2.readout:Text colour ${color}:color:`;
  };

  protected flip(): void {
    this.index.update((index) => (index + 1) % COLORS.length);
  }
}
