import { Component, LOCALE_ID, computed, inject, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { mockLanguage } from '../../../rewards/core/mocks/language.ts';
import { buildRows } from '../../../lists/core/mock-rows.ts';
import { ActionButton } from './action-button.ts';
import { SwipeRow } from './swipe-row.ts';

const ROW_COUNT = 8;

/** Eight fictional rows, each swiped left to delete; "Restore rows" refills the signal. */
@Component({
  selector: 'app-swipe-rows',
  imports: [ActionButton, SwipeRow, Text, View],
  template: `
    <view class="overflow-hidden rounded-md border border-line dark:border-line-dk" testID="gestures-rows">
      @for (row of rows(); track row.id) {
        <app-swipe-row [row]="row" (removed)="remove($event)" />
      } @empty {
        <view class="h-16 items-center justify-center bg-surface dark:bg-surface-dk">
          <text testID="gestures-rows-empty" class="text-body text-ink2 dark:text-ink2-dk" i18n="@@gestures.swipe.empty">All rows deleted</text>
        </view>
      }
    </view>
    <text testID="gestures-rows-count" class="text-caption tabular-nums text-ink2 dark:text-ink2-dk">{{ countText() }}</text>
    <app-action-button testId="gestures-restore" [label]="restoreLabel" (act)="restore()" />
  `,
})
export class SwipeRows {
  private readonly language = mockLanguage(inject(LOCALE_ID));

  protected readonly restoreLabel = $localize`:@@gestures.swipe.restore:Restore rows`;
  protected readonly rows = signal(buildRows(ROW_COUNT, this.language));
  protected readonly countText = computed(() => {
    const left = this.rows().length;
    return $localize`:@@gestures.swipe.count:Rows left: ${left}:left: of ${ROW_COUNT}:total:`;
  });

  protected remove(id: number): void {
    this.rows.update((rows) => rows.filter((row) => row.id !== id));
  }

  protected restore(): void {
    this.rows.set(buildRows(ROW_COUNT, this.language));
  }
}
