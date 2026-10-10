import { Component } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { NativeGesture } from '@ng-native/components/gestures';
import { WorkletStyle, sharedValue, workletStyle } from '@ng-native/components/reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { withSpring } from 'react-native-reanimated';

/**
 * A card that follows the finger and springs back to its place on release. The pan writes two
 * shared values on the UI thread and `workletStyle` turns them into a transform on the same
 * thread, so the card never waits for JavaScript.
 */
@Component({
  selector: 'app-drag-card',
  imports: [NativeGesture, Text, View, WorkletStyle],
  template: `
    <view class="h-40 items-center justify-center rounded-md bg-raised dark:bg-raised-dk">
      <view
        testID="gestures-drag-card"
        class="h-20 w-40 items-center justify-center rounded-md bg-brand shadow-cta"
        accessible
        [accessibilityLabel]="cardLabel"
        [gesture]="pan"
        [workletStyle]="move"
      >
        <text class="text-title font-bold text-white" i18n="@@gestures.drag.card">Drag me</text>
      </view>
    </view>
  `,
})
export class DragCard {
  protected readonly cardLabel = $localize`:@@gestures.drag.a11y:Draggable card`;

  private readonly x = sharedValue(0);
  private readonly y = sharedValue(0);

  protected readonly move = workletStyle([this.x, this.y], (x, y) => {
    'worklet';
    return { transform: [{ translateX: x.value }, { translateY: y.value }] };
  });

  protected readonly pan: ReturnType<typeof Gesture.Pan>;

  constructor() {
    // Gesture callbacks are worklets and must not read `this`: the shared values go through locals.
    const x = this.x;
    const y = this.y;
    this.pan = Gesture.Pan()
      .onUpdate((event) => {
        'worklet';
        x.value = event.translationX;
        y.value = event.translationY;
      })
      .onEnd(() => {
        'worklet';
        x.value = withSpring(0);
        y.value = withSpring(0);
      });
  }
}
