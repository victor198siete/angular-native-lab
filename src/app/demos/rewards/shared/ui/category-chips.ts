import { Component, input, output } from '@angular/core';
import { Pressable, ScrollView, Text } from '@ng-native/components';
import { REWARD_CATEGORIES, type RewardCategory } from '../../core/models/index.ts';

/** Horizontal filter chips: "Todo" plus one per category. `null` means every category. */
@Component({
  selector: 'app-category-chips',
  imports: [Pressable, ScrollView, Text],
  template: `
    <scroll-view
      [horizontal]="true"
      [showsHorizontalScrollIndicator]="false"
      [contentContainerStyle]="{ gap: 8, paddingHorizontal: 20 }"
    >
      <pressable
        class="min-h-11 items-center justify-center rounded-full border px-4"
        [class]="selected() === null ? 'border-brand bg-brand' : 'border-line bg-surface dark:border-line-dk dark:bg-surface-dk'"
        accessibilityRole="button"
        accessibilityLabel="Mostrar todas las categorías"
        [accessibilityState]="{ selected: selected() === null }"
        (press)="pick.emit(null)"
      >
        <text
          class="text-body font-semibold"
          [class]="selected() === null ? 'text-white' : 'text-ink dark:text-ink-dk'"
        >Todo</text>
      </pressable>
      @for (category of categories; track category) {
        <pressable
          class="min-h-11 items-center justify-center rounded-full border px-4"
          [class]="selected() === category ? 'border-brand bg-brand' : 'border-line bg-surface dark:border-line-dk dark:bg-surface-dk'"
          accessibilityRole="button"
          [accessibilityLabel]="'Filtrar por ' + category"
          [accessibilityState]="{ selected: selected() === category }"
          (press)="pick.emit(category)"
        >
          <text
            class="text-body font-semibold"
            [class]="selected() === category ? 'text-white' : 'text-ink dark:text-ink-dk'"
          >{{ category }}</text>
        </pressable>
      }
    </scroll-view>
  `,
})
export class CategoryChips {
  readonly selected = input<RewardCategory | null>(null);
  readonly pick = output<RewardCategory | null>();
  protected readonly categories = REWARD_CATEGORIES;
}
