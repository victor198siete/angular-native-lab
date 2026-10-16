import { Injectable, signal } from '@angular/core';

/**
 * How many copies of a page are alive at once, by name: a screen on a native stack is kept mounted
 * under the one pushed over it, so the count is how many of that page the stack holds. Root-provided,
 * one count per running app (and per test).
 */
@Injectable({ providedIn: 'root' })
export class ScreenDepth {
  private readonly counts = signal<Readonly<Record<string, number>>>({});

  /** How many copies of the page called `key` are alive. */
  count(key: string): number {
    return this.counts()[key] ?? 0;
  }

  /** A copy of the page was made; the returned function says it is gone. */
  enter(key: string): () => void {
    this.counts.update((counts) => ({ ...counts, [key]: (counts[key] ?? 0) + 1 }));
    return () => this.counts.update((counts) => ({ ...counts, [key]: (counts[key] ?? 1) - 1 }));
  }
}
