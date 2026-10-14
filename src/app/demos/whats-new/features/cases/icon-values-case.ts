import { Component } from '@angular/core';
import { NgIcon } from '@ng-native/icons';
import { Text, View } from '@ng-native/components';

/**
 * Two small value fixes in the markup an icon reads. `stroke-dasharray="none"` is a solid line (it was
 * read as a dash pattern named none), and an opacity written as a percentage is a fraction. The first
 * drawing has three lines: dashed as the control, then `none`, then `none` inherited from the group.
 * The second has three bars: opacity 1, 0.5 and 50%; the last two should be equally pale.
 */
@Component({
  selector: 'app-icon-values-case',
  imports: [NgIcon, Text, View],
  template: `
    <view class="gap-2">
      <view class="flex-row items-end gap-4">
        <ng-icon testID="whats-new-a13-7-dash" [svg]="dash" [size]="96" />
        <ng-icon testID="whats-new-a13-7-opacity" [svg]="opacity" [size]="96" />
      </view>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a13_7.hint">Expected: the top line is dashed, the two under it are solid; the first bar is dark, and the 0.5 and 50% bars are the same pale tone.</text>
    </view>
  `,
})
export class IconValuesCase {
  protected readonly dash =
    '<svg viewBox="0 0 24 24" fill="none" stroke="#be123c" stroke-width="3">' +
    '<path d="M2 5h20" stroke-dasharray="3 3"/>' +
    '<path d="M2 12h20" stroke-dasharray="none"/>' +
    '<g stroke-dasharray="none"><path d="M2 19h20"/></g></svg>';

  protected readonly opacity =
    '<svg viewBox="0 0 24 24">' +
    '<rect x="2" y="2" width="20" height="5" fill="#0369a1" opacity="1"/>' +
    '<rect x="2" y="9.5" width="20" height="5" fill="#0369a1" opacity="0.5"/>' +
    '<rect x="2" y="17" width="20" height="5" fill="#0369a1" opacity="50%"/></svg>';
}
