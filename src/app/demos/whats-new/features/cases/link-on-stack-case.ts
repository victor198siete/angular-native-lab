import { Component, DestroyRef, computed, inject } from '@angular/core';
import { Pressable, Text, View } from '@ng-native/components';
import { NativeRouterLink } from '@ng-native/router';
import { ScreenDepth } from '../../core/screen-depth.ts';

/** The page this case sits on, and the page it opens: each link goes to a url that is on the stack. */
export const WN_VERSION_PAGE = '/whats-new/0.7';
export const WN_LINK_LAB = '/whats-new/link-lab';

/**
 * The first half of #645. This screen links to "Page B" (a pushed screen). Page B has a link back
 * to this url, which is already on the stack under it: it must push a copy of this screen over B
 * (so the count of copies here goes to 2 and Back lands on B), where it used to pop back to the
 * first copy and destroy B. Page B's own `replaceUrl` link is the other half.
 */
@Component({
  selector: 'app-link-on-stack-case',
  imports: [NativeRouterLink, Pressable, Text, View],
  template: `
    <view class="gap-2">
      <text testID="whats-new-a7-3-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <pressable
        testID="whats-new-a7-3-open"
        nativeID="whats-new-a7-3-open"
        class="min-h-11 items-center justify-center self-start rounded-full border border-line bg-raised px-5 dark:border-line-dk dark:bg-raised-dk"
        accessibilityRole="link"
        [accessibilityLabel]="openLabel"
        [nativeRouterLink]="lab"
      >
        <text class="text-body font-semibold text-ink dark:text-ink-dk">{{ openLabel }}</text>
      </pressable>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a7_3.hint">Open Page B, then press its first link, back to this page. A new copy of this screen opens over Page B and the count goes to 2; Back returns to Page B. Page B's second link swaps Page B for a new one and its count stays at 1.</text>
    </view>
  `,
})
export class LinkOnStackCase {
  private readonly depth = inject(ScreenDepth);
  protected readonly lab = WN_LINK_LAB;
  protected readonly openLabel = $localize`:@@whatsNew.a7_3.open:Open Page B`;
  protected readonly readout = computed(() => {
    const copies = this.depth.count(WN_VERSION_PAGE);
    return $localize`:@@whatsNew.a7_3.readout:Copies of this page on the stack: ${copies}:copies:`;
  });

  constructor() {
    inject(DestroyRef).onDestroy(this.depth.enter(WN_VERSION_PAGE));
  }
}
