import { Component, Injectable, inject, signal } from '@angular/core';
import { provideNgIconLoader, withCaching } from '@ng-icons/core';
import { NgIcon } from '@ng-native/icons';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

const PIN =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';
const RING =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>';

/** What the loader was asked for, newest last. Provided by the case, so each mount starts empty. */
@Injectable()
export class LoaderLog {
  readonly asked = signal<readonly string[]>([]);

  /** `loaded-pin` answers with a string, `loaded-ring` with a promise. */
  answer(name: string): string | Promise<string> {
    this.asked.update((asked) => [...asked, name]);
    return name === 'loaded-pin' ? PIN : new Promise((resolve) => setTimeout(() => resolve(RING), 200));
  }
}

/**
 * `provideNgIconLoader` answers for a name no `provideIcons` has: a string, or a promise. With
 * `withCaching()` it is asked once per name. Three icons are drawn, two of them with the same name, and
 * the log shows how many times the loader was asked. "Draw again" mounts them a second time: the loader
 * should not be asked again.
 */
@Component({
  selector: 'app-icon-loader-case',
  imports: [NgIcon, Text, View, WnButton],
  providers: [
    LoaderLog,
    provideNgIconLoader((name) => inject(LoaderLog).answer(name), withCaching()),
  ],
  template: `
    <view class="gap-2">
      @if (shown()) {
        <view class="flex-row items-end gap-4">
          <ng-icon testID="whats-new-a13-4-pin-1" name="loaded-pin" [size]="40" color="#be123c" />
          <ng-icon testID="whats-new-a13-4-pin-2" name="loaded-pin" [size]="40" color="#be123c" />
          <ng-icon testID="whats-new-a13-4-ring" name="loaded-ring" [size]="40" color="#0369a1" />
        </view>
      }
      <text testID="whats-new-a13-4-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <view class="flex-row flex-wrap gap-3">
        <app-wn-button testId="whats-new-a13-4-draw" [label]="drawLabel()" (act)="draw()" />
        <app-wn-button testId="whats-new-a13-4-clear" [label]="clearLabel" (act)="clear()" />
      </view>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a13_4.hint">Expected: two pins and a ring appear, the loader is asked twice (one per name, not three times), and drawing again asks nothing more.</text>
    </view>
  `,
})
export class IconLoaderCase {
  private readonly log = inject(LoaderLog);
  protected readonly shown = signal(false);
  private readonly times = signal(0);
  protected readonly clearLabel = $localize`:@@whatsNew.a13_4.clear:Clear`;
  protected readonly drawLabel = () =>
    this.times() > 0 ? $localize`:@@whatsNew.a13_4.drawAgain:Draw again` : $localize`:@@whatsNew.a13_4.draw:Draw`;
  protected readonly readout = () => {
    const asked = this.log.asked();
    const count = asked.length;
    const names = asked.join(', ') || '-';
    return $localize`:@@whatsNew.a13_4.readout:Loader asked ${count}:count: times: ${names}:names:`;
  };

  protected draw(): void {
    this.shown.set(true);
    this.times.update((count) => count + 1);
  }

  protected clear(): void {
    this.shown.set(false);
  }
}
