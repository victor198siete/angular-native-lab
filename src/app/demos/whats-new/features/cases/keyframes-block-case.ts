import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';
import { WN_BLOCK_MS } from './transitions-block-case.ts';

/**
 * Two `@keyframes` that native plays, watched through a blocked JavaScript thread, with their own
 * "Block JS" button (the Gestures demo is not touched). The first slides an 80 pt square by
 * `translateX(200%)` of its own size (#629); the second goes from `rotate(180deg) translateX(-100px)`
 * to the element's own `rotate(180deg)`, a list that loses a function (#617). The third tile is the
 * JavaScript one: a counter a timer drives, which must stop for the block. The animations last 10 s
 * so they are still running while the block does (it starts 400 ms after its press).
 */
@Component({
  selector: 'app-keyframes-block-case',
  imports: [Text, View, WnButton],
  template: `
    <view class="gap-3">
      <view class="flex-row flex-wrap gap-3">
        <app-wn-button testId="whats-new-a6-6-play" [label]="on() ? backLabel : playLabel" (act)="toggle()" />
        <app-wn-button testId="whats-new-a6-6-both" [label]="bothLabel" (act)="both()" />
        <app-wn-button testId="whats-new-a6-6-block" [label]="blockLabel" (act)="block()" />
      </view>
      <text testID="whats-new-a6-6-readout" class="text-caption text-ink2 dark:text-ink2-dk">{{ status() }}</text>
      <view class="gap-1">
        <text class="text-caption font-semibold text-ink dark:text-ink-dk" i18n="@@whatsNew.a6_6.percentTitle">translateX(200%) in @keyframes</text>
        <view class="track"><view testID="whats-new-a6-6-percent" class="percent" [class.on]="on()"></view></view>
      </view>
      <view class="gap-1">
        <text class="text-caption font-semibold text-ink dark:text-ink-dk" i18n="@@whatsNew.a6_6.functionTitle">a transform that loses a function</text>
        <view class="track"><view testID="whats-new-a6-6-function" class="fn" [class.on]="on()"></view></view>
      </view>
      <view class="gap-1">
        <text class="text-caption font-semibold text-ink dark:text-ink-dk" i18n="@@whatsNew.a6_6.jsTitle">The JavaScript thread</text>
        <text testID="whats-new-a6-6-ticks" class="text-body font-semibold text-ink dark:text-ink-dk">{{ tickLabel() }}</text>
      </view>
    </view>
  `,
  styles: `
    .track {
      height: 64px;
      justify-content: center;
      border-radius: 6px;
      background-color: #ece8dc;
    }
    .percent {
      width: 80px;
      height: 40px;
      margin-left: 8px;
      border-radius: 8px;
      background-color: crimson;
    }
    .percent.on {
      animation: slide 10s linear 1 forwards;
    }
    .fn {
      width: 56px;
      height: 40px;
      margin-left: 160px;
      border-radius: 8px;
      background-color: royalblue;
      transform: rotate(180deg);
    }
    .fn.on {
      animation: nudge 10s linear 1 forwards;
    }
    @keyframes slide {
      from {
        transform: translateX(0%);
      }
      to {
        transform: translateX(200%);
      }
    }
    @keyframes nudge {
      from {
        transform: rotate(180deg) translateX(-100px);
      }
      to {
        transform: rotate(180deg);
      }
    }
  `,
})
export class KeyframesBlockCase {
  private readonly blockMs = inject(WN_BLOCK_MS);
  protected readonly on = signal(false);
  protected readonly ticks = signal(0);
  protected readonly playLabel = $localize`:@@whatsNew.a6_6.play:Animate`;
  protected readonly backLabel = $localize`:@@whatsNew.a6_6.back:Reset`;
  protected readonly blockLabel = $localize`:@@whatsNew.a6_6.block:Block JS for 3 s`;
  protected readonly bothLabel = $localize`:@@whatsNew.a6_6.both:Animate, then block`;
  protected readonly tickLabel = () => {
    const ticks = this.ticks();
    return $localize`:@@whatsNew.a6_6.ticks:Ticks every 100 ms: ${ticks}:ticks:`;
  };
  private readonly idleText = $localize`:@@whatsNew.a6_6.idle:Press Animate, then Block JS: the two squares keep moving, the counter stops.`;
  private readonly blockingText = $localize`:@@whatsNew.a6_6.blocking:Blocking the JavaScript thread...`;
  protected readonly status = signal(this.idleText);

  private blocks = 0;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private ticker: ReturnType<typeof setInterval> | undefined;
  private tickStop: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.timer);
      this.stopTicks();
    });
  }

  protected toggle(): void {
    if (this.on()) {
      this.on.set(false);
      this.stopTicks();
    } else {
      this.on.set(true);
      this.startTicks();
    }
  }

  /**
   * The counter ticks only while an animation runs (10 s, plus a second): a counter that never
   * stops keeps the screen busy for the tools that read it.
   */
  private startTicks(): void {
    this.stopTicks();
    this.ticks.set(0);
    this.ticker = setInterval(() => this.ticks.update((n) => n + 1), 100);
    this.tickStop = setTimeout(() => this.stopTicks(), 11000);
  }

  private stopTicks(): void {
    clearInterval(this.ticker);
    clearTimeout(this.tickStop);
  }

  /** Starts the squares and, a moment later, the block, so the block always lands inside the animation. */
  protected both(): void {
    this.on.set(true);
    this.startTicks();
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.block(), 100);
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
      this.status.set($localize`:@@whatsNew.a6_6.done:JavaScript was blocked. Blocks so far: ${n}:count:`);
    }, 400);
  }
}
