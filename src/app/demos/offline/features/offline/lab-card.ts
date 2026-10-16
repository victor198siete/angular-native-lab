import { Component, inject } from '@angular/core';
import { Dialogs } from '@ng-native/device';
import { Pressable, Switch, Text, View } from '@ng-native/components';
import { Connectivity } from '../../core/connectivity.ts';
import { FakeServer } from '../../core/fake-api.ts';
import { OfflineStore } from '../../core/offline.store.ts';
import { OfflineCard } from './card.ts';

/** Lab controls: force offline, force server errors, and wipe what the phone saved. */
@Component({
  selector: 'app-offline-lab',
  imports: [OfflineCard, Pressable, Switch, Text, View],
  template: `
    <app-offline-card [title]="title">
      <view class="flex-row items-center gap-3">
        <view class="flex-1 gap-0.5">
          <text class="text-body font-semibold text-ink dark:text-ink-dk">{{ simLabel }}</text>
          <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@offline.lab.simHint">Behaves exactly like having no network. A simulator cannot lose its network on its own.</text>
        </view>
        <switch testID="offline-sim" [accessibilityLabel]="simLabel" [checked]="connectivity.simulateOffline()" (checkedChange)="connectivity.simulateOffline.set($event)" />
      </view>
      <view class="flex-row items-center gap-3">
        <view class="flex-1 gap-0.5">
          <text class="text-body font-semibold text-ink dark:text-ink-dk">{{ failLabel }}</text>
          <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@offline.lab.failHint">The fake server answers every request with a 500. Redemptions stay queued and are tried again.</text>
        </view>
        <switch testID="offline-fail" [accessibilityLabel]="failLabel" [checked]="server.failing()" (checkedChange)="server.failing.set($event)" />
      </view>
      <pressable
        testID="offline-clear"
        nativeID="offline-clear"
        class="min-h-11 items-center justify-center self-start rounded-full border border-line bg-raised px-5 dark:border-line-dk dark:bg-raised-dk"
        accessibilityRole="button"
        [accessibilityLabel]="clearLabel"
        (press)="confirmClear()"
      >
        <text class="text-body font-semibold text-loss dark:text-loss-dk">{{ clearLabel }}</text>
      </pressable>
    </app-offline-card>
  `,
})
export class LabCard {
  protected readonly connectivity = inject(Connectivity);
  protected readonly server = inject(FakeServer);
  private readonly store = inject(OfflineStore);
  private readonly dialogs = inject(Dialogs);

  protected readonly title = $localize`:@@offline.lab.title:LAB`;
  protected readonly simLabel = $localize`:@@offline.lab.sim:Simulate offline`;
  protected readonly failLabel = $localize`:@@offline.lab.fail:Server errors (500)`;
  protected readonly clearLabel = $localize`:@@offline.lab.clear:Clear local data`;

  /** Asks first: the saved catalog, history and the queue (including redemptions not yet sent) go. */
  protected async confirmClear(): Promise<void> {
    const agreed = await this.dialogs.confirm($localize`:@@offline.clear.title:Clear local data?`, {
      message: $localize`:@@offline.clear.message:This deletes the saved catalog and history and every redemption on this phone, including those not yet sent.`,
      confirm: $localize`:@@offline.clear.confirm:Clear`,
      cancel: $localize`:@@offline.clear.cancel:Cancel`,
      destructive: true,
    });
    if (agreed) await this.store.clear();
  }
}
