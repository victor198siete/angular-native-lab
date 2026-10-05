import { screen } from '@ng-native/testing';

/**
 * `findBy*` waits 1 s by default, and @ng-native/testing has no global setting for it. A lazy
 * route can take longer than that on a busy machine (the full suite failed locally while CI passed),
 * so every `screen.findBy*` and `findAllBy*` waits 3 s unless the test passes its own options.
 */
const FIND_TIMEOUT = 3000;

const queries = screen as unknown as Record<string, (...args: unknown[]) => unknown>;
for (const name of Object.keys(queries).filter((key) => /^find(All)?By/.test(key))) {
  const find = queries[name];
  // A findBy's third argument is the wait options; it is only read when there are three.
  queries[name] = (...args: unknown[]) =>
    find(...(args.length > 2 ? args : [args[0], args[1], { timeout: FIND_TIMEOUT }]));
}
