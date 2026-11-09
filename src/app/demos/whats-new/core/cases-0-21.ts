import type { Case } from './case.ts';

/**
 * ng-native 0.21.0. Each status is what was seen on the iOS simulator and the Android emulator
 * (Expo Go), never what the note says. Seen on 9 Nov 2026 on 0.22.1, in English and Spanish:
 * the readouts by whats-new-latest.yaml, the drawings by eye on screenshots.
 */
export const cases021 = (): readonly Case[] => [
  {
    id: 'a21-1',
    prs: ['#1376', '#1369'],
    title: $localize`:@@whatsNew.a21_1.title:A font size of zero`,
    note: $localize`:@@whatsNew.a21_1.note:font-size: 0, or a calc() clamped to 0, no longer throws on Android ("FontSize should be a positive value") and is not drawn at the default size on iOS.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a21-2',
    prs: ['#1389'],
    title: $localize`:@@whatsNew.a21_2.title:A shadow with no colour`,
    note: $localize`:@@whatsNew.a21_2.note:A box-shadow written with no colour is drawn in the text colour, and follows it, instead of being dropped with a warning.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
];
