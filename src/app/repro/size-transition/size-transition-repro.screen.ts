import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { Pressable, Text, View } from '@ng-native/components';

/**
 * Temporary reproduction (`/--/repro/size-transition?v=<variant>`): which size transition native keeps
 * playing while the JavaScript thread is busy (case A8-2, ng-native 0.13.0). One variant per screen, one
 * button starts it (`?auto=<ms>` presses the same handler after that many ms, to sync a recording).
 *
 * Variants (transition 8 s linear, a 3 s busy loop starts 100 ms after the class changes):
 * - `w`, `h`, `wh`: one box, only that size changes; the screen holds nothing else that changes.
 * - `w2`: `w` with a 2.5 s transition (duration check).
 * - `fade`: control, a transform transition (native-played; known to survive a block).
 * - `pair`: two boxes whose width changes in the same commit, both with a transition.
 * - `pairx`: the documented exception: one box with a width transition, a second box resized in the same commit with none.
 * - `wh-label`: `wh` plus the button label changing length in the commit that starts the transition.
 * - `wh-status`: `wh` plus a status text that changes length in the next commit (as A8-2 does today).
 * - `wh-same`: `wh` plus a status text that changes but keeps its length in that commit.
 * - `wh-after`: `wh` with the status text changing only after the block ends.
 */
@Component({
  selector: 'app-size-transition-repro',
  imports: [View, Text, Pressable],
  host: { style: 'flex: 1' },
  template: `
    <view [style]="{ flex: 1, padding: 16, paddingTop: 80 }">
      <text>variant: {{ variant() }}</text>
      <pressable
        testID="go"
        nativeID="go"
        accessibilityRole="button"
        [style]="{ padding: 12, backgroundColor: '#ddd', borderRadius: 8, marginVertical: 12 }"
        (press)="go()"
      >
        <text>{{ label() }}</text>
      </pressable>
      @if (hasStatus()) {
        <text testID="status">{{ status() }}</text>
      }
      <view [style]="{ height: 160, justifyContent: 'center' }">
        @switch (variant()) {
          @case ('h') {
            <view testID="box" class="bh" [class.on]="on()"></view>
          }
          @case ('fade') {
            <view testID="box" class="bf" [class.on]="on()"></view>
          }
          @case ('w2') {
            <view testID="box" class="bw2" [class.on]="on()"></view>
          }
          @case ('w') {
            <view testID="box" class="bw" [class.on]="on()"></view>
          }
          @case ('pairx') {
            <view testID="box-a" class="pa" [class.on]="on()"></view>
            <view testID="box-b" class="px" [class.on]="on()"></view>
          }
          @case ('pair') {
            <view testID="box-a" class="pa" [class.on]="on()"></view>
            <view testID="box-b" class="pb" [class.on]="on()"></view>
          }
          @default {
            <view testID="box" class="bwh" [class.on]="on()"></view>
          }
        }
      </view>
    </view>
  `,
  styles: `
    .bw {
      width: 60px;
      height: 60px;
      background-color: royalblue;
      transition: width 8000ms linear;
    }
    .bw.on {
      width: 320px;
    }
    .bf {
      width: 60px;
      height: 60px;
      background-color: royalblue;
      transform: translateX(0px);
      transition: transform 8000ms linear;
    }
    .bf.on {
      transform: translateX(260px);
    }
    .bw2 {
      width: 60px;
      height: 60px;
      background-color: royalblue;
      transition: width 2500ms linear;
    }
    .bw2.on {
      width: 320px;
    }
    .bh {
      width: 60px;
      height: 30px;
      background-color: royalblue;
      transition: height 8000ms linear;
    }
    .bh.on {
      height: 150px;
    }
    .bwh {
      width: 60px;
      height: 30px;
      background-color: royalblue;
      transition: width 8000ms linear, height 8000ms linear;
    }
    .bwh.on {
      width: 320px;
      height: 150px;
    }
    .pa,
    .pb {
      width: 60px;
      height: 40px;
      transition: width 8000ms linear;
    }
    .pa {
      background-color: seagreen;
    }
    .pb {
      background-color: darkorange;
    }
    .px {
      width: 60px;
      height: 40px;
      background-color: darkorange;
    }
    .px.on {
      width: 200px;
    }
    .pa.on {
      width: 320px;
    }
    .pb.on {
      width: 200px;
    }
  `,
})
export class SizeTransitionReproScreen {
  readonly v = input<string>();
  readonly auto = input<string>();
  /** `?noblock=1` runs the variant with no busy loop at all: the control. */
  readonly noblock = input<string>();
  /** `?bd=<ms>`: how long after the class change the busy loop starts (default 100). */
  readonly bd = input<string>();

  protected readonly on = signal(false);
  private readonly idle = 'status: idle';
  protected readonly status = signal(this.idle);
  private readonly pressed = signal(false);
  private timers: ReturnType<typeof setTimeout>[] = [];

  protected variant(): string {
    return this.v() ?? 'wh';
  }
  protected hasStatus(): boolean {
    return this.variant().startsWith('wh-') && this.variant() !== 'wh-label';
  }
  protected label(): string {
    if (this.variant() === 'wh-label') return this.on() ? 'Reset the box now' : 'Go';
    return 'Go';
  }

  constructor() {
    const timers = this.timers;
    inject(DestroyRef).onDestroy(() => timers.forEach(clearTimeout));
    timers.push(
      setTimeout(() => {
        const auto = Number(this.auto());
        if (auto > 0) timers.push(setTimeout(() => this.go(), auto));
      }, 1000),
    );
  }

  protected go(): void {
    if (this.pressed()) return;
    this.pressed.set(true);
    const v = this.variant();
    this.on.set(true);
    if (v === 'wh-status' || v === 'wh-same') {
      // A text commit 100 ms in, then the block 300 ms later (A8-2 does the same: status, then 400 ms, then the loop).
      this.timers.push(
        setTimeout(() => {
          this.status.set(v === 'wh-status' ? 'status: blocking the JavaScript thread...' : 'status: IDLE');
          this.timers.push(setTimeout(() => this.block(v), 300));
        }, 100),
      );
    } else {
      this.timers.push(setTimeout(() => this.block(v), Number(this.bd() ?? 100)));
    }
  }

  private block(v: string): void {
    if (this.noblock() === '1') return;
    const end = Date.now() + 3000;
    while (Date.now() < end) {
      // busy on purpose
    }
    if (v === 'wh-after') this.status.set('status: JavaScript was blocked, now longer text');
  }
}
