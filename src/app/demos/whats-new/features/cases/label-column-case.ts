import { Component, computed, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';

/**
 * A `<label>` of two `<span>` that is a flex column, once from a rule in the component's sheet and once
 * with Tailwind's `flex flex-col` (the note's own example): stacked, one under the other. The last label
 * is no flex column, so its spans run on as one paragraph. Each sits in a view that shrinks to it and
 * reports its height.
 */
@Component({
  selector: 'app-label-column-case',
  imports: [Text, View],
  template: `
    <view class="gap-2">
      <view testID="whats-new-a14-8-column-box" class="self-start" (layout)="column.set($event.nativeEvent.layout.height)">
        <label testID="whats-new-a14-8-column" class="stack"><span class="name">Name</span><span class="hint">Hint</span></label>
      </view>
      <view testID="whats-new-a14-8-tailwind-box" class="self-start" (layout)="tailwind.set($event.nativeEvent.layout.height)">
        <label testID="whats-new-a14-8-tailwind" class="flex flex-col"><span class="name">Name</span><span class="hint">Hint</span></label>
      </view>
      <view testID="whats-new-a14-8-inline-box" class="self-start" (layout)="inline.set($event.nativeEvent.layout.height)">
        <label testID="whats-new-a14-8-inline"><span class="name">Name </span><span class="hint">Hint</span></label>
      </view>
      <text testID="whats-new-a14-8-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a14_8.hint">Expected: the first two labels (a rule in a sheet, and the Tailwind classes flex flex-col) are two lines tall, Name above Hint; the plain one is one line.</text>
    </view>
  `,
  styles: `
    .stack {
      display: flex;
      flex-direction: column;
    }
    .name {
      font-size: 16px;
      font-weight: 700;
      color: #12131a;
    }
    .hint {
      font-size: 16px;
      color: #6b6b78;
    }
  `,
})
export class LabelColumnCase {
  protected readonly column = signal(0);
  protected readonly tailwind = signal(0);
  protected readonly inline = signal(0);
  protected readonly readout = computed(() => {
    const column = Math.round(this.column());
    const tailwind = Math.round(this.tailwind());
    const inline = Math.round(this.inline());
    return $localize`:@@whatsNew.a14_8.readout:Heights: sheet ${column}:column: / Tailwind ${tailwind}:tailwind: / plain ${inline}:inline:`;
  });
}
