import { Component, LOCALE_ID, inject } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { formatPoints } from '../../../rewards/shared/format.ts';
import { OfflineStore, type RedeemStatus } from '../../core/offline.store.ts';
import { OfflineCard } from './card.ts';

/** The queue of redemptions made on this phone: pending until the server has them, then sent. */
@Component({
  selector: 'app-offline-redemptions',
  imports: [OfflineCard, Text, View],
  template: `
    <app-offline-card [title]="title">
      @for (entry of store.redemptions(); track entry.id) {
        <view class="flex-row items-center gap-3">
          <view class="flex-1 gap-0.5">
            <text class="text-body font-semibold text-ink dark:text-ink-dk">{{ entry.title }}</text>
            <text class="text-caption text-ink2 dark:text-ink2-dk">{{ points(entry.points) }}</text>
          </view>
          <text
            [testID]="'offline-badge-' + entry.seq"
            class="text-caption font-bold"
            [class]="entry.status === 'sent' ? 'text-gain dark:text-gain-dk' : 'text-warn dark:text-warn-dk'"
          >{{ statusText(entry.status) }}</text>
        </view>
      } @empty {
        <text testID="offline-redemptions-empty" class="text-body text-ink2 dark:text-ink2-dk" i18n="@@offline.redemptions.empty">No redemptions yet.</text>
      }
    </app-offline-card>
  `,
})
export class RedemptionsCard {
  protected readonly store = inject(OfflineStore);
  private readonly locale = inject(LOCALE_ID);

  protected readonly title = $localize`:@@offline.redemptions.title:YOUR REDEMPTIONS`;

  protected points(value: number): string {
    const formatted = formatPoints(value, this.locale);
    return $localize`:@@offline.points:${formatted}:points: pts`;
  }

  protected statusText(status: RedeemStatus): string {
    return status === 'sent'
      ? $localize`:@@offline.redemptions.sent:Sent`
      : $localize`:@@offline.redemptions.pending:Pending`;
  }
}
