import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-native/icons';
import { Pressable, SafeAreaView, Text, View, VirtualList, VirtualListRow } from '@ng-native/components';
import type { Movement } from '../../core/models/index.ts';
import { Theme } from '../../../../core/theme.ts';
import { RewardsStore } from '../../core/rewards.store.ts';
import { ICON_COLOR, provideUiIcons } from '../../shared/icons.ts';
import { dayLabel } from '../../shared/format.ts';
import { MovementRow } from '../../shared/ui/movement-row.ts';

type HistoryItem =
  | { readonly kind: 'header'; readonly key: string; readonly label: string }
  | { readonly kind: 'movement'; readonly key: string; readonly movement: Movement };

const HEADER_HEIGHT = 40;
const ROW_HEIGHT = 68;

@Component({
  selector: 'app-history-screen',
  imports: [MovementRow, NgIcon, Pressable, SafeAreaView, Text, View, VirtualList, VirtualListRow],
  providers: [provideUiIcons()],
  template: `
    <safe-area-view [edges]="['top']" class="flex-1 bg-canvas dark:bg-canvas-dk">
      <text class="px-5 pb-2 pt-2 text-h1 font-black text-ink dark:text-ink-dk">Historial</text>

      @if (items().length === 0) {
        <view class="flex-1 items-center justify-center gap-4 px-5">
          <ng-icon name="lucideHistory" [size]="56" [color]="muted()" />
          <text class="text-h2 font-bold text-ink dark:text-ink-dk">Sin movimientos todavía</text>
          <pressable
            class="h-12 items-center justify-center rounded-full bg-brand px-6"
            accessibilityRole="button"
            (press)="explore()"
          >
            <text class="text-title font-bold text-white">Explorar catálogo</text>
          </pressable>
        </view>
      } @else {
        <virtual-list
          #list
          class="flex-1"
          contentInsetAdjustmentBehavior="automatic"
          [items]="items()"
          [itemHeight]="heightOf"
          [itemType]="typeOf"
          [keyExtractor]="keyOf"
          [stickyIndices]="headerIndices()"
        >
          @for (row of list.window(); track row.slot) {
            <view [virtualListRow]="row">
              @let item = row.item;
              @if (item.kind === 'header') {
                <view
                  class="h-10 justify-end bg-canvas px-5 pb-2 dark:bg-canvas-dk"
                  accessibilityRole="header"
                  [accessibilityLabel]="item.label"
                >
                  <text class="text-over font-bold tracking-widest text-ink2 dark:text-ink2-dk">{{ item.label }}</text>
                </view>
              } @else {
                <view class="bg-surface dark:bg-surface-dk">
                  <app-movement-row [movement]="item.movement" />
                </view>
              }
            </view>
          }
          <view listFooter class="h-32"></view>
        </virtual-list>
      }
    </safe-area-view>
  `,
})
export class HistoryScreen {
  private readonly store = inject(RewardsStore);
  private readonly router = inject(Router);
  private readonly theme = inject(Theme);
  protected readonly muted = computed(() => (this.theme.isDark() ? ICON_COLOR.muted.dark : ICON_COLOR.muted.light));

  /** Date headers and movements, flattened in the order they are drawn. */
  protected readonly items = computed<readonly HistoryItem[]>(() =>
    this.store.movementsByDate().flatMap((group): HistoryItem[] => [
      { kind: 'header', key: `h-${group.date}`, label: dayLabel(group.date) },
      ...group.movements.map((movement): HistoryItem => ({ kind: 'movement', key: movement.id, movement })),
    ]),
  );
  protected readonly headerIndices = computed(() =>
    this.items().flatMap((item, index) => (item.kind === 'header' ? [index] : [])),
  );

  protected readonly heightOf = (item: HistoryItem): number =>
    item.kind === 'header' ? HEADER_HEIGHT : ROW_HEIGHT;
  protected readonly typeOf = (item: HistoryItem): string => item.kind;
  protected readonly keyOf = (item: HistoryItem): string => item.key;

  protected explore(): void {
    void this.router.navigateByUrl('/catalog');
  }
}
