/** What was seen on a device, as data: set by hand from a run on the simulator and the emulator. */
export type Status =
  | { readonly kind: 'verified'; readonly platforms: readonly Platform[] }
  | { readonly kind: 'caveat'; readonly note: string }
  | { readonly kind: 'not-as-described'; readonly note: string }
  | { readonly kind: 'not-checked' };

export type Platform = 'iOS' | 'Android';

/** One line of a release note, turned into a live demo. */
export interface Case {
  /** Also the test id prefix: `whats-new-a10-1`. */
  readonly id: string;
  /** The release-note PR numbers, as written: `#729`. */
  readonly prs: readonly string[];
  readonly title: string;
  /** The release note's claim, in one line. */
  readonly note: string;
  readonly status: Status;
}

/** One ng-native release: the unit the demo grows by. */
export interface Release {
  /** The route parameter: `0.10`. */
  readonly version: string;
  readonly cases: () => readonly Case[];
}
