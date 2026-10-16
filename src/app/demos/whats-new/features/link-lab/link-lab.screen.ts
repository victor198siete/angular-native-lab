import { Component, DestroyRef, computed, inject } from '@angular/core';
import { Pressable, SafeAreaView, Text, View } from '@ng-native/components';
import { NativeHeader, NativeRouterLink } from '@ng-native/router';
import { ScreenDepth } from '../../core/screen-depth.ts';
import { WN_LINK_LAB, WN_VERSION_PAGE } from '../cases/link-on-stack-case.ts';

/**
 * Page B of case A7-3: a pushed screen with a link back to the 0.7 page under it, which is on the
 * stack already, and a link to its own url with `replaceUrl`.
 */
@Component({
  selector: 'app-whats-new-link-lab-screen',
  imports: [NativeHeader, NativeRouterLink, Pressable, SafeAreaView, Text, View],
  host: { style: 'flex: 1' },
  template: `
    <native-header [title]="title" />
    <safe-area-view [edges]="['bottom']" class="flex-1 bg-canvas dark:bg-canvas-dk">
      <view class="gap-3 p-5">
        <text testID="whats-new-link-lab-heading" accessibilityRole="header" class="text-h1 font-black text-ink dark:text-ink-dk" i18n="@@whatsNew.linkLab.heading">Page B</text>
        <text testID="whats-new-link-lab-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
        <pressable
          testID="whats-new-link-lab-back"
          nativeID="whats-new-link-lab-back"
          class="min-h-11 items-center justify-center self-start rounded-full border border-line bg-raised px-5 dark:border-line-dk dark:bg-raised-dk"
          accessibilityRole="link"
          [accessibilityLabel]="backLabel"
          [nativeRouterLink]="versionPage"
        >
          <text class="text-body font-semibold text-ink dark:text-ink-dk">{{ backLabel }}</text>
        </pressable>
        <pressable
          testID="whats-new-link-lab-replace"
          nativeID="whats-new-link-lab-replace"
          class="min-h-11 items-center justify-center self-start rounded-full border border-line bg-raised px-5 dark:border-line-dk dark:bg-raised-dk"
          accessibilityRole="link"
          [accessibilityLabel]="replaceLabel"
          [nativeRouterLink]="lab"
          [extras]="{ replaceUrl: true }"
        >
          <text class="text-body font-semibold text-ink dark:text-ink-dk">{{ replaceLabel }}</text>
        </pressable>
      </view>
    </safe-area-view>
  `,
})
export class LinkLabScreen {
  private readonly depth = inject(ScreenDepth);
  protected readonly versionPage = WN_VERSION_PAGE;
  protected readonly lab = WN_LINK_LAB;
  protected readonly title = $localize`:@@whatsNew.linkLab.title:Page B`;
  protected readonly backLabel = $localize`:@@whatsNew.linkLab.back:Link to the 0.7 page`;
  protected readonly replaceLabel = $localize`:@@whatsNew.linkLab.replace:Link to Page B with replaceUrl`;
  protected readonly readout = computed(() => {
    const pageB = this.depth.count(WN_LINK_LAB);
    const pageA = this.depth.count(WN_VERSION_PAGE);
    return $localize`:@@whatsNew.linkLab.readout:Copies of Page B: ${pageB}:pageB: / of the 0.7 page: ${pageA}:pageA:`;
  });

  constructor() {
    inject(DestroyRef).onDestroy(this.depth.enter(WN_LINK_LAB));
  }
}
