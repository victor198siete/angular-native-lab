import { Component, LOCALE_ID, computed, inject, input } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { NgIcon } from '@ng-native/icons';
import { Theme } from '../../../../core/theme.ts';
import type { Movement } from '../../core/models/index.ts';
import { ICON_COLOR, provideUiIcons } from '../icons.ts';
import { dayLabel, formatPoints, formatSigned, timeLabel } from '../format.ts';

/**
 * One points movement: earn in green with +, redeem in red with a real minus sign. Fixed 68pt
 * height so it can live in a virtual list; the caller gives it its background.
 */
@Component({
  selector: 'app-movement-row',
  imports: [NgIcon, Text, View],
  providers: [provideUiIcons()],
  template: `
    <view
      class="h-[68px] flex-row items-center gap-3 px-5"
      accessible
      accessibilityRole="text"
      [accessibilityLabel]="label()"
    >
      <view
        class="h-11 w-11 items-center justify-center rounded-full bg-raised dark:bg-raised-dk"
        [accessibilityElementsHidden]="true"
        importantForAccessibility="no-hide-descendants"
      >
        <ng-icon [name]="earn() ? 'lucideArrowDownLeft' : 'lucideGift'" [size]="20" [color]="iconColor()" />
      </view>
      <view class="flex-1 gap-0.5">
        <text class="text-title font-semibold text-ink dark:text-ink-dk" [numberOfLines]="1">{{ title() }}</text>
        <text class="text-caption text-ink2 dark:text-ink2-dk" [numberOfLines]="1">{{ caption() }}</text>
      </view>
      <text
        class="text-title font-black tabular-nums"
        [class]="earn() ? 'text-gain dark:text-gain-dk' : 'text-loss dark:text-loss-dk'"
      >{{ amount() }}</text>
    </view>
  `,
})
export class MovementRow {
  readonly movement = input.required<Movement>();
  /** Prefix the time with the day ("Today", "Yesterday", "12 Sep"): for lists that are not grouped. */
  readonly showDay = input(false);

  protected readonly earn = computed(() => this.movement().type === 'earn');
  private readonly theme = inject(Theme);
  private readonly locale = inject(LOCALE_ID);
  protected readonly iconColor = computed(() => {
    const palette = this.earn() ? ICON_COLOR.gain : ICON_COLOR.brand;
    return this.theme.isDark() ? palette.dark : palette.light;
  });
  protected readonly title = computed(() => this.movement().description.replace(/^Canje:\s*/, ''));
  protected readonly amount = computed(() =>
    formatSigned(this.movement().points, this.earn() ? '+' : '−', this.locale),
  );
  private readonly when = computed(() => {
    const m = this.movement();
    const time = timeLabel(m.date, this.locale);
    if (!this.showDay()) return time;
    const day = dayLabel(m.date.slice(0, 10), this.locale);
    return `${day.charAt(0)}${day.slice(1).toLowerCase()} ${time}`;
  });
  protected readonly caption = computed(
    () =>
      `${this.earn() ? $localize`:@@movement.earned:Points earned` : $localize`:@@movement.redeemed:Redemption`} · ${this.when()}`,
  );
  protected readonly label = computed(() => {
    const m = this.movement();
    const points = formatPoints(m.points, this.locale);
    return this.earn()
      ? $localize`:@@movement.earned.a11y:${this.title()}:title:, points earned, plus ${points}:points: points, ${this.when()}:when:`
      : $localize`:@@movement.redeemed.a11y:${this.title()}:title:, redemption, minus ${points}:points: points, ${this.when()}:when:`;
  });
}
