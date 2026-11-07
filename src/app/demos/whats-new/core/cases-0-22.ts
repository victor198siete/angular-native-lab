import type { Case } from './case.ts';

/**
 * ng-native 0.22.0 and 0.22.1. Each status is what was seen on the iOS simulator and the Android
 * emulator (Expo Go), never what the note says. A case nobody has run stays `not-checked`: none of
 * these has been run on a device yet.
 */
export const cases022 = (): readonly Case[] => [
  {
    id: 'a22-1',
    prs: ['#1411', '#1410'],
    title: $localize`:@@whatsNew.a22_1.title:A token read as a value, in 0.22.1`,
    note: $localize`:@@whatsNew.a22_1.note:Arrived in 0.22.1. injectToken('--accent') returns a custom property's resolved value as a signal that follows the colour scheme, and a shape's fill="var(--accent)" resolves against the tokens in scope.`,
    status: { kind: 'not-checked' },
  },
];
