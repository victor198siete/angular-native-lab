import type { Case } from './case.ts';

/**
 * ng-native 0.22.0 to 0.22.2. Each status is what was seen on the iOS simulator and the Android
 * emulator (Expo Go), never what the note says. A22-1 was seen on 9 Nov 2026 on 0.22.1, in English and
 * Spanish: the readouts by whats-new-latest.yaml, the drawings by eye on screenshots. A22-2 and A22-3
 * (0.22.2) were seen on 11 Nov 2026 in English, by eye on screenshots before and after the flip button.
 */
export const cases022 = (): readonly Case[] => [
  {
    id: 'a22-1',
    prs: ['#1411', '#1410'],
    title: $localize`:@@whatsNew.a22_1.title:A token read as a value, in 0.22.1`,
    note: $localize`:@@whatsNew.a22_1.note:Arrived in 0.22.1. injectToken('--accent') returns a custom property's resolved value as a signal that follows the colour scheme, and a shape's fill="var(--accent)" resolves against the tokens in scope.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a22-2',
    prs: ['#1398'],
    title: $localize`:@@whatsNew.a22_2.title:A text shadow with no colour, in 0.22.2`,
    note: $localize`:@@whatsNew.a22_2.note:Arrived in 0.22.2. A text-shadow with no colour (or currentColor) is drawn in the text colour and follows it, as box-shadow does since 0.21; before, the declaration was dropped with a warning.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a22-3',
    prs: ['#1395'],
    title: $localize`:@@whatsNew.a22_3.title:A background from a token, in 0.22.2`,
    note: $localize`:@@whatsNew.a22_3.note:Arrived in 0.22.2. background-image: var(--g) draws the gradient the token holds, and currentColor in a background token is the text colour; before, both were dropped.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
];
