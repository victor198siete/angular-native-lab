import { Component, computed, input } from '@angular/core';
import { Text, View } from '@ng-native/components';
import type { Case } from '../../core/case.ts';
import { StatusBadge } from './status-badge.ts';

/** The card every case sits in: title and PRs, what the note says, the live demo, the badge. */
@Component({
  selector: 'app-case-card',
  imports: [StatusBadge, Text, View],
  template: `
    <view [testID]="'whats-new-' + item().id" class="gap-3 rounded-lg bg-surface p-4 shadow-card dark:bg-surface-dk dark:shadow-card-dk">
      <view class="gap-1">
        <text [testID]="'whats-new-' + item().id + '-title'" accessibilityRole="header" class="text-h2 font-bold text-ink dark:text-ink-dk">{{ item().title }}</text>
        <text [testID]="'whats-new-' + item().id + '-prs'" class="text-caption font-semibold text-brand-text dark:text-brand-text-dk">{{ prs() }}</text>
        <text class="text-body text-ink2 dark:text-ink2-dk">
          <text class="font-semibold" i18n="@@whatsNew.noteSays">The note says: </text>{{ item().note }}
        </text>
      </view>
      <view class="gap-3">
        <ng-content />
      </view>
      <app-status-badge [status]="item().status" [testId]="'whats-new-' + item().id + '-status'" />
    </view>
  `,
})
export class CaseCard {
  readonly item = input.required<Case>();
  protected readonly prs = computed(() => this.item().prs.join(' · '));
}
