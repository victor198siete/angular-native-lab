import { Component, inject, input } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { NativeNavigation } from '@ng-native/router';
import { WnButton } from '../shared/action-button.ts';

/**
 * The card of a tab case: the steps to take in the tabs lab, and a button that opens it. The lab is
 * a tab bar of its own (`features/tabs-lab/`), pushed over this screen, so the Rewards tabs are
 * not touched. `steps` is the case's own text; `caseId` builds the test id.
 */
@Component({
  selector: 'app-tabs-lab-case',
  imports: [Text, View, WnButton],
  template: `
    <view class="gap-2">
      <text class="text-body text-ink dark:text-ink-dk">{{ steps() }}</text>
      <app-wn-button [testId]="'whats-new-' + caseId() + '-open'" [label]="openLabel" (act)="open()" />
      <text class="text-caption text-ink2 dark:text-ink2-dk">{{ expected() }}</text>
    </view>
  `,
})
export class TabsLabCase {
  readonly caseId = input.required<string>();
  readonly steps = input.required<string>();
  readonly expected = input.required<string>();

  private readonly nav = inject(NativeNavigation);
  protected readonly openLabel = $localize`:@@whatsNew.tabsLab.open:Open the tabs lab`;

  protected open(): void {
    void this.nav.push('/whats-new/tabs/1/home');
  }
}
