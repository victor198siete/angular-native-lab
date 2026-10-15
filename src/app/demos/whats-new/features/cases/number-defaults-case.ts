import { Component, computed, signal } from '@angular/core';
import { Pressable, Text, View, VirtualList, VirtualListRow } from '@ng-native/components';

/**
 * Number inputs bound to `undefined` keep their default. `[delayLongPress]` unset waits the usual
 * 500 ms (readout: time from pressIn to longPress), and a `<virtual-list>` with `[rowGap]` and
 * `[overscan]` unset still draws its rows.
 */
@Component({
  selector: 'app-number-defaults-case',
  imports: [Pressable, Text, View, VirtualList, VirtualListRow],
  template: `
    <view class="gap-2">
      <pressable
        testID="whats-new-a14-11-hold"
        nativeID="whats-new-a14-11-hold"
        class="hold"
        accessibilityRole="button"
        [accessibilityLabel]="holdLabel"
        [delayLongPress]="delay()"
        (pressIn)="downAt.set(now())"
        (longPress)="held.set(now() - downAt())"
      >
        <text class="text-body font-bold text-white">{{ holdLabel }}</text>
      </pressable>
      <view class="list">
        <virtual-list #list testID="whats-new-a14-11-list" class="flex-1" [items]="rows" [itemHeight]="24" [rowGap]="gap()" [overscan]="gap()">
          @for (row of list.window(); track row.slot) {
            <view [virtualListRow]="row"><text class="text-body text-ink dark:text-ink-dk">{{ row.item }}</text></view>
          }
        </virtual-list>
      </view>
      <text testID="whats-new-a14-11-rows" class="text-body font-semibold text-ink dark:text-ink-dk">{{ rowsReadout(list.window().length) }}</text>
      <text testID="whats-new-a14-11-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a14_11.hint">Hold the button: the long press should be heard after about 500 ms. The three rows under the button should be drawn.</text>
    </view>
  `,
  styles: `
    .hold {
      height: 56px;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      background-color: crimson;
    }
    .list {
      height: 80px;
    }
  `,
})
export class NumberDefaultsCase {
  protected readonly delay = signal<number | undefined>(undefined);
  protected readonly gap = signal<number | undefined>(undefined);
  protected readonly rows = ['one', 'two', 'three'];
  protected readonly downAt = signal(0);
  protected readonly held = signal<number | null>(null);
  protected readonly holdLabel = $localize`:@@whatsNew.a14_11.hold:Hold me`;
  protected readonly now = () => Date.now();

  protected readonly rowsReadout = (count: number) => $localize`:@@whatsNew.a14_11.rows:Rows drawn: ${count}:count:`;

  protected readonly readout = computed(() => {
    const held = this.held();
    return held === null
      ? $localize`:@@whatsNew.a14_11.waiting:Long press not heard yet`
      : $localize`:@@whatsNew.a14_11.heard:Long press heard after ${Math.round(held / 100) * 100}:ms: ms`;
  });
}
