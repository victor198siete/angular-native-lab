import { Directive, input } from '@angular/core';

/**
 * A stand-in for `@ng-native/components/animations` under Vitest. That entry point re-exports
 * `Animated` from React Native, whose source is Flow and which Node cannot parse, and @ng-native/testing
 * has no stand-in for it (it has one for gestures, Reanimated and worklets). Used through
 * `vi.mock('@ng-native/components/animations', () => import('./animations-fake.ts'))`.
 */
class Value {
  constructor(public value: number) {}
  interpolate(): this {
    return this;
  }
}
const animation = { start: () => undefined, stop: () => undefined };
const timing = (_value: Value, config: { useNativeDriver: boolean }) => ({ ...animation, config });

export const Animated = {
  Value,
  timing,
  sequence: (steps: unknown[]) => ({ ...animation, steps }),
  loop: (inner: unknown) => ({ ...animation, inner }),
};
export const Easing = { inOut: (curve: unknown) => curve, ease: 'ease' };

@Directive({ selector: '[animatedStyle]' })
export class AnimatedStyle {
  readonly animatedStyle = input.required<unknown>();
}
