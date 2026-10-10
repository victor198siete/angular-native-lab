import { Component, DestroyRef, InjectionToken, inject, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { Animated, AnimatedStyle, Easing } from '@ng-native/components/animations';
import { WorkletStyle, sharedValue, workletStyle } from '@ng-native/components/reanimated';
import { cancelAnimation, withRepeat, withTiming } from 'react-native-reanimated';
import { ActionButton } from './action-button.ts';
import { MotionTile } from './motion-tile.ts';

/** How long "Block JS" keeps the JavaScript thread busy. Tests provide a shorter one. */
export const BLOCK_MS = new InjectionToken<number>('BLOCK_MS', { providedIn: 'root', factory: () => 3000 });

const TRAVEL = 84;
const DURATION = 900;

/**
 * The same back-and-forth slide, set up four ways. Three are meant to run without the JavaScript
 * thread (CSS keyframes, the Animated native driver, a Reanimated worklet) and one on purpose runs
 * on it. "Block JS" keeps that thread busy so you can see which squares keep moving; nothing here
 * is timed or measured.
 */
@Component({
  selector: 'app-animate-compare',
  imports: [ActionButton, AnimatedStyle, MotionTile, Text, View, WorkletStyle],
  template: `
    <view class="gap-3">
      <view class="flex-row gap-3">
        <app-motion-tile testId="gestures-tile-css" [title]="cssTitle" [how]="cssHow">
          <view class="css-square h-6 w-6 rounded-md bg-brand"></view>
        </app-motion-tile>
        <app-motion-tile testId="gestures-tile-native" [title]="nativeTitle" [how]="nativeHow">
          <view class="h-6 w-6 rounded-md bg-brand" [animatedStyle]="nativeStyle"></view>
        </app-motion-tile>
      </view>
      <view class="flex-row gap-3">
        <app-motion-tile testId="gestures-tile-worklet" [title]="workletTitle" [how]="workletHow">
          <view class="h-6 w-6 rounded-md bg-brand" [workletStyle]="workletSlide"></view>
        </app-motion-tile>
        <app-motion-tile testId="gestures-tile-js" [title]="jsTitle" [how]="jsHow">
          <view class="h-6 w-6 rounded-md bg-glow" [animatedStyle]="jsStyle"></view>
        </app-motion-tile>
      </view>
    </view>
    <app-action-button testId="gestures-block-js" [label]="blockLabel" (act)="block()" />
    <text testID="gestures-block-status" class="text-caption text-ink2 dark:text-ink2-dk">{{ status() }}</text>
  `,
  styles: `
    @keyframes slide {
      from {
        transform: translateX(0px);
      }
      to {
        transform: translateX(84px);
      }
    }
    .css-square {
      animation: slide 900ms ease-in-out infinite alternate;
    }
  `,
})
export class AnimateCompare {
  private readonly blockMs = inject(BLOCK_MS);

  protected readonly cssTitle = $localize`:@@gestures.anim.css.title:CSS keyframes`;
  protected readonly cssHow = $localize`:@@gestures.anim.css.how:@keyframes in the component styles`;
  protected readonly nativeTitle = $localize`:@@gestures.anim.native.title:Animated, native driver`;
  protected readonly nativeHow = $localize`:@@gestures.anim.native.how:AnimatedStyle with useNativeDriver: true`;
  protected readonly workletTitle = $localize`:@@gestures.anim.worklet.title:Worklet`;
  protected readonly workletHow = $localize`:@@gestures.anim.worklet.how:withRepeat on a shared value`;
  protected readonly jsTitle = $localize`:@@gestures.anim.js.title:JavaScript thread`;
  protected readonly jsHow = $localize`:@@gestures.anim.js.how:AnimatedStyle with useNativeDriver: false`;
  protected readonly blockLabel = $localize`:@@gestures.anim.block:Block JS for 3 s`;

  private readonly idleText = $localize`:@@gestures.anim.status.idle:Press the button and watch the four squares.`;
  private readonly blockingText = $localize`:@@gestures.anim.status.blocking:Blocking the JavaScript thread...`;
  protected readonly status = signal(this.idleText);
  private blocks = 0;
  private timer: ReturnType<typeof setTimeout> | undefined;

  // 2. Animated with the native driver.
  private readonly nativeProgress = new Animated.Value(0);
  protected readonly nativeStyle = {
    transform: [{ translateX: this.nativeProgress.interpolate({ inputRange: [0, 1], outputRange: [0, TRAVEL] }) }],
  };

  // 4. Animated, driven from JavaScript on purpose.
  private readonly jsProgress = new Animated.Value(0);
  protected readonly jsStyle = {
    transform: [{ translateX: this.jsProgress.interpolate({ inputRange: [0, 1], outputRange: [0, TRAVEL] }) }],
  };

  // 3. A shared value repeated on the UI runtime.
  private readonly slide = sharedValue(0);
  protected readonly workletSlide = workletStyle([this.slide], (slide) => {
    'worklet';
    return { transform: [{ translateX: slide.value }] };
  });

  constructor() {
    const native = this.pingPong(this.nativeProgress, true);
    const js = this.pingPong(this.jsProgress, false);
    native.start();
    js.start();

    const slide = this.slide;
    slide.value = withRepeat(withTiming(TRAVEL, { duration: DURATION }), -1, true);

    inject(DestroyRef).onDestroy(() => {
      native.stop();
      js.stop();
      cancelAnimation(slide);
      clearTimeout(this.timer);
    });
  }

  private pingPong(value: Animated.Value, useNativeDriver: boolean): Animated.CompositeAnimation {
    const leg = (toValue: number) =>
      Animated.timing(value, { toValue, duration: DURATION, easing: Easing.inOut(Easing.ease), useNativeDriver });
    return Animated.loop(Animated.sequence([leg(1), leg(0)]));
  }

  /** A synchronous busy loop on the JavaScript thread. The short wait lets the "Blocking" text commit first. */
  protected block(): void {
    this.status.set(this.blockingText);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      const end = Date.now() + this.blockMs;
      while (Date.now() < end) {
        // busy on purpose
      }
      this.blocks += 1;
      const n = this.blocks;
      this.status.set($localize`:@@gestures.anim.status.done:JavaScript was blocked. Blocks so far: ${n}:count:`);
    }, 150);
  }
}
