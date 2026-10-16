import { Component, LOCALE_ID, computed, inject } from '@angular/core';
import { formatDate } from '@angular/common';
import { Pressable, Text, View } from '@ng-native/components';
import { OfflineStore } from '../../core/offline.store.ts';
import { OfflineCard } from './card.ts';

/** Whether the app is online, how old the data on screen is, and what is waiting to be sent. */
@Component({
  selector: 'app-offline-status',
  imports: [OfflineCard, Pressable, Text, View],
  template: `
    <app-offline-card [title]="title">
      <view class="gap-1">
        <text
          testID="offline-state"
          class="text-title font-bold"
          [class]="store.online() ? 'text-gain dark:text-gain-dk' : 'text-warn dark:text-warn-dk'"
        >{{ stateText() }}</text>
        <text testID="offline-synced" class="text-body text-ink2 dark:text-ink2-dk">{{ syncedText() }}</text>
        @if (store.online() && store.hasServerError()) {
          <text testID="offline-error" accessibilityRole="alert" class="text-caption font-semibold text-loss dark:text-loss-dk" i18n="@@offline.status.error">The server failed. Trying again soon.</text>
        }
      </view>
      <view class="flex-row gap-6">
        <text testID="offline-pending" class="text-body font-semibold text-ink dark:text-ink-dk">{{ pendingText() }}</text>
        <text testID="offline-sent" class="text-body font-semibold text-ink dark:text-ink-dk">{{ sentText() }}</text>
      </view>
      <pressable
        testID="offline-sync-now"
        nativeID="offline-sync-now"
        class="min-h-11 items-center justify-center self-start rounded-full border border-line bg-raised px-5 dark:border-line-dk dark:bg-raised-dk"
        accessibilityRole="button"
        [accessibilityLabel]="syncLabel"
        (press)="store.sync()"
      >
        <text class="text-body font-semibold text-ink dark:text-ink-dk">{{ syncLabel }}</text>
      </pressable>
    </app-offline-card>
  `,
})
export class StatusCard {
  protected readonly store = inject(OfflineStore);
  private readonly locale = inject(LOCALE_ID);

  protected readonly title = $localize`:@@offline.status.title:CONNECTION`;
  protected readonly syncLabel = $localize`:@@offline.status.sync:Sync now`;

  protected readonly stateText = computed(() =>
    this.store.online() ? $localize`:@@offline.status.online:Online` : $localize`:@@offline.status.offline:Offline`,
  );

  protected readonly syncedText = computed(() => {
    const at = this.store.lastSync();
    if (at === null) {
      if (this.store.online()) return $localize`:@@offline.status.syncing:Downloading the catalog…`;
      return $localize`:@@offline.status.never:Nothing saved yet. Connect once to download the catalog.`;
    }
    const time = formatDate(at, 'HH:mm:ss', this.locale);
    return this.store.online()
      ? $localize`:@@offline.status.fresh:Last synced at ${time}:time:`
      : $localize`:@@offline.status.cached:Showing saved data from ${time}:time:`;
  });

  protected readonly pendingText = computed(() => {
    const count = this.store.pendingCount();
    return $localize`:@@offline.status.pending:Pending: ${count}:count:`;
  });
  protected readonly sentText = computed(() => {
    const count = this.store.sentCount();
    return $localize`:@@offline.status.sentCount:Sent: ${count}:count:`;
  });
}
