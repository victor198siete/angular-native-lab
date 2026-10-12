import { Component, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

/**
 * `tw-animate-css`: a card that mounts through `@if` with `animate-in fade-in-0 zoom-in-95`. The
 * first plays in 200 ms (the case as written); the second is the same animation slowed to 1.5 s so a
 * screenshot can catch a frame in the middle.
 */
@Component({
  selector: 'app-animate-in-case',
  imports: [Text, View, WnButton],
  template: `
    <view class="gap-2">
      <view class="min-h-32 gap-2">
        @if (shown()) {
          <view testID="whats-new-a9-5-fast" class="animate-in fade-in-0 zoom-in-95 duration-200 rounded-md bg-brand p-4">
            <text class="text-body font-bold text-white">{{ fastLabel }}</text>
          </view>
          <view testID="whats-new-a9-5-slow" class="animate-in fade-in-0 zoom-in-95 duration-1500 rounded-md bg-brand-text p-4">
            <text class="text-body font-bold text-white">{{ slowLabel }}</text>
          </view>
        }
      </view>
      <app-wn-button testId="whats-new-a9-5-toggle" [label]="shown() ? hideLabel : showLabel" (act)="shown.set(!shown())" />
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a9_5.hint">Show the cards: both fade and zoom in; the second takes 1.5 s so a frame can be caught halfway.</text>
    </view>
  `,
})
export class AnimateInCase {
  protected readonly shown = signal(false);
  protected readonly showLabel = $localize`:@@whatsNew.a9_5.show:Show the cards`;
  protected readonly hideLabel = $localize`:@@whatsNew.a9_5.hide:Hide the cards`;
  protected readonly fastLabel = $localize`:@@whatsNew.a9_5.fast:duration-200`;
  protected readonly slowLabel = $localize`:@@whatsNew.a9_5.slow:duration-1500`;
}
