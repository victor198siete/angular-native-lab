import { Component, effect, input, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

/**
 * A box whose own effect adds the class that makes it opaque, as Spartan's sheet does. `delay` 0
 * adds it in the first commit's effect; a delay waits that long, by which time a frame has drawn it.
 * The `.box` rule has `opacity: 0` and a 3 s transition, so the class either appears at once or fades.
 */
@Component({
  selector: 'app-first-draw-box',
  template: `<view [testID]="testId()" class="box" [class.shown]="shown()"></view>`,
  imports: [View],
  styles: `
    .box {
      width: 64px;
      height: 64px;
      border-radius: 8px;
      background-color: crimson;
      opacity: 0;
      transition: opacity 3000ms linear;
    }
    .box.shown {
      opacity: 1;
    }
  `,
})
export class FirstDrawBox {
  readonly testId = input.required<string>();
  readonly delay = input(0);
  protected readonly shown = signal(false);

  constructor() {
    effect((onCleanup) => {
      const delay = this.delay();
      if (delay === 0) {
        this.shown.set(true);
        return;
      }
      const timer = setTimeout(() => this.shown.set(true), delay);
      onCleanup(() => clearTimeout(timer));
    });
  }
}

/**
 * #876: a class added to a view before a frame has drawn it no longer starts a transition. The first
 * box adds its class in its own effect, so it is already opaque when mounted. The second adds it
 * 600 ms later, once it has been drawn: that one is the control and fades in over 3 s.
 */
@Component({
  selector: 'app-first-draw-case',
  imports: [FirstDrawBox, Text, View, WnButton],
  template: `
    <view class="gap-2">
      <view class="h-20 flex-row items-center gap-4 rounded-md bg-raised px-3 dark:bg-raised-dk">
        @if (early()) { <app-first-draw-box testId="whats-new-a15-9-early" [delay]="0" /> }
        @if (late()) { <app-first-draw-box testId="whats-new-a15-9-late" [delay]="600" /> }
      </view>
      <view class="flex-row flex-wrap gap-2">
        <app-wn-button testId="whats-new-a15-9-early-button" [label]="earlyLabel" (act)="mountEarly()" />
        <app-wn-button testId="whats-new-a15-9-late-button" [label]="lateLabel" (act)="mountLate()" />
        <app-wn-button testId="whats-new-a15-9-clear" [label]="clearLabel" (act)="clear()" />
      </view>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a15_9.hint">Expected: Mount at once shows a solid square straight away; Mount, class later shows nothing for 600 ms and then fades in over 3 s. Before, both faded.</text>
    </view>
  `,
})
export class FirstDrawCase {
  protected readonly early = signal(false);
  protected readonly late = signal(false);
  protected readonly earlyLabel = $localize`:@@whatsNew.a15_9.early:Mount at once`;
  protected readonly lateLabel = $localize`:@@whatsNew.a15_9.late:Mount, class later`;
  protected readonly clearLabel = $localize`:@@whatsNew.a15_9.clear:Clear`;

  protected mountEarly(): void {
    this.early.set(false);
    queueMicrotask(() => this.early.set(true));
  }

  protected mountLate(): void {
    this.late.set(false);
    queueMicrotask(() => this.late.set(true));
  }

  protected clear(): void {
    this.early.set(false);
    this.late.set(false);
  }
}
