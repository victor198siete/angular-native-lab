import { Component, input, output } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { NativeGesture } from '@ng-native/components/gestures';
import { WorkletStyle, sharedValue, workletStyle } from '@ng-native/components/reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type { MockRow } from '../../../lists/core/mock-rows.ts';

/** How far left (in points) a release must be to delete the row. */
export const DELETE_THRESHOLD = 110;
/** Where a deleted row slides to before it is removed: past any phone's width. */
const EXIT_X = -520;

/**
 * A row that slides left under the finger, with "Delete" showing behind it. Past the threshold it
 * slides out and asks its parent to remove it; short of it, it springs back. The pan only claims a
 * drag to the left (`activeOffsetX`), so a drag to the right, or a vertical one, fails it and the
 * list around it scrolls as usual.
 */
@Component({
  selector: 'app-swipe-row',
  imports: [NativeGesture, Text, View, WorkletStyle],
  template: `
    <view class="h-16 justify-center overflow-hidden border-b border-line dark:border-line-dk">
      <view class="absolute inset-0 items-end justify-center bg-loss px-5 dark:bg-loss-dk">
        <text class="text-body font-bold text-white dark:text-canvas-dk" i18n="@@gestures.swipe.delete">Delete</text>
      </view>
      <view
        class="h-16 flex-row items-center gap-3 bg-surface px-4 dark:bg-surface-dk"
        [testID]="'gestures-row-' + row().id"
        accessible
        [accessibilityLabel]="row().name + ', ' + row().line"
        [accessibilityActions]="actions"
        (accessibilityAction)="onAccessibilityAction($event.nativeEvent.actionName)"
        [gesture]="swipe"
        [workletStyle]="slide"
      >
        <view class="h-10 w-10 items-center justify-center rounded-full bg-raised dark:bg-raised-dk">
          <text class="text-caption font-bold tabular-nums text-ink2 dark:text-ink2-dk">{{ row().id + 1 }}</text>
        </view>
        <view class="flex-1 gap-0.5">
          <text class="text-title font-semibold text-ink dark:text-ink-dk" [numberOfLines]="1">{{ row().name }}</text>
          <text class="text-caption text-ink2 dark:text-ink2-dk" [numberOfLines]="1">{{ row().line }}</text>
        </view>
      </view>
    </view>
  `,
})
export class SwipeRow {
  readonly row = input.required<MockRow>();
  readonly removed = output<number>();

  protected readonly actions = [{ name: 'delete', label: $localize`:@@gestures.swipe.delete.a11y:Delete row` }];

  private readonly x = sharedValue(0);

  protected readonly slide = workletStyle([this.x], (x) => {
    'worklet';
    return { transform: [{ translateX: x.value }] };
  });

  protected readonly swipe: ReturnType<typeof Gesture.Pan>;

  constructor() {
    // Worklets must not read `this`: the shared value goes through a local, and the JavaScript
    // side (a plain function) is handed to `scheduleOnRN` from the end of the slide-out.
    const x = this.x;
    const remove = (): void => this.removed.emit(this.row().id);

    this.swipe = Gesture.Pan()
      .activeOffsetX(-12)
      .failOffsetX(12)
      .failOffsetY([-10, 10])
      .onUpdate((event) => {
        'worklet';
        x.value = Math.min(0, event.translationX);
      })
      .onEnd((event) => {
        'worklet';
        if (event.translationX < -DELETE_THRESHOLD) {
          x.value = withTiming(EXIT_X, { duration: 160 }, (finished) => {
            'worklet';
            if (finished) scheduleOnRN(remove);
          });
        } else {
          x.value = withSpring(0);
        }
      });
  }

  /** The swipe has no keyboard or screen-reader equivalent of its own: this is it. */
  protected onAccessibilityAction(name: string): void {
    if (name === 'delete') this.removed.emit(this.row().id);
  }
}
