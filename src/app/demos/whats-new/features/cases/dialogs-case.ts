import { Component, computed, inject, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { Choice, Dialogs } from '@ng-native/device';
import { WnButton } from '../shared/action-button.ts';

/** `undefined` until the sheet has been asked; then the index chosen, or `null` for a dismissal. */
type Answer = undefined | number | null;

/** A three-choice sheet whose last choice is the cancel style, and what `choose()` resolved. */
@Component({
  selector: 'app-dialogs-case',
  imports: [Text, View, WnButton],
  template: `
    <view class="gap-2">
      <app-wn-button testId="whats-new-a10-1-open" [label]="openLabel" (act)="open()" />
      <text testID="whats-new-a10-1-result" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a10_1.hint">Pick Save or Discard to see an index. Pick Cancel to see null; on iOS, tapping outside the sheet does too.</text>
    </view>
  `,
})
export class DialogsCase {
  private readonly dialogs = inject(Dialogs);

  protected readonly openLabel = $localize`:@@whatsNew.a10_1.open:Open the sheet`;
  private readonly answer = signal<Answer>(undefined);
  protected readonly readout = computed(() => {
    const answer = this.answer();
    if (answer === undefined) return $localize`:@@whatsNew.a10_1.idle:Not asked yet`;
    return $localize`:@@whatsNew.a10_1.result:Resolved: ${answer === null ? 'null' : String(answer)}:value:`;
  });

  protected async open(): Promise<void> {
    const choices: Choice[] = [
      { label: $localize`:@@whatsNew.a10_1.save:Save` },
      { label: $localize`:@@whatsNew.a10_1.discard:Discard`, style: 'destructive' },
      { label: $localize`:@@whatsNew.a10_1.cancel:Cancel`, style: 'cancel' },
    ];
    this.answer.set(await this.dialogs.choose($localize`:@@whatsNew.a10_1.sheet:Your draft`, choices));
  }
}
