import { Component, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

/**
 * Three lanes, one button. No rule ever writes `opacity: 1` or a `background-color` on the base
 * box: lane 1 names `opacity` in its transition and a class takes it to 0; lane 2 says
 * `transition: all` and the same class; lane 3 names `background-color` and a class adds one. Each
 * must ease (5 s, linear) from or to the initial value (1, transparent) instead of jumping.
 */
@Component({
  selector: 'app-initial-value-transition-case',
  imports: [Text, View, WnButton],
  template: `
    <view class="gap-3">
      <app-wn-button testId="whats-new-a7-4-toggle" [label]="toggleLabel" (act)="closed.update((was) => !was)" />
      <view class="gap-1">
        <text class="lane-label" i18n="@@whatsNew.a7_4.lane1">1. opacity, named in transition</text>
        <view class="track"><view testID="whats-new-a7-4-opacity" class="box fade" [class.closed]="closed()"></view></view>
      </view>
      <view class="gap-1">
        <text class="lane-label" i18n="@@whatsNew.a7_4.lane2">2. opacity, transition: all</text>
        <view class="track"><view testID="whats-new-a7-4-all" class="box all" [class.closed]="closed()"></view></view>
      </view>
      <view class="gap-1">
        <text class="lane-label" i18n="@@whatsNew.a7_4.lane3">3. background-color a class adds</text>
        <view class="track"><view testID="whats-new-a7-4-color" class="box tint" [class.closed]="closed()"></view></view>
      </view>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a7_4.hint">Press once and watch 5 s: lanes 1 and 2 fade out, lane 3 fills in. Press again and each comes back the same way. A jump is the old behaviour.</text>
    </view>
  `,
  styles: `
    .lane-label {
      font-size: 12px;
      color: #6b6b78;
    }
    .track {
      height: 48px;
      justify-content: center;
      border-radius: 6px;
      background-color: #ece8dc;
    }
    .box {
      width: 120px;
      height: 40px;
      margin-left: 8px;
      border-radius: 6px;
    }
    .fade {
      background-color: crimson;
      transition: opacity 5000ms linear;
    }
    .fade.closed {
      opacity: 0;
    }
    .all {
      background-color: royalblue;
      transition: all 5000ms linear;
    }
    .all.closed {
      opacity: 0;
    }
    .tint {
      transition: background-color 5000ms linear;
    }
    .tint.closed {
      background-color: seagreen;
    }
  `,
})
export class InitialValueTransitionCase {
  protected readonly closed = signal(false);
  protected readonly toggleLabel = $localize`:@@whatsNew.a7_4.toggle:Fade and fill`;
}
