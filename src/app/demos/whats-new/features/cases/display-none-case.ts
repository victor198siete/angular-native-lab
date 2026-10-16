import { Component, computed, signal } from '@angular/core';
import { ScrollView, Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

/**
 * Two boxes, each a scroll view of 30 numbered rows. The left one is hidden with `display: none`
 * (no native view while hidden, so its scroll offset is lost), the right one the documented way to
 * keep a view out of sight (`position: absolute; opacity: 0; pointer-events: none`). Scroll both to
 * row 11, hide, show: the left one starts at row 1 again and its `(layout)` has fired a second time
 * (the view was made again); the right one is still at row 11 and laid out once.
 */
@Component({
  selector: 'app-display-none-case',
  imports: [ScrollView, Text, View, WnButton],
  template: `
    <view class="gap-2">
      <view class="flex-row gap-3">
        <view class="gap-1 flex-1">
          <text class="text-caption font-semibold text-ink dark:text-ink-dk" i18n="@@whatsNew.a6_1.noneTitle">display: none</text>
          <view class="slot">
            <scroll-view #left="scrollView" testID="whats-new-a6-1-left" class="box" [class.gone]="hidden()" (layout)="lefts.update((n) => n + 1)">
              @for (row of rows; track row) {
                <text class="row">{{ rowLabel(row) }}</text>
              }
            </scroll-view>
          </view>
          <app-wn-button testId="whats-new-a6-1-scroll" [label]="scrollLabel" (act)="scrollBoth(left, right)" />
        </view>
        <view class="gap-1 flex-1">
          <text class="text-caption font-semibold text-ink dark:text-ink-dk" i18n="@@whatsNew.a6_1.opacityTitle">opacity: 0, out of the flow</text>
          <view class="slot">
            <scroll-view #right="scrollView" testID="whats-new-a6-1-right" class="box" [class.away]="hidden()" (layout)="rights.update((n) => n + 1)">
              @for (row of rows; track row) {
                <text class="row">{{ rowLabel(row) }}</text>
              }
            </scroll-view>
          </view>
        </view>
      </view>
      <app-wn-button testId="whats-new-a6-1-hide" [label]="hidden() ? showLabel : hideLabel" (act)="hidden.set(!hidden())" />
      <text testID="whats-new-a6-1-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a6_1.hint">Scroll both boxes to row 11, press Hide, then Show. Expected: the left box is back at row 1 and was laid out twice; the right box still shows row 11 and was laid out once.</text>
    </view>
  `,
  styles: `
    .slot {
      height: 120px;
    }
    .box {
      height: 120px;
      border-radius: 8px;
      background-color: #ece8dc;
    }
    .row {
      height: 30px;
      padding-left: 10px;
      font-size: 14px;
      line-height: 30px;
      color: #12131a;
    }
    .gone {
      display: none;
    }
    .away {
      position: absolute;
      left: 0;
      right: 0;
      opacity: 0;
      pointer-events: none;
    }
  `,
})
export class DisplayNoneCase {
  protected readonly rows = Array.from({ length: 30 }, (_, i) => i + 1);
  protected readonly hidden = signal(false);
  protected readonly lefts = signal(0);
  protected readonly rights = signal(0);
  protected readonly scrollLabel = $localize`:@@whatsNew.a6_1.scroll:Scroll both to row 11`;
  protected readonly hideLabel = $localize`:@@whatsNew.a6_1.hide:Hide both`;
  protected readonly showLabel = $localize`:@@whatsNew.a6_1.show:Show both`;
  protected readonly rowLabel = (n: number) => $localize`:@@whatsNew.a6_1.row:Row ${n}:n:`;
  protected readonly readout = computed(() => {
    const left = this.lefts();
    const right = this.rights();
    return $localize`:@@whatsNew.a6_1.readout:Laid out: display none ${left}:left: times / opacity ${right}:right: times`;
  });

  protected scrollBoth(left: ScrollView, right: ScrollView): void {
    left.scrollTo({ y: 300, animated: false });
    right.scrollTo({ y: 300, animated: false });
  }
}
