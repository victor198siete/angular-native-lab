import { Component, LOCALE_ID, inject } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { formatPoints, formatSigned } from '../../../rewards/shared/format.ts';
import { OfflineStore } from '../../core/offline.store.ts';
import { OfflineCard } from './card.ts';

/** The cached history of earned and redeemed points. */
@Component({
  selector: 'app-offline-history',
  imports: [OfflineCard, Text, View],
  template: `
    <app-offline-card [title]="title">
      @for (movement of store.movements(); track movement.id) {
        <view class="flex-row items-center gap-3">
          <text class="flex-1 text-body text-ink dark:text-ink-dk">{{ movement.description }}</text>
          <text
            class="text-body font-semibold tabular-nums"
            [class]="movement.type === 'earn' ? 'text-gain dark:text-gain-dk' : 'text-ink dark:text-ink-dk'"
          >{{ signed(movement.type, movement.points) }}</text>
        </view>
      } @empty {
        <text testID="offline-history-empty" class="text-body text-ink2 dark:text-ink2-dk" i18n="@@offline.history.empty">No history saved on this phone.</text>
      }
    </app-offline-card>
  `,
})
export class HistoryCard {
  protected readonly store = inject(OfflineStore);
  private readonly locale = inject(LOCALE_ID);

  protected readonly title = $localize`:@@offline.history.title:HISTORY`;

  protected signed(type: 'earn' | 'redeem', points: number): string {
    return type === 'earn' ? formatSigned(points, '+', this.locale) : formatSigned(points, '−', this.locale);
  }
}
