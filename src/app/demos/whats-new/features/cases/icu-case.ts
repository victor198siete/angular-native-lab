import { Component, signal } from '@angular/core';
import { View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';
import { IcuSample } from './icu-sample.ts';

/**
 * The ICU sample mounts on a press, not with the screen: where an ICU expression fails to render,
 * only that press is lost and the other cases of the version stay on screen.
 */
@Component({
  selector: 'app-icu-case',
  imports: [IcuSample, View, WnButton],
  template: `
    <view class="gap-2">
      @if (shown()) {
        <app-icu-sample />
      } @else {
        <app-wn-button testId="whats-new-a9-1-show" [label]="showLabel" (act)="shown.set(true)" />
      }
    </view>
  `,
})
export class IcuCase {
  protected readonly shown = signal(false);
  protected readonly showLabel = $localize`:@@whatsNew.a9_1.show:Render the ICU sample`;
}
