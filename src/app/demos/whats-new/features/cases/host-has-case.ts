import { Component, input, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

/** The host styles itself from what is inside it: `:host:has(.on)`. */
@Component({
  selector: 'app-host-has-box',
  imports: [Text, View],
  template: `
    <view testID="whats-new-a15-8-inner" class="inner" [class.on]="on()"></view>
    <text class="label">{{ on() ? 'inner has .on' : 'inner has no .on' }}</text>
  `,
  styles: `
    :host {
      flex-direction: row;
      align-items: center;
      gap: 8px;
      padding: 10px;
      border-radius: 8px;
      background-color: #e5e7eb;
    }
    :host:has(.on) {
      background-color: #fcd34d;
    }
    .inner {
      width: 16px;
      height: 16px;
      background-color: #374151;
    }
    .label {
      font-size: 13px;
      color: #12131a;
    }
  `,
})
export class HostHasBox {
  readonly on = input(false);
}

/**
 * #880: a `:has()` rule in a component's own styles, `:host:has(.on)`, follows a change beneath the
 * host. A button adds and removes `.on` on the view inside the host; the host's own background
 * should follow. Before, it kept what it matched when it was first drawn.
 */
@Component({
  selector: 'app-host-has-case',
  imports: [HostHasBox, Text, View, WnButton],
  template: `
    <view class="gap-2">
      <app-host-has-box testID="whats-new-a15-8-host" [on]="on()" />
      <app-wn-button testId="whats-new-a15-8-toggle" [label]="toggleLabel" (act)="on.update((was) => !was)" />
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a15_8.hint">Expected: the box turns amber when the inner square has .on and grey when it does not, each press.</text>
    </view>
  `,
})
export class HostHasCase {
  protected readonly on = signal(false);
  protected readonly toggleLabel = $localize`:@@whatsNew.a15_8.toggle:Toggle .on inside`;
}
