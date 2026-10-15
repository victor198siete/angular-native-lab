import { Component, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

/**
 * #846: the class that brings in the value brings in the `transition` that eases it too. Four lanes,
 * one button. Lanes 1 and 2 fade and slide a box (opacity and transform); lanes 3 and 4 widen a bar
 * (width). In lanes 1 and 3 the base rule has no transition at all; in 2 and 4 it says
 * `transition: none`. The `.go` rule writes `transition` (6 s, linear) and the new value together.
 * Going back uses the base rule, which has no transition, so it jumps. The button label never
 * changes, so nothing else in the commit resizes (a changing label sends a size transition down
 * the JavaScript path).
 */
@Component({
  selector: 'app-transition-arrives-case',
  imports: [Text, View, WnButton],
  template: `
    <view class="gap-3">
      <view class="gap-1">
        <text class="lane-label" i18n="@@whatsNew.a14_2.lane1">1. opacity and transform, no transition before</text>
        <view class="track"><view testID="whats-new-a14-2-fx" class="fx" [class.go]="go()"></view></view>
      </view>
      <view class="gap-1">
        <text class="lane-label" i18n="@@whatsNew.a14_2.lane2">2. opacity and transform, transition: none before</text>
        <view class="track"><view testID="whats-new-a14-2-fx-none" class="fx none" [class.go]="go()"></view></view>
      </view>
      <view class="gap-1">
        <text class="lane-label" i18n="@@whatsNew.a14_2.lane3">3. width, no transition before</text>
        <view class="track"><view testID="whats-new-a14-2-wd" class="wd" [class.go]="go()"></view></view>
      </view>
      <view class="gap-1">
        <text class="lane-label" i18n="@@whatsNew.a14_2.lane4">4. width, transition: none before</text>
        <view class="track"><view testID="whats-new-a14-2-wd-none" class="wd none" [class.go]="go()"></view></view>
      </view>
      <app-wn-button testId="whats-new-a14-2-toggle" [label]="toggleLabel" (act)="go.update((was) => !was)" />
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a14_2.hint">Press once and watch 6 s: each lane should ease to its end. Pressing again goes back with a jump, the base rule has no transition.</text>
    </view>
  `,
  styles: `
    .lane-label {
      font-size: 12px;
      color: #6b6b78;
    }
    .track {
      height: 40px;
      justify-content: center;
      border-radius: 6px;
      background-color: #ece8dc;
    }
    .fx {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      background-color: crimson;
      opacity: 1;
      transform: translateX(0px);
    }
    .fx.go {
      transition: opacity 6000ms linear, transform 6000ms linear;
      opacity: 0.2;
      transform: translateX(220px);
    }
    .wd {
      width: 40px;
      height: 24px;
      border-radius: 6px;
      background-color: royalblue;
    }
    .wd.go {
      transition: width 6000ms linear;
      width: 280px;
    }
    .none {
      transition: none;
    }
    .none.go {
      transition: opacity 6000ms linear, transform 6000ms linear, width 6000ms linear;
    }
  `,
})
export class TransitionArrivesCase {
  protected readonly go = signal(false);
  protected readonly toggleLabel = $localize`:@@whatsNew.a14_2.toggle:Play and rewind`;
}
