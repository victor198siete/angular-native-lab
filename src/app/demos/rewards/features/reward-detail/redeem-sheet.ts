import { Component, computed, input, output } from '@angular/core';
import { Modal, Pressable, Text, View } from '@ng-native/components';
import type { Reward } from '../../core/models/index.ts';
import { formatPoints } from '../../shared/format.ts';
import { RewardTile } from '../../shared/ui/reward-tile.ts';

/** Bottom-sheet confirmation shown in a transparent modal over the detail screen. */
@Component({
  selector: 'app-redeem-sheet',
  imports: [Modal, Pressable, RewardTile, Text, View],
  template: `
    <modal [visible]="visible()" [transparent]="true" animationType="fade" (requestClose)="cancel.emit()">
      <view class="flex-1 justify-end bg-black/70">
        <pressable
          class="flex-1"
          accessibilityRole="button"
          accessibilityLabel="Cerrar"
          (press)="cancel.emit()"
        ></pressable>
        <view class="gap-4 rounded-t-xl bg-surface px-5 pb-10 pt-6 dark:bg-surface-dk">
          <text class="text-h2 font-black text-ink dark:text-ink-dk" accessibilityRole="alert">¿Canjear esta recompensa?</text>
          <view class="flex-row items-center gap-3 rounded-lg bg-raised p-3 dark:bg-raised-dk">
            <app-reward-tile [icon]="reward().icon" [category]="reward().category" [size]="44" />
            <text class="flex-1 text-body font-semibold text-ink dark:text-ink-dk" [numberOfLines]="2">{{ reward().title }}</text>
            <text class="text-body font-black tabular-nums text-loss dark:text-loss-dk">{{ cost() }}</text>
          </view>
          <text class="text-body text-ink2 dark:text-ink2-dk">{{ remaining() }}</text>
          <pressable
            testID="confirm-redeem"
            class="grad-brand h-14 items-center justify-center rounded-lg shadow-cta hover:opacity-80"
            [disabled]="processing()"
            accessibilityRole="button"
            accessibilityLabel="Confirmar canje"
            [accessibilityState]="{ disabled: processing() }"
            (press)="confirm.emit()"
          >
            <text class="text-title font-bold text-white">{{ processing() ? 'Procesando…' : 'Confirmar canje' }}</text>
          </pressable>
          <pressable
            class="h-12 items-center justify-center"
            [disabled]="processing()"
            accessibilityRole="button"
            accessibilityLabel="Cancelar"
            (press)="cancel.emit()"
          >
            <text class="text-body font-semibold text-ink2 dark:text-ink2-dk">Cancelar</text>
          </pressable>
        </view>
      </view>
    </modal>
  `,
})
export class RedeemSheet {
  readonly reward = input.required<Reward>();
  readonly balance = input.required<number>();
  readonly visible = input(false);
  readonly processing = input(false);
  readonly confirm = output<void>();
  readonly cancel = output<void>();

  protected readonly cost = computed(() => `−${formatPoints(this.reward().costPoints)} pts`);
  protected readonly remaining = computed(
    () => `Te quedarán ${formatPoints(Math.max(0, this.balance() - this.reward().costPoints))} pts.`,
  );
}
