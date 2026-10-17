import { Component, signal } from '@angular/core';
import { Text, TextInput, View } from '@ng-native/components';
import type { KeyPressEvent } from '@ng-native/components';

/**
 * #903: `(keyPress)`, `(scroll)` and `(contentSizeChange)` on a multiline `<text-input>`. On
 * Android the native field was never asked to send them; a field that listens now is. The field is
 * sized by a bound `rows` (#901) and starts with seven lines, so it already scrolls.
 */
@Component({
  selector: 'app-text-input-events-case',
  imports: [Text, TextInput, View],
  template: `
    <view class="gap-2">
      <text-input
        testID="whats-new-a15-2-field"
        class="field"
        multiline
        [rows]="3"
        [(value)]="text"
        (keyPress)="pressed($event)"
        (scroll)="scrolls.update((n) => n + 1)"
        (contentSizeChange)="sizes.update((n) => n + 1)"
      />
      <text testID="whats-new-a15-2-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a15_2.hint">Type in the field, scroll its text, add lines. Expected on Android: all three counters move. On iOS keys and scrolls move; the content size is reported when the field itself changes size.</text>
    </view>
  `,
  styles: `
    .field {
      padding: 8px;
      border: 1px solid #999;
      border-radius: 6px;
      font-size: 14px;
      line-height: 20px;
      background-color: white;
      color: #12131a;
    }
  `,
})
export class TextInputEventsCase {
  protected readonly text = signal('one\ntwo\nthree\nfour\nfive\nsix\nseven');
  protected readonly keys = signal(0);
  protected readonly lastKey = signal('-');
  protected readonly scrolls = signal(0);
  protected readonly sizes = signal(0);

  protected readonly readout = () => {
    const keys = this.keys();
    const last = this.lastKey();
    const scrolls = this.scrolls();
    const sizes = this.sizes();
    return $localize`:@@whatsNew.a15_2.readout:Keys ${keys}:keys: (last ${last}:last:) / scrolls ${scrolls}:scrolls: / content size changes ${sizes}:sizes:`;
  };

  protected pressed(event: KeyPressEvent): void {
    this.keys.update((n) => n + 1);
    this.lastKey.set(event.nativeEvent.key);
  }
}
