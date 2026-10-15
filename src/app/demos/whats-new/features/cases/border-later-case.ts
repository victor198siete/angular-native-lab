import { Component, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

/**
 * Two boxes made with a seagreen `border-color` and no border, given one later by a class: the
 * first its width, the second its width and a dashed style. On Android both used to come out black.
 */
@Component({
  selector: 'app-border-later-case',
  imports: [Text, View, WnButton],
  template: `
    <view class="gap-2">
      <view class="flex-row gap-3">
        <view testID="whats-new-a14-3-width" class="box" [class.done]="done()"><text class="label" i18n="@@whatsNew.a14_3.width">width later</text></view>
        <view testID="whats-new-a14-3-dashed" class="box dashed" [class.done]="done()"><text class="label" i18n="@@whatsNew.a14_3.dashed">width and style later</text></view>
      </view>
      <app-wn-button testId="whats-new-a14-3-toggle" [label]="toggleLabel" (act)="done.update((was) => !was)" />
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a14_3.hint">Press the button: both borders should appear seagreen, not black (Android).</text>
    </view>
  `,
  styles: `
    .box {
      flex: 1;
      min-height: 64px;
      padding: 8px;
      border-color: seagreen;
      border-radius: 8px;
      background-color: #f1efe8;
    }
    .label {
      font-size: 12px;
      color: #12131a;
    }
    .box.done {
      border-width: 4px;
    }
    .box.dashed.done {
      border-style: dashed;
    }
  `,
})
export class BorderLaterCase {
  protected readonly done = signal(false);
  protected readonly toggleLabel = $localize`:@@whatsNew.a14_3.toggle:Give them a border`;
}
