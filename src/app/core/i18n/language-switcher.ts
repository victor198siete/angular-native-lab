import { InjectionToken, LOCALE_ID, Service, inject, signal } from '@angular/core';
import { SOURCE_LANGUAGE, chooseLanguage } from './language.ts';

/**
 * The two native steps of a language switch. Angular caches template messages for the lifetime of
 * the JavaScript runtime, so a new LOCALE_ID needs the choice stored and the JavaScript restarted.
 * The real implementation (expo-secure-store + reloadAppAsync) is provided by provideLocalization();
 * this default does nothing, which keeps components testable in Node.
 */
export interface LanguageRestart {
  save(code: string): Promise<void>;
  reload(reason: string): Promise<void>;
}

export const LANGUAGE_RESTART = new InjectionToken<LanguageRestart>('LANGUAGE_RESTART', {
  providedIn: 'root',
  factory: () => ({ save: async () => {}, reload: async () => {} }),
});

export interface LanguageOption {
  readonly code: string;
  /** In its own language, so a user can find their way back from a language they cannot read. */
  readonly name: string;
}

export const LANGUAGES: readonly LanguageOption[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
];

@Service()
export class LanguageSwitcher {
  private readonly restart = inject(LANGUAGE_RESTART);

  /** 'en' or 'es', whatever regional tag LOCALE_ID carries ('en-US' in tests). */
  readonly current = chooseLanguage([inject(LOCALE_ID).slice(0, 2)]);
  /** The other language: with two of them, the toggle offers this one. */
  readonly next: LanguageOption =
    LANGUAGES.find((language) => language.code !== this.current) ??
    LANGUAGES.find((language) => language.code === SOURCE_LANGUAGE)!;
  readonly switching = signal(false);

  async switchTo(code: string): Promise<void> {
    if (code === this.current || this.switching()) return;
    this.switching.set(true);
    // Awaited before the reload, so the next start reads the new choice.
    await this.restart.save(code);
    await this.restart.reload('The language changed');
  }
}
