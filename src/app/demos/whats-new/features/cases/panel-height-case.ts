import { Component, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

/**
 * Three panels share one `@keyframes open` whose last frame is `height: var(--panel-height)`; each
 * sets its own token, the third in `em`. The measured height (from `(layout)`) is the evidence.
 */
@Component({
  selector: 'app-panel-height-case',
  imports: [Text, View, WnButton],
  template: `
    <view class="gap-2">
      <view class="h-28 flex-row items-start gap-3">
        <view testID="whats-new-a9-3-p1" class="panel p1" [class.open]="open()" (layout)="h1.set($event.nativeEvent.layout.height)"></view>
        <view testID="whats-new-a9-3-p2" class="panel p2" [class.open]="open()" (layout)="h2.set($event.nativeEvent.layout.height)"></view>
        <view testID="whats-new-a9-3-p3" class="panel p3" [class.open]="open()" (layout)="h3.set($event.nativeEvent.layout.height)"></view>
      </view>
      <text testID="whats-new-a9-3-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <app-wn-button testId="whats-new-a9-3-toggle" [label]="open() ? closeLabel : openLabel" (act)="open.set(!open())" />
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a9_3.hint">Expected heights: 40, 96 and 64 points (4em at 16 points). Closed, all three are 0.</text>
    </view>
  `,
  styles: `
    .panel {
      width: 56px;
      height: 0;
      border-radius: 8px;
    }
    .p1 {
      --panel-height: 40px;
      background-color: crimson;
    }
    .p2 {
      --panel-height: 96px;
      background-color: royalblue;
    }
    .p3 {
      --panel-height: 4em;
      font-size: 16px;
      background-color: seagreen;
    }
    .panel.open {
      animation: open 1.5s ease-out 1 both;
    }
    @keyframes open {
      from {
        height: 0;
      }
      to {
        height: var(--panel-height);
      }
    }
  `,
})
export class PanelHeightCase {
  protected readonly open = signal(false);
  protected readonly h1 = signal(0);
  protected readonly h2 = signal(0);
  protected readonly h3 = signal(0);
  protected readonly openLabel = $localize`:@@whatsNew.a9_3.open:Open the panels`;
  protected readonly closeLabel = $localize`:@@whatsNew.a9_3.close:Close the panels`;
  protected readonly readout = () =>
    $localize`:@@whatsNew.a9_3.readout:Measured: ${Math.round(this.h1())}:h1: / ${Math.round(this.h2())}:h2: / ${Math.round(this.h3())}:h3:`;
}
