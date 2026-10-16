import { Component } from '@angular/core';
import { SafeAreaView, ScrollView, Text, View } from '@ng-native/components';
import { NativeHeader } from '@ng-native/router';
import { OfflineStore } from '../../core/offline.store.ts';
import { CatalogCard } from './catalog-card.ts';
import { HistoryCard } from './history-card.ts';
import { LabCard } from './lab-card.ts';
import { RedemptionsCard } from './redemptions-card.ts';
import { StatusCard } from './status-card.ts';

/**
 * A catalog and a history that live in SQLite, and redemptions that wait in a queue when there is
 * no connection. The store belongs to this screen: leaving it cancels any retry, and the queue
 * itself stays in the database for the next visit.
 */
@Component({
  selector: 'app-offline-screen',
  imports: [CatalogCard, HistoryCard, LabCard, NativeHeader, RedemptionsCard, SafeAreaView, ScrollView, StatusCard, Text, View],
  providers: [OfflineStore],
  host: { style: 'flex: 1' },
  template: `
    <native-header [title]="title" />
    <safe-area-view [edges]="['bottom']" class="flex-1 bg-canvas dark:bg-canvas-dk">
      <scroll-view [contentContainerStyle]="{ padding: 20, gap: 16, paddingBottom: 48 }">
        <view class="gap-1">
          <text testID="offline-heading" accessibilityRole="header" class="text-h1 font-black text-ink dark:text-ink-dk" i18n="@@offline.heading">Works without a connection</text>
          <text class="text-body text-ink2 dark:text-ink2-dk" i18n="@@offline.intro">The catalog and the history are saved on the phone in SQLite. Redeem with no network and the redemption waits in a queue until the connection returns.</text>
        </view>
        <app-offline-status />
        <app-offline-lab />
        <app-offline-catalog />
        <app-offline-redemptions />
        <app-offline-history />
      </scroll-view>
    </safe-area-view>
  `,
})
export class OfflineScreen {
  protected readonly title = $localize`:@@offline.title:Offline`;
}
