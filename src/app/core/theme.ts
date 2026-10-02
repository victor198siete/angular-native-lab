import { computed, inject, Service, signal } from '@angular/core';
import { ColorScheme, type Scheme } from '@ng-native/device';

/**
 * In-app light/dark switch. `ColorScheme.set` changes the window's appearance, so the CSS
 * (`dark:` follows it through `watchConditions`) and the native chrome (tabs, header, modal)
 * switch together; the choice is kept in a signal because `current()` cannot tell "forced dark"
 * from "system dark".
 */
@Service()
export class Theme {
  private readonly scheme = inject(ColorScheme);
  private readonly choice = signal<Scheme | null>(null);

  readonly isDark = computed(() => (this.choice() ?? this.scheme.current()) === 'dark');

  toggle(): void {
    const next: Scheme = this.isDark() ? 'light' : 'dark';
    this.choice.set(next);
    this.scheme.set(next);
  }
}
