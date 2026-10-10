import { Service, signal } from '@angular/core';

/**
 * Counts row components, not estimates. Every `ListRow` calls `mounted()` from its constructor,
 * and the returned function from `DestroyRef.onDestroy`, so `live` is exactly the number of row
 * components Angular has alive right now, whichever renderer made them. A virtual-list recycles a
 * slot's component instead of destroying it, so there `live` is the number of slots, and `created`
 * stays close to it while scrolling; a scroll-view creates one per row.
 */
@Service()
export class MountCounter {
  private readonly liveCount = signal(0);
  private readonly createdCount = signal(0);

  /** Row components alive right now. */
  readonly live = this.liveCount.asReadonly();
  /** Row components constructed since the last `resetCreated`. */
  readonly created = this.createdCount.asReadonly();

  /** A row component was constructed; call the result when it is destroyed. */
  mounted(): () => void {
    this.liveCount.update((n) => n + 1);
    this.createdCount.update((n) => n + 1);
    return () => this.liveCount.update((n) => n - 1);
  }

  resetCreated(): void {
    this.createdCount.set(0);
  }
}
