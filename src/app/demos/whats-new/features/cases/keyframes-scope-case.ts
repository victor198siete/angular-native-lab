import { Component, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';
import { PulseScale } from './pulse-scale.ts';
import { PulseSlide } from './pulse-slide.ts';

/** Two squares from two components, each with its own `@keyframes pulse`; a button starts both. */
@Component({
  selector: 'app-keyframes-scope-case',
  imports: [PulseScale, PulseSlide, Text, View, WnButton],
  template: `
    <view class="gap-2">
      <view class="h-24 flex-row items-center gap-6">
        <app-pulse-scale [playing]="playing()" />
        <app-pulse-slide [playing]="playing()" />
      </view>
      <app-wn-button testId="whats-new-a9-2-toggle" [label]="playing() ? stopLabel : playLabel" (act)="playing.set(!playing())" />
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a9_2.hint">Blue should grow to 1.6 times its size; green should slide right by 80 points. Both are named pulse.</text>
    </view>
  `,
})
export class KeyframesScopeCase {
  protected readonly playing = signal(false);
  protected readonly playLabel = $localize`:@@whatsNew.a9_2.play:Play both`;
  protected readonly stopLabel = $localize`:@@whatsNew.a9_2.stop:Reset`;
}
