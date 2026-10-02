import { DestroyRef, InjectionToken, type Signal, effect, inject, signal, untracked } from '@angular/core';

/** Turn number animations off (tests, reduced motion): the signal jumps straight to the target. */
export const ANIMATE_NUMBERS = new InjectionToken<boolean>('ANIMATE_NUMBERS', {
  providedIn: 'root',
  factory: () => true,
});

export interface AnimatedNumberOptions {
  /** Milliseconds. Default 1200. */
  readonly duration?: number;
  /** Where the first tween starts. Default: the source's own value (no initial animation). */
  readonly from?: number;
}

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

type Frame = (callback: () => void) => unknown;
type CancelFrame = (handle: never) => void;

/**
 * A number that follows `source` with a tween, written to a signal frame by frame.
 * Must be called in an injection context; the running frame is cancelled when it is destroyed.
 * A new target mid-tween restarts from wherever the number currently is.
 */
export function animatedNumber(source: () => number, options: AnimatedNumberOptions = {}): Signal<number> {
  const duration = options.duration ?? 1200;
  const enabled = inject(ANIMATE_NUMBERS);
  const value = signal(options.from ?? untracked(source));
  const g = globalThis as { requestAnimationFrame?: Frame; cancelAnimationFrame?: CancelFrame };
  const schedule: Frame = g.requestAnimationFrame ? (cb) => g.requestAnimationFrame!(cb) : (cb) => setTimeout(cb, 16);
  const cancel = (handle: unknown): void => {
    if (g.requestAnimationFrame && g.cancelAnimationFrame) g.cancelAnimationFrame(handle as never);
    else clearTimeout(handle as ReturnType<typeof setTimeout>);
  };

  let handle: unknown;
  let disposed = false;
  const stop = (): void => {
    if (handle !== undefined) cancel(handle);
    handle = undefined;
  };

  effect(() => {
    const target = source();
    untracked(() => {
      stop();
      const start = value();
      if (!enabled || start === target || disposed) {
        value.set(target);
        return;
      }
      const startedAt = Date.now();
      const step = (): void => {
        if (disposed) return;
        const t = Math.min(1, (Date.now() - startedAt) / duration);
        value.set(t >= 1 ? target : start + (target - start) * easeOutCubic(t));
        handle = t >= 1 ? undefined : schedule(step);
      };
      handle = schedule(step);
    });
  });

  inject(DestroyRef).onDestroy(() => {
    disposed = true;
    stop();
  });

  return value.asReadonly();
}
