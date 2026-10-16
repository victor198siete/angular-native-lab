import { Component, signal } from '@angular/core';
import { Text, View, VirtualList, VirtualListRow } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

/**
 * #558, the first issue this lab opened upstream: a `<virtual-list>` with `listHeader` and
 * `listFooter` stopped the app on Android with "ScrollView can host only one direct child". Here it
 * opens with both, and the button scrolls to the end where the footer is. The list is 45% wide so
 * the middle of the screen, where an automated vertical swipe starts, is never over it.
 */
@Component({
  selector: 'app-list-header-footer-case',
  imports: [Text, View, VirtualList, VirtualListRow, WnButton],
  template: `
    <view class="gap-2">
      <view class="list">
        <virtual-list #list testID="whats-new-a6-5-list" class="flex-1" [items]="rows" [itemHeight]="36" (scroll)="offset.set($event.nativeEvent.contentOffset.y)">
          <text listHeader testID="whats-new-a6-5-header" class="header">{{ headerLabel }}</text>
          @for (row of list.window(); track row.slot) {
            <view [virtualListRow]="row" class="row"><text class="text-body text-ink dark:text-ink-dk">{{ rowLabel(row.item) }}</text></view>
          }
          <text listFooter testID="whats-new-a6-5-footer" class="footer">{{ footerLabel }}</text>
        </virtual-list>
      </view>
      <text testID="whats-new-a6-5-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <app-wn-button testId="whats-new-a6-5-end" [label]="endLabel" (act)="end(list)" />
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a6_5.hint">The list opens with its header above the rows. Press Scroll to the footer: the footer is under the last row. On Android, before 0.6.0, the app stopped here.</text>
    </view>
  `,
  styles: `
    .list {
      width: 45%;
      height: 200px;
      border-radius: 8px;
      background-color: #ece8dc;
    }
    .header,
    .footer {
      padding: 10px;
      font-size: 14px;
      font-weight: bold;
      color: #12131a;
      background-color: #d9d3c0;
    }
    .row {
      justify-content: center;
      padding-left: 12px;
    }
  `,
})
export class ListHeaderFooterCase {
  protected readonly rows = Array.from({ length: 20 }, (_, i) => i + 1);
  protected readonly offset = signal(0);
  protected readonly headerLabel = $localize`:@@whatsNew.a6_5.header:Header`;
  protected readonly footerLabel = $localize`:@@whatsNew.a6_5.footer:Footer`;
  protected readonly endLabel = $localize`:@@whatsNew.a6_5.end:Scroll to the footer`;
  protected readonly rowLabel = (n: number) => $localize`:@@whatsNew.a6_5.row:Row ${n}:n:`;
  protected readonly readout = () => {
    const offset = Math.round(this.offset());
    return $localize`:@@whatsNew.a6_5.readout:Scrolled ${offset}:offset: points`;
  };

  protected end(list: VirtualList<number>): void {
    list.scrollToEnd({ animated: false });
  }
}
