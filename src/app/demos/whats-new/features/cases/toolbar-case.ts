import { Component, computed, signal } from '@angular/core';
import { Text } from '@ng-native/components';
import { NativeToolbar, NativeToolbarItem } from '@ng-native/router';

/**
 * The screen's bottom toolbar: two buttons (an SF Symbol and a title) either side of a fluid
 * spacer. A toolbar belongs to the screen it is written in, wherever in the page that is, and goes
 * when the element does, so this one shows at the bottom of the whole 0.7 screen. iOS 18 and later;
 * Android draws nothing for either element.
 */
@Component({
  selector: 'app-toolbar-case',
  imports: [NativeToolbar, NativeToolbarItem, Text],
  template: `
    <native-toolbar>
      <native-toolbar-item systemImageName="plus" [accessibilityLabel]="plusLabel" (press)="plus.update((n) => n + 1)" />
      <native-toolbar-item type="fluidSpacer" />
      <native-toolbar-item [title]="clearLabel" (press)="clear()" />
    </native-toolbar>
    <text testID="whats-new-a7-1-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
    <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a7_1.hint">Look at the bottom of the screen: a plus button at the left and Clear at the right. Each press is counted here. On Android nothing is drawn.</text>
  `,
})
export class ToolbarCase {
  protected readonly plus = signal(0);
  protected readonly cleared = signal(0);
  protected readonly plusLabel = $localize`:@@whatsNew.a7_1.plus:Add`;
  protected readonly clearLabel = $localize`:@@whatsNew.a7_1.clear:Clear`;
  protected readonly readout = computed(() => {
    const plus = this.plus();
    const cleared = this.cleared();
    return $localize`:@@whatsNew.a7_1.readout:Plus pressed ${plus}:plus: times, Clear ${cleared}:cleared: times`;
  });

  protected clear(): void {
    this.plus.set(0);
    this.cleared.update((n) => n + 1);
  }
}
