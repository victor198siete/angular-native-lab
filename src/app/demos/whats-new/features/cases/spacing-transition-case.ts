import { Component, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

/**
 * A transition of `padding`, `margin` and `border-radius` where no rule sets them from or to 0: the
 * closed state writes none of them, the `.open` rule writes 20px, 20px and 40px. The inner box's
 * `(layout)` x is the padding (and the margin) at the last commit; a screenshot in the middle of the
 * 2 s shows the easing.
 */
@Component({
  selector: 'app-spacing-transition-case',
  imports: [Text, View, WnButton],
  template: `
    <view class="gap-2">
      <view class="gap-2">
        <view testID="whats-new-a8-3-padding" class="pad-box" [class.open]="open()">
          <view class="inner" (layout)="padX.set($event.nativeEvent.layout.x)"></view>
        </view>
        <view class="margin-row">
          <view testID="whats-new-a8-3-margin" class="margin-box" [class.open]="open()" (layout)="marginX.set($event.nativeEvent.layout.x)"></view>
        </view>
        <view testID="whats-new-a8-3-radius" class="radius-box" [class.open]="open()"></view>
      </view>
      <text testID="whats-new-a8-3-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <app-wn-button testId="whats-new-a8-3-toggle" [label]="open() ? closeLabel : openLabel" (act)="open.set(!open())" />
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a8_3.hint">Open should ease padding to 20, margin to 20 and the corner radius to 40 over 2 s, and Close ease them back, not jump.</text>
    </view>
  `,
  styles: `
    .pad-box {
      background-color: crimson;
      border-radius: 8px;
      transition: padding 2000ms linear;
    }
    .pad-box.open {
      padding: 20px;
    }
    .inner {
      height: 28px;
      background-color: gold;
      border-radius: 4px;
    }
    .margin-row {
      background-color: #d8d3c8;
      border-radius: 8px;
    }
    .margin-box {
      height: 32px;
      background-color: royalblue;
      border-radius: 4px;
      transition: margin 2000ms linear;
    }
    .margin-box.open {
      margin: 20px;
    }
    .radius-box {
      height: 56px;
      background-color: seagreen;
      transition: border-radius 2000ms linear;
    }
    .radius-box.open {
      border-radius: 40px;
    }
  `,
})
export class SpacingTransitionCase {
  protected readonly open = signal(false);
  protected readonly padX = signal(0);
  protected readonly marginX = signal(0);
  protected readonly openLabel = $localize`:@@whatsNew.a8_3.open:Open`;
  protected readonly closeLabel = $localize`:@@whatsNew.a8_3.close:Close`;

  protected readonly readout = () => {
    const pad = Math.round(this.padX());
    const margin = Math.round(this.marginX());
    return $localize`:@@whatsNew.a8_3.readout:Padding ${pad}:pad: / margin ${margin}:margin:`;
  };
}
