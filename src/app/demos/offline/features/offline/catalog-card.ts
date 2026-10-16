import { Component, LOCALE_ID, inject } from '@angular/core';
import { Pressable, Text, View } from '@ng-native/components';
import { formatPoints } from '../../../rewards/shared/format.ts';
import { OfflineStore } from '../../core/offline.store.ts';
import { OfflineCard } from './card.ts';

/** The cached catalog. Redeeming works with or without a connection: it always goes through the queue. */
@Component({
  selector: 'app-offline-catalog',
  imports: [OfflineCard, Pressable, Text, View],
  template: `
    <app-offline-card [title]="title">
      @for (reward of store.rewards(); track reward.id; let i = $index) {
        <view class="flex-row items-center gap-3">
          <view class="flex-1 gap-0.5">
            <text class="text-body font-semibold text-ink dark:text-ink-dk">{{ reward.title }}</text>
            <text class="text-caption text-ink2 dark:text-ink2-dk">{{ reward.partner }} · {{ points(reward.costPoints) }}</text>
          </view>
          <pressable
            [testID]="'offline-redeem-' + (i + 1)"
            [nativeID]="'offline-redeem-' + (i + 1)"
            class="min-h-11 items-center justify-center rounded-full bg-brand px-4"
            accessibilityRole="button"
            [accessibilityLabel]="redeemLabel(reward.title)"
            (press)="store.redeem(reward)"
          >
            <text class="text-body font-semibold text-white">{{ redeem }}</text>
          </pressable>
        </view>
      } @empty {
        <text testID="offline-catalog-empty" class="text-body text-ink2 dark:text-ink2-dk" i18n="@@offline.catalog.empty">No catalog saved on this phone.</text>
      }
    </app-offline-card>
  `,
})
export class CatalogCard {
  protected readonly store = inject(OfflineStore);
  private readonly locale = inject(LOCALE_ID);

  protected readonly title = $localize`:@@offline.catalog.title:CATALOG`;
  protected readonly redeem = $localize`:@@offline.catalog.redeem:Redeem`;

  protected points(value: number): string {
    const formatted = formatPoints(value, this.locale);
    return $localize`:@@offline.points:${formatted}:points: pts`;
  }

  protected redeemLabel(title: string): string {
    return $localize`:@@offline.catalog.redeemLabel:Redeem ${title}:title:`;
  }
}
