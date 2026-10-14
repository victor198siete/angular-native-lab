import { Component } from '@angular/core';
import { NgIcon } from '@ng-native/icons';
import { Text, View } from '@ng-native/components';

/**
 * `<mask>`, `<clipPath>` and `<use>` in an icon's markup, written out by hand and given through
 * `[svg]`, which is the path a lets-icons duotone line icon or a flag-icons flag takes. Each drawing
 * used to lose the thing the element does: a solid square, a square past its circle, no stars.
 */
@Component({
  selector: 'app-icon-shapes-case',
  imports: [NgIcon, Text, View],
  template: `
    <view class="gap-2">
      <view class="flex-row items-end gap-4">
        <view class="gap-1">
          <ng-icon testID="whats-new-a13-1-mask" [svg]="mask" [size]="64" />
          <text class="text-caption text-ink2 dark:text-ink2-dk">mask</text>
        </view>
        <view class="gap-1">
          <ng-icon testID="whats-new-a13-1-clip" [svg]="clip" [size]="64" />
          <text class="text-caption text-ink2 dark:text-ink2-dk">clipPath</text>
        </view>
        <view class="gap-1">
          <ng-icon testID="whats-new-a13-1-use" [svg]="use" [size]="64" />
          <text class="text-caption text-ink2 dark:text-ink2-dk">use</text>
        </view>
      </view>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a13_1.hint">Expected: a square with a round hole, a circle with a stripe (nothing past the circle), and two stars. Before: a solid square, a full square, no stars.</text>
    </view>
  `,
})
export class IconShapesCase {
  protected readonly mask =
    '<svg viewBox="0 0 24 24"><defs><mask id="wn-hole"><rect width="24" height="24" fill="white"/>' +
    '<circle cx="12" cy="12" r="5" fill="black"/></mask></defs>' +
    '<rect x="2" y="2" width="20" height="20" rx="4" fill="#be123c" mask="url(#wn-hole)"/></svg>';

  protected readonly clip =
    '<svg viewBox="0 0 24 24"><defs><clipPath id="wn-disc"><circle cx="12" cy="12" r="10"/></clipPath></defs>' +
    '<g clip-path="url(#wn-disc)"><rect width="24" height="24" fill="#0369a1"/>' +
    '<rect x="0" y="9" width="24" height="6" fill="#fde68a"/></g></svg>';

  protected readonly use =
    '<svg viewBox="0 0 24 12"><defs><path id="wn-star" d="M6 0.5l1.6 3.6 3.9.4-2.9 2.6.8 3.9L6 9l-3.4 2 .8-3.9L.5 4.5l3.9-.4z"/></defs>' +
    '<use href="#wn-star" fill="#b45309"/><use href="#wn-star" x="12" fill="#b45309"/></svg>';
}
