import { Component, computed, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

/** A bar in a row with `flex-basis: 100%`; a class takes it to 60% after layout, and back. Its `(layout)` width is the evidence. */
@Component({
  selector: 'app-flex-basis-case',
  imports: [Text, View, WnButton],
  template: `
    <view class="gap-2">
      <view testID="whats-new-a6-4-track" class="track" (layout)="track.set($event.nativeEvent.layout.width)">
        <view testID="whats-new-a6-4-bar" class="bar" [class.part]="part()" (layout)="bar.set($event.nativeEvent.layout.width)"></view>
      </view>
      <text testID="whats-new-a6-4-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <app-wn-button testId="whats-new-a6-4-toggle" [label]="toggleLabel" (act)="part.update((was) => !was)" />
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a6_4.hint">Press: the bar goes from 100% to 60% of its track and back. Before, it stayed full width.</text>
    </view>
  `,
  styles: `
    .track {
      flex-direction: row;
      height: 32px;
      border-radius: 8px;
      background-color: #ece8dc;
    }
    .bar {
      flex-basis: 100%;
      border-radius: 8px;
      background-color: royalblue;
    }
    .bar.part {
      flex-basis: 60%;
    }
  `,
})
export class FlexBasisCase {
  protected readonly part = signal(false);
  protected readonly track = signal(0);
  protected readonly bar = signal(0);
  protected readonly toggleLabel = $localize`:@@whatsNew.a6_4.toggle:Bar to 60% and back`;
  protected readonly readout = computed(() => {
    const track = Math.round(this.track());
    const bar = Math.round(this.bar());
    const share = track > 0 ? Math.round((bar / track) * 100) : 0;
    return $localize`:@@whatsNew.a6_4.readout:Bar ${bar}:bar: of ${track}:track: points (${share}:share:%)`;
  });
}
