import { Component, computed, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';

/** Words written straight into a view: `truncate` is one line, `line-clamp-2` two, and a view with neither shows all of it. */
@Component({
  selector: 'app-truncate-view-case',
  imports: [Text, View],
  template: `
    <view class="gap-2">
      <view testID="whats-new-a14-7-truncate" class="copy truncate" (layout)="one.set($event.nativeEvent.layout.height)">{{ sample }}</view>
      <view testID="whats-new-a14-7-clamp" class="copy line-clamp-2" (layout)="two.set($event.nativeEvent.layout.height)">{{ sample }}</view>
      <view testID="whats-new-a14-7-plain" class="copy" (layout)="all.set($event.nativeEvent.layout.height)">{{ sample }}</view>
      <text testID="whats-new-a14-7-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a14_7.hint">Expected: the first cut to one line with an ellipsis, the second to two, the third in full (a few lines taller).</text>
    </view>
  `,
  styles: `
    .copy {
      font-size: 16px;
      color: #12131a;
    }
  `,
})
export class TruncateViewCase {
  protected readonly sample = 'The quick brown fox jumps over the lazy dog while the slow green turtle waits for the bus and a very long sentence goes on and on.';
  protected readonly one = signal(0);
  protected readonly two = signal(0);
  protected readonly all = signal(0);
  protected readonly readout = computed(() => {
    const one = Math.round(this.one());
    const two = Math.round(this.two());
    const all = Math.round(this.all());
    return $localize`:@@whatsNew.a14_7.readout:Heights: ${one}:one: / ${two}:two: / ${all}:all:`;
  });
}
