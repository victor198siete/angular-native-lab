import { Component } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { NativeGesture } from '@ng-native/components/gestures';
import { WorkletStyle, sharedValue, workletStyle } from '@ng-native/components/reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { withSpring } from 'react-native-reanimated';
import { ActionButton } from './action-button.ts';

/**
 * A card that scales with a pinch and turns with a two-finger rotation, both at once
 * (`Gesture.Simultaneous`). A release keeps the scale and angle reached, so the next gesture
 * starts from there; Reset springs both back.
 */
@Component({
  selector: 'app-pinch-card',
  imports: [ActionButton, NativeGesture, Text, View, WorkletStyle],
  template: `
    <view class="gap-3">
    <view class="h-56 items-center justify-center overflow-hidden rounded-md bg-raised dark:bg-raised-dk">
      <view
        testID="gestures-pinch-card"
        class="h-24 w-40 items-center justify-center rounded-md bg-brand shadow-cta"
        accessible
        [accessibilityLabel]="cardLabel"
        [gesture]="pinchAndRotate"
        [workletStyle]="shape"
      >
        <text class="text-title font-bold text-white" i18n="@@gestures.pinch.card">Pinch and turn</text>
      </view>
    </view>
    <app-action-button testId="gestures-pinch-reset" [label]="resetLabel" (act)="reset()" />
    </view>
  `,
})
export class PinchCard {
  protected readonly cardLabel = $localize`:@@gestures.pinch.a11y:Card to pinch and rotate`;
  protected readonly resetLabel = $localize`:@@gestures.pinch.reset:Reset`;

  private readonly scale = sharedValue(1);
  private readonly savedScale = sharedValue(1);
  private readonly angle = sharedValue(0);
  private readonly savedAngle = sharedValue(0);

  protected readonly shape = workletStyle([this.scale, this.angle], (scale, angle) => {
    'worklet';
    return { transform: [{ scale: scale.value }, { rotate: `${angle.value}rad` }] };
  });

  protected readonly pinchAndRotate: ReturnType<typeof Gesture.Simultaneous>;

  constructor() {
    const scale = this.scale;
    const savedScale = this.savedScale;
    const angle = this.angle;
    const savedAngle = this.savedAngle;

    const pinch = Gesture.Pinch()
      .onUpdate((event) => {
        'worklet';
        scale.value = savedScale.value * event.scale;
      })
      .onEnd(() => {
        'worklet';
        savedScale.value = scale.value;
      });
    const rotation = Gesture.Rotation()
      .onUpdate((event) => {
        'worklet';
        angle.value = savedAngle.value + event.rotation;
      })
      .onEnd(() => {
        'worklet';
        savedAngle.value = angle.value;
      });
    this.pinchAndRotate = Gesture.Simultaneous(pinch, rotation);
  }

  protected reset(): void {
    this.savedScale.value = 1;
    this.savedAngle.value = 0;
    this.scale.value = withSpring(1);
    this.angle.value = withSpring(0);
  }
}
