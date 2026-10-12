import { Component, computed, input } from '@angular/core';
import { Text, View } from '@ng-native/components';
import type { Status } from '../../core/case.ts';

/** The result of a check on a device: verified (with where), caveat, not as described, not checked. */
@Component({
  selector: 'app-status-badge',
  imports: [Text, View],
  template: `
    <view class="gap-1">
      <view class="self-start rounded-full bg-raised px-3 py-1 dark:bg-raised-dk">
        <text [testID]="testId()" class="text-caption font-bold" [class]="ink()">{{ label() }}</text>
      </view>
      @if (detail()) {
        <text class="text-caption text-ink2 dark:text-ink2-dk">{{ detail() }}</text>
      }
    </view>
  `,
})
export class StatusBadge {
  readonly status = input.required<Status>();
  readonly testId = input.required<string>();

  protected readonly label = computed(() => {
    const status = this.status();
    switch (status.kind) {
      case 'verified':
        return $localize`:@@whatsNew.status.verified:Verified` + ' · ' + status.platforms.join(' · ');
      case 'caveat':
        return $localize`:@@whatsNew.status.caveat:Caveat`;
      case 'not-as-described':
        return $localize`:@@whatsNew.status.notAsDescribed:Not as described`;
      case 'not-checked':
        return $localize`:@@whatsNew.status.notChecked:Not checked`;
    }
  });
  protected readonly detail = computed(() => {
    const status = this.status();
    return status.kind === 'caveat' || status.kind === 'not-as-described' ? status.note : '';
  });
  protected readonly ink = computed(() => {
    switch (this.status().kind) {
      case 'verified':
        return 'text-gain dark:text-gain-dk';
      case 'caveat':
        return 'text-warn dark:text-warn-dk';
      case 'not-as-described':
        return 'text-loss dark:text-loss-dk';
      case 'not-checked':
        return 'text-ink2 dark:text-ink2-dk';
    }
  });
}
