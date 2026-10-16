import { Component, computed, signal } from '@angular/core';
import { Text, View, VirtualList, VirtualListRow } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

const PAGE = 3;
const LAST = 12;

/**
 * A list 200 points tall that starts with three 40-point rows, shorter than itself. `endReached`
 * must fire with no drag, and again after each page of three that it appends while resting at the
 * end, until there are 12 rows: the counter climbs by itself. "Keep two rows" leaves fewer rows
 * than before, and `viewableItemsChanged` must report that.
 */
@Component({
  selector: 'app-short-list-case',
  imports: [Text, View, VirtualList, VirtualListRow, WnButton],
  template: `
    <view class="gap-2">
      <view class="list">
        <virtual-list
          #list
          testID="whats-new-a7-2-list"
          class="flex-1"
          [items]="rows()"
          [itemHeight]="40"
          (endReached)="more()"
          (viewableItemsChanged)="viewable.update((n) => n + 1)"
        >
          @for (row of list.window(); track row.slot) {
            <view [virtualListRow]="row" class="row"><text class="text-body text-ink dark:text-ink-dk">{{ rowLabel(row.item) }}</text></view>
          }
        </virtual-list>
      </view>
      <text testID="whats-new-a7-2-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <view class="flex-row flex-wrap gap-2">
        <app-wn-button testId="whats-new-a7-2-keep" [label]="keepLabel" (act)="keep()" />
        <app-wn-button testId="whats-new-a7-2-again" [label]="againLabel" (act)="again()" />
      </view>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a7_2.hint">Do not touch the list. Three rows are shorter than it, and the counter should climb to 4 by itself, with 12 rows at the end.</text>
    </view>
  `,
  styles: `
    .list {
      height: 200px;
      border-radius: 8px;
      background-color: #ece8dc;
    }
    .row {
      justify-content: center;
      padding-left: 12px;
      border-bottom-width: 1px;
      border-color: #d4cfc0;
    }
  `,
})
export class ShortListCase {
  protected readonly rows = signal<readonly number[]>([1, 2, 3]);
  protected readonly ends = signal(0);
  protected readonly viewable = signal(0);
  protected readonly keepLabel = $localize`:@@whatsNew.a7_2.keep:Keep two rows`;
  protected readonly againLabel = $localize`:@@whatsNew.a7_2.again:Start again`;
  protected readonly rowLabel = (n: number) => $localize`:@@whatsNew.a7_2.row:Row ${n}:n:`;
  protected readonly readout = computed(() => {
    const rows = this.rows().length;
    const ends = this.ends();
    const viewable = this.viewable();
    return $localize`:@@whatsNew.a7_2.readout:Rows ${rows}:rows: / endReached ${ends}:ends: times / viewable reports ${viewable}:viewable:`;
  });

  /** The page a feed loads at the end; nothing is added past 12 rows. */
  protected more(): void {
    this.ends.update((n) => n + 1);
    const have = this.rows().length;
    if (have >= LAST) return;
    this.rows.set(Array.from({ length: Math.min(have + PAGE, LAST) }, (_, i) => i + 1));
  }

  protected keep(): void {
    this.rows.update((rows) => rows.slice(0, 2));
  }

  protected again(): void {
    this.ends.set(0);
    this.viewable.set(0);
    this.rows.set([1, 2, 3]);
  }
}
