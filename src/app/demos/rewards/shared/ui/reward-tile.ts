import { Component, computed, input } from '@angular/core';
import { View } from '@ng-native/components';
import { NgIcon } from '@ng-native/icons';
import type { RewardCategory, RewardIcon } from '../../core/models/index.ts';
import { REWARD_ICON_NAME, provideRewardIcons } from '../icons.ts';
import { CATEGORY_GRADIENT } from '../tier-style.ts';

/** Square category-coloured tile holding a reward's white icon. Decorative: hidden from screen readers. */
@Component({
  selector: 'app-reward-tile',
  imports: [NgIcon, View],
  providers: [provideRewardIcons()],
  template: `
    <view
      class="items-center justify-center overflow-hidden"
      [class]="gradient()"
      [style]="box()"
      [accessibilityElementsHidden]="true"
      importantForAccessibility="no-hide-descendants"
    >
      <ng-icon [name]="iconName()" [size]="glyph()" color="#ffffff" />
    </view>
  `,
})
export class RewardTile {
  readonly icon = input.required<RewardIcon>();
  readonly category = input.required<RewardCategory>();
  readonly size = input(56);

  protected readonly gradient = computed(() => CATEGORY_GRADIENT[this.category()]);
  protected readonly box = computed(() => ({
    width: this.size(),
    height: this.size(),
    borderRadius: Math.round(this.size() * 0.3),
  }));
  protected readonly iconName = computed(() => REWARD_ICON_NAME[this.icon()]);
  protected readonly glyph = computed(() => Math.round(this.size() * 0.5));
}
