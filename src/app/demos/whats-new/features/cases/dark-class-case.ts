import { Component, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

/**
 * A root view that carries the `dark` class itself. Its own background is `bg-white dark:bg-zinc-950`:
 * before 0.10 only its children turned dark.
 */
@Component({
  selector: 'app-dark-class-case',
  imports: [Text, View, WnButton],
  template: `
    <view class="gap-2">
      <view testID="whats-new-a10-4-root" class="gap-1 rounded-md border border-line bg-white p-4 dark:bg-zinc-950" [class.dark]="forced()">
        <text class="text-body font-semibold text-zinc-900 dark:text-white">{{ title }}</text>
        <text testID="whats-new-a10-4-readout" class="text-caption text-zinc-500 dark:text-zinc-400">{{ readout() }}</text>
      </view>
      <app-wn-button testId="whats-new-a10-4-toggle" [label]="toggleLabel" (act)="forced.set(!forced())" />
    </view>
  `,
})
export class DarkClassCase {
  protected readonly forced = signal(false);
  protected readonly title = $localize`:@@whatsNew.a10_4.box:The box itself has the class`;
  protected readonly toggleLabel = $localize`:@@whatsNew.a10_4.toggle:Toggle the dark class`;
  protected readonly readout = () =>
    this.forced()
      ? $localize`:@@whatsNew.a10_4.on:dark class: on (the background should be near black)`
      : $localize`:@@whatsNew.a10_4.off:dark class: off (the background should be white)`;
}
