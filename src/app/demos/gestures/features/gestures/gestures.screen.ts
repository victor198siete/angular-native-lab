import { Component } from '@angular/core';
import { SafeAreaView, ScrollView, Text, View } from '@ng-native/components';
import { NativeHeader } from '@ng-native/router';
import { AnimateCompare } from './animate-compare.ts';
import { DemoSection } from './demo-section.ts';
import { DragCard } from './drag-card.ts';
import { PinchCard } from './pinch-card.ts';
import { SwipeRows } from './swipe-rows.ts';

/**
 * Gestures from `react-native-gesture-handler` and animations from three places, each driven by
 * signals and shared values: a drag that springs back, a pinch and rotate, rows that swipe away,
 * and the same slide animated four ways.
 */
@Component({
  selector: 'app-gestures-screen',
  imports: [AnimateCompare, DemoSection, DragCard, NativeHeader, PinchCard, SafeAreaView, ScrollView, SwipeRows, Text, View],
  host: { style: 'flex: 1' },
  template: `
    <native-header [title]="title" />
    <safe-area-view [edges]="['bottom']" class="flex-1 bg-canvas dark:bg-canvas-dk">
      <scroll-view testID="gestures-scroll" [contentContainerStyle]="{ padding: 20, gap: 16, paddingBottom: 48 }">
        <view class="gap-1">
          <text testID="gestures-heading" accessibilityRole="header" class="text-h1 font-black text-ink dark:text-ink-dk" i18n="@@gestures.heading">Gestures and animation</text>
          <text class="text-body text-ink2 dark:text-ink2-dk" i18n="@@gestures.intro">Touch the cards. Every gesture below is recognised by the platform and drives a shared value, not a signal.</text>
        </view>

        <app-demo-section testId="gestures-drag-title" [title]="dragTitle" [hint]="dragHint">
          <app-drag-card />
        </app-demo-section>

        <app-demo-section testId="gestures-pinch-title" [title]="pinchTitle" [hint]="pinchHint">
          <app-pinch-card />
        </app-demo-section>

        <app-demo-section testId="gestures-swipe-title" [title]="swipeTitle" [hint]="swipeHint">
          <app-swipe-rows />
        </app-demo-section>

        <app-demo-section testId="gestures-anim-title" [title]="animTitle" [hint]="animHint">
          <app-animate-compare />
        </app-demo-section>
      </scroll-view>
    </safe-area-view>
  `,
})
export class GesturesScreen {
  protected readonly title = $localize`:@@gestures.title:Gestures`;
  protected readonly dragTitle = $localize`:@@gestures.drag.title:Drag`;
  protected readonly dragHint = $localize`:@@gestures.drag.hint:The card follows your finger and springs back when you let go.`;
  protected readonly pinchTitle = $localize`:@@gestures.pinch.title:Pinch and rotate`;
  protected readonly pinchHint = $localize`:@@gestures.pinch.hint:Two fingers scale and turn the card at the same time.`;
  protected readonly swipeTitle = $localize`:@@gestures.swipe.title:Swipe to delete`;
  protected readonly swipeHint = $localize`:@@gestures.swipe.hint:Swipe a row left past the threshold. The list still scrolls.`;
  protected readonly animTitle = $localize`:@@gestures.anim.title:Four ways to animate`;
  protected readonly animHint = $localize`:@@gestures.anim.hint:The same slide, set up four ways. Block the JavaScript thread and see which squares keep moving.`;
}
