import { Component, LOCALE_ID, computed, inject, signal } from '@angular/core';
import { SafeAreaView, ScrollView, Text, View, VirtualList, VirtualListRow } from '@ng-native/components';
import { NativeHeader } from '@ng-native/router';
import { formatPoints } from '../../../rewards/shared/format.ts';
import { type ListSize, rowsFor, SIZES } from '../../core/mock-rows.ts';
import { MountCounter } from '../../core/mount-counter.ts';
import { mockLanguage } from '../../../rewards/core/mocks/language.ts';
import { ListRow, ROW_HEIGHT } from './list-row.ts';
import { Segmented, type SegmentOption } from './segmented.ts';

type Renderer = 'virtual' | 'scroll';

/**
 * The same rows drawn by `<virtual-list>` and by `<scroll-view>`, at 200 and 2,000 rows, with a
 * live count of the row components Angular has mounted. Counts only; nothing here is timed.
 */
@Component({
  selector: 'app-lists-screen',
  imports: [ListRow, NativeHeader, SafeAreaView, ScrollView, Segmented, Text, View, VirtualList, VirtualListRow],
  providers: [MountCounter],
  host: { style: 'flex: 1' },
  template: `
    <native-header [title]="title" />
    <safe-area-view [edges]="['bottom']" class="flex-1 bg-canvas dark:bg-canvas-dk">
      <view class="gap-4 p-5 pb-3">
        <view class="gap-1">
          <text testID="lists-heading" accessibilityRole="header" class="text-h1 font-black text-ink dark:text-ink-dk" i18n="@@lists.heading">Long lists, two ways</text>
          <text class="text-body text-ink2 dark:text-ink2-dk" i18n="@@lists.intro">A scroll-view mounts every row. A virtual-list mounts only the rows near the screen and recycles them as you scroll.</text>
        </view>
        <app-segmented [options]="sizeOptions" [selected]="size()" [label]="sizeLabel" (pick)="setSize($event)" />
        <app-segmented [options]="rendererOptions" [selected]="renderer()" [label]="rendererLabel" (pick)="setRenderer($event)" />
        <view class="gap-1 rounded-lg bg-surface p-4 shadow-card dark:bg-surface-dk dark:shadow-card-dk">
          <text testID="lists-mounted" class="text-title font-bold tabular-nums text-ink dark:text-ink-dk">{{ mountedText() }}</text>
          <text testID="lists-views" class="text-caption tabular-nums text-ink2 dark:text-ink2-dk">{{ viewsText() }}</text>
        </view>
      </view>

      <!-- Keyed on size and renderer: each change builds a new list from the top, so the built count starts from zero. -->
      @for (key of listKey(); track key) {
      @if (renderer() === 'virtual') {
        <virtual-list #list testID="lists-virtual" class="flex-1" [items]="rows()" [itemHeight]="rowHeight" [keyExtractor]="keyOf">
          @for (row of list.window(); track row.slot) {
            <view [virtualListRow]="row">
              <app-list-row [row]="row.item" />
            </view>
          }
        </virtual-list>
      } @else {
        <scroll-view testID="lists-scroll" class="flex-1">
          @for (row of rows(); track row.id) {
            <app-list-row [row]="row" />
          }
        </scroll-view>
      }
      }
    </safe-area-view>
  `,
})
export class ListsScreen {
  private readonly counter = inject(MountCounter);
  private readonly locale = inject(LOCALE_ID);

  protected readonly title = $localize`:@@lists.title:Lists`;
  protected readonly sizeLabel = $localize`:@@lists.size.a11y:Number of rows`;
  protected readonly rendererLabel = $localize`:@@lists.renderer.a11y:List renderer`;
  protected readonly rowHeight = ROW_HEIGHT;
  protected readonly keyOf = (row: { id: number }): number => row.id;

  protected readonly sizeOptions: readonly SegmentOption<ListSize>[] = SIZES.map((value) => ({
    value,
    label: formatPoints(value, this.locale),
    testId: `lists-size-${value}`,
  }));
  protected readonly rendererOptions: readonly SegmentOption<Renderer>[] = [
    { value: 'virtual', label: 'virtual-list', testId: 'lists-renderer-virtual' },
    { value: 'scroll', label: 'scroll-view', testId: 'lists-renderer-scroll' },
  ];

  protected readonly size = signal<ListSize>(200);
  protected readonly renderer = signal<Renderer>('virtual');
  protected readonly rows = computed(() => rowsFor(this.size(), mockLanguage(this.locale)));
  protected readonly listKey = computed(() => [this.renderer() + this.size()]);

  protected readonly mountedText = computed(() => {
    const mounted = formatPoints(this.counter.live(), this.locale);
    const total = formatPoints(this.size(), this.locale);
    return $localize`:@@lists.mounted:${mounted}:mounted: of ${total}:total: mounted`;
  });
  protected readonly viewsText = computed(() => {
    const created = formatPoints(this.counter.created(), this.locale);
    return this.renderer() === 'virtual'
      ? $localize`:@@lists.views.virtual:Row views built: ${created}:created:, recycled as you scroll`
      : $localize`:@@lists.views.scroll:Row views built: ${created}:created:, one per row`;
  });

  protected setSize(size: ListSize): void {
    this.counter.resetCreated();
    this.size.set(size);
  }

  protected setRenderer(renderer: Renderer): void {
    this.counter.resetCreated();
    this.renderer.set(renderer);
  }
}
