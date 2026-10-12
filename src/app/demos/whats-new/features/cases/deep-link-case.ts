import { Component } from '@angular/core';
import { Text, View } from '@ng-native/components';

/**
 * An explanation, since a deep link comes from outside the app: open the Device demo over this
 * screen from a terminal, then press Back. There is nothing to press here.
 */
@Component({
  selector: 'app-deep-link-case',
  imports: [Text, View],
  template: `
    <view class="gap-2">
      <text class="text-body text-ink dark:text-ink-dk" i18n="@@whatsNew.a10_2.how">With this screen showing, send the app a link from a terminal, then press Back in the header.</text>
      <view class="rounded-md bg-raised p-3 dark:bg-raised-dk">
        <text testID="whats-new-a10-2-command" selectable class="text-caption text-ink dark:text-ink-dk">xcrun simctl openurl booted exp://127.0.0.1:8081/--/device</text>
      </view>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a10_2.expected">Expected: the Device demo opens over this screen, and Back returns here, not to an earlier screen.</text>
    </view>
  `,
})
export class DeepLinkCase {}
