import { Component } from '@angular/core';
import { Text, View } from '@ng-native/components';

/**
 * `aria-checked="false"` and `aria-checked="true"` written as attributes on a checkbox role. The
 * first used to reach native as the text `false` and was announced as checked. Its state is on the
 * accessibility tree (Android uiautomator `checked`), not on the screen.
 */
@Component({
  selector: 'app-aria-checked-case',
  imports: [Text, View],
  template: `
    <view class="gap-2">
      <view testID="whats-new-a14-9-false" role="checkbox" aria-checked="false" aria-label="Off" class="row">
        <text class="text-body text-ink dark:text-ink-dk">aria-checked="false"</text>
      </view>
      <view testID="whats-new-a14-9-true" role="checkbox" aria-checked="true" aria-label="On" class="row">
        <text class="text-body text-ink dark:text-ink-dk">aria-checked="true"</text>
      </view>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a14_9.hint">Expected in the accessibility tree: the first checkbox is not checked, the second is.</text>
    </view>
  `,
  styles: `
    .row {
      min-height: 44px;
      justify-content: center;
      padding: 8px;
      border-radius: 8px;
      background-color: #ece8dc;
    }
  `,
})
export class AriaCheckedCase {}
