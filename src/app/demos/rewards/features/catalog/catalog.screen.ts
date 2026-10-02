import { Component, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  SafeAreaView,
  Text,
  View,
  VirtualList,
  VirtualListRow,
} from '@ng-native/components';
import type { Reward, RewardCategory } from '../../core/models/index.ts';
import { RewardsStore } from '../../core/rewards.store.ts';
import { formatPoints } from '../../shared/format.ts';
import { CategoryChips } from '../../shared/ui/category-chips.ts';
import { RewardRow } from '../../shared/ui/reward-row.ts';

/** 80pt row + 8pt of air. */
const ROW_HEIGHT = 88;

@Component({
  selector: 'app-catalog-screen',
  imports: [CategoryChips, RewardRow, SafeAreaView, Text, View, VirtualList, VirtualListRow],
  template: `
    <safe-area-view [edges]="['top']" class="flex-1 bg-canvas dark:bg-canvas-dk">
      <view class="gap-3 pb-3 pt-2">
        <view class="flex-row items-center justify-between px-5">
          <text class="text-h1 font-black text-ink dark:text-ink-dk">Catálogo</text>
          <view class="rounded-full bg-raised px-3 py-1.5 dark:bg-raised-dk">
            <text testID="catalog-balance" class="text-body font-semibold tabular-nums text-ink dark:text-ink-dk">{{ balanceLabel() }}</text>
          </view>
        </view>
        <app-category-chips [selected]="store.selectedCategory()" (pick)="pick($event)" />
      </view>

      <virtual-list
        #list
        class="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        [items]="store.filteredRewards()"
        [itemHeight]="rowHeight"
        [keyExtractor]="keyOf"
      >
        @for (row of list.window(); track row.slot) {
          <view [virtualListRow]="row" class="px-5 py-1">
            <app-reward-row [reward]="row.item" [balance]="store.member().points" (open)="open($event)" />
          </view>
        }
        <text listFooter testID="catalog-count" class="py-8 pb-32 text-center text-caption text-ink2 dark:text-ink2-dk">{{ countLabel() }}</text>
      </virtual-list>
    </safe-area-view>
  `,
})
export class CatalogScreen {
  protected readonly store = inject(RewardsStore);
  private readonly router = inject(Router);
  private readonly list = viewChild(VirtualList);

  protected readonly rowHeight = ROW_HEIGHT;
  protected readonly keyOf = (reward: Reward): string => reward.id;

  protected balanceLabel(): string {
    return `${formatPoints(this.store.member().points)} pts`;
  }

  protected countLabel(): string {
    return `${this.store.filteredRewards().length} recompensas`;
  }

  protected pick(category: RewardCategory | null): void {
    this.store.selectCategory(category);
    this.list()?.scrollToOffset({ offset: 0, animated: false });
  }

  protected open(id: string): void {
    void this.router.navigate(['/reward', id]);
  }
}
