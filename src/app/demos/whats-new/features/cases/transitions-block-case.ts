import { Component, DestroyRef, InjectionToken, inject, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

/** How long "Block JS" keeps the JavaScript thread busy. Tests provide a shorter one. */
export const WN_BLOCK_MS = new InjectionToken<number>('WN_BLOCK_MS', { providedIn: 'root', factory: () => 3000 });

/**
 * CSS transitions that native plays, watched through a blocked JavaScript thread. The tile on the
 * left fades and slides (opacity + transform, #672); the one in the middle is the only box whose
 * size changes in its commit (#676); the pair on the right resizes two boxes in one commit, the
 * documented exception that is eased from JavaScript. The transitions last 10 s so they are still
 * under way when the block starts (400 ms after its press) and while it runs (3 s). Nothing moves
 * on arrival: each button starts its own.
 */
@Component({
  selector: 'app-transitions-block-case',
  imports: [Text, View, WnButton],
  template: `
    <view class="gap-3">
      <view class="flex-row flex-wrap gap-3">
        <app-wn-button testId="whats-new-a8-2-play" [label]="on() ? backLabel : playLabel" (act)="on.set(!on())" />
        <app-wn-button testId="whats-new-a8-2-pair" [label]="pair() ? pairBackLabel : pairLabel" (act)="pair.set(!pair())" />
        <app-wn-button testId="whats-new-a8-2-block" [label]="blockLabel" (act)="block()" />
        <app-wn-button testId="whats-new-a8-2-both" [label]="bothLabel" (act)="both()" />
      </view>
      <text testID="whats-new-a8-2-readout" class="text-caption text-ink2 dark:text-ink2-dk">{{ status() }}</text>
      <view class="gap-1">
        <text class="text-caption font-semibold text-ink dark:text-ink-dk" i18n="@@whatsNew.a8_2.fadeTitle">Opacity and transform</text>
        <view class="h-12 justify-center rounded-md bg-raised dark:bg-raised-dk">
          <view testID="whats-new-a8-2-fade" class="fade" [class.on]="on()"></view>
        </view>
      </view>
      <view class="gap-1">
        <text class="text-caption font-semibold text-ink dark:text-ink-dk" i18n="@@whatsNew.a8_2.sizeTitle">Width and height, alone in the commit</text>
        <view class="h-16 justify-center rounded-md bg-raised dark:bg-raised-dk">
          <view testID="whats-new-a8-2-size" class="grow" [class.on]="on()"></view>
        </view>
      </view>
      <view class="gap-1">
        <text class="text-caption font-semibold text-ink dark:text-ink-dk" i18n="@@whatsNew.a8_2.pairTitle">Two boxes resized together (the exception)</text>
        <view class="h-14 justify-center gap-1 rounded-md bg-raised dark:bg-raised-dk">
          <view testID="whats-new-a8-2-pair-a" class="pair-a" [class.on]="pair()"></view>
          <view testID="whats-new-a8-2-pair-b" class="pair-b" [class.on]="pair()"></view>
        </view>
      </view>
    </view>
  `,
  styles: `
    .fade {
      width: 32px;
      height: 32px;
      margin-left: 8px;
      border-radius: 8px;
      background-color: crimson;
      opacity: 1;
      transform: translateX(0px);
      transition: opacity 10000ms linear, transform 10000ms linear;
    }
    .fade.on {
      opacity: 0.2;
      transform: translateX(200px);
    }
    .grow {
      width: 40px;
      height: 24px;
      margin-left: 8px;
      border-radius: 8px;
      background-color: royalblue;
      transition: width 10000ms linear, height 10000ms linear;
    }
    .grow.on {
      width: 240px;
      height: 56px;
    }
    .pair-a,
    .pair-b {
      height: 18px;
      margin-left: 8px;
      border-radius: 6px;
      width: 40px;
      transition: width 10000ms linear;
    }
    .pair-a {
      background-color: seagreen;
    }
    .pair-b {
      background-color: darkorange;
    }
    .pair-a.on {
      width: 240px;
    }
    .pair-b.on {
      width: 140px;
    }
  `,
})
export class TransitionsBlockCase {
  private readonly blockMs = inject(WN_BLOCK_MS);

  protected readonly on = signal(false);
  protected readonly pair = signal(false);

  protected readonly playLabel = $localize`:@@whatsNew.a8_2.play:Animate`;
  protected readonly backLabel = $localize`:@@whatsNew.a8_2.back:Reset`;
  protected readonly pairLabel = $localize`:@@whatsNew.a8_2.pairPlay:Animate the pair`;
  protected readonly pairBackLabel = $localize`:@@whatsNew.a8_2.pairBack:Reset the pair`;
  protected readonly blockLabel = $localize`:@@whatsNew.a8_2.block:Block JS for 3 s`;
  protected readonly bothLabel = $localize`:@@whatsNew.a8_2.both:Animate, then block`;

  private readonly idleText = $localize`:@@whatsNew.a8_2.idle:Press an Animate button, then Block JS, and watch which boxes keep moving.`;
  private readonly blockingText = $localize`:@@whatsNew.a8_2.blocking:Blocking the JavaScript thread...`;
  protected readonly status = signal(this.idleText);

  private blocks = 0;
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  /**
   * Starts the first two tiles and the block in one press, so the block always lands inside the
   * transition. The block waits a moment: its "Blocking" text changes length, and a text that
   * changes length in the commit that starts a size transition is the documented reason native
   * does not play it (the first run of this case, with both in one commit, showed exactly that).
   */
  protected both(): void {
    this.on.set(true);
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
      this.status.set($localize`:@@whatsNew.a8_2.done:JavaScript was blocked. Blocks so far: ${n}:count:`);
    }, 400);
  }
}
