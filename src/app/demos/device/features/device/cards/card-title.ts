import { Component, computed, inject, input } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { NgIcon } from '@ng-native/icons';
import { Theme } from '../../../../../core/theme.ts';
import { ICON_COLOR } from '../../../../rewards/shared/icons.ts';
import { provideDeviceIcons } from '../icons.ts';

/** The icon and heading every card starts with. */
@Component({
  selector: 'app-card-title',
  imports: [NgIcon, Text, View],
  providers: [provideDeviceIcons()],
  template: `
    <view class="flex-row items-center gap-2">
      <ng-icon [name]="icon()" [size]="18" [color]="color()" />
      <text accessibilityRole="header" class="text-over font-bold text-ink2 dark:text-ink2-dk">{{ label() }}</text>
    </view>
  `,
})
export class CardTitle {
  readonly icon = input.required<string>();
  readonly label = input.required<string>();
  private readonly theme = inject(Theme);
  protected readonly color = computed(() => (this.theme.isDark() ? ICON_COLOR.muted.dark : ICON_COLOR.muted.light));
}
