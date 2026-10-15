import { Component, computed, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideMapPin } from '@ng-icons/lucide';
import { NgIcon } from '@ng-native/icons';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

/**
 * A bound size in `em`, `rem` and `vw`, and an `<ng-icon>` sized in `em`. The scope view sets the font
 * size (16, or 24 after the button); `2em` follows it, `2rem` is always 32, `50vw` is half the
 * viewport, and the icon with `size="2em"` is twice the font size. Each box's `(layout)` is the
 * measured size.
 */
@Component({
  selector: 'app-bound-units-case',
  imports: [NgIcon, Text, View, WnButton],
  providers: [provideIcons({ lucideMapPin })],
  template: `
    <view class="gap-2">
      <view testID="whats-new-a14-1-scope" class="gap-2" [style.font-size.px]="fontSize()">
        <view testID="whats-new-a14-1-em" class="bar" [style.width]="'2em'" (layout)="em.set($event.nativeEvent.layout.width)"></view>
        <view testID="whats-new-a14-1-rem" class="bar" [style.width]="'2rem'" (layout)="rem.set($event.nativeEvent.layout.width)"></view>
        <view testID="whats-new-a14-1-vw" class="bar" [style.width]="'50vw'" (layout)="vw.set($event.nativeEvent.layout.width)"></view>
        <view testID="whats-new-a14-1-icon" class="self-start" (layout)="icon.set($event.nativeEvent.layout.width)">
          <ng-icon name="lucideMapPin" size="2em" color="#be123c" />
        </view>
      </view>
      <text testID="whats-new-a14-1-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <app-wn-button testId="whats-new-a14-1-toggle" [label]="toggleLabel" (act)="large.update((was) => !was)" />
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a14_1.hint">Expected at font size 16: 2em is 32, 2rem is 32, 50vw is half the screen width, the icon 32. At 24: 48, 32, the same, 48.</text>
    </view>
  `,
  styles: `
    .bar {
      height: 12px;
      border-radius: 6px;
      background-color: royalblue;
    }
  `,
})
export class BoundUnitsCase {
  protected readonly large = signal(false);
  protected readonly fontSize = computed(() => (this.large() ? 24 : 16));
  protected readonly em = signal(0);
  protected readonly rem = signal(0);
  protected readonly vw = signal(0);
  protected readonly icon = signal(0);
  protected readonly toggleLabel = $localize`:@@whatsNew.a14_1.toggle:Change the font size`;

  protected readonly readout = computed(() => {
    const size = this.fontSize();
    const em = Math.round(this.em());
    const rem = Math.round(this.rem());
    const vw = Math.round(this.vw());
    const icon = Math.round(this.icon());
    return $localize`:@@whatsNew.a14_1.readout:Font ${size}:size: / 2em ${em}:em: / 2rem ${rem}:rem: / 50vw ${vw}:vw: / icon ${icon}:icon:`;
  });
}
