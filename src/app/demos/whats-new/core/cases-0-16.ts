import type { Case } from './case.ts';

/**
 * ng-native 0.16.0. Each status is what was seen on the iOS simulator and the Android emulator
 * (Expo Go), never what the note says. A case nobody has run stays `not-checked`.
 */
export const cases016 = (): readonly Case[] => [
  {
    id: 'a16-1',
    prs: ['#922', '#906'],
    title: $localize`:@@whatsNew.a16_1.title:A markdown picture at its own size`,
    note: $localize`:@@whatsNew.a16_1.note:A markdown image is drawn at its own size once it loads, as a browser draws it, and is narrowed to the document's width, keeping its shape, only when it is wider; a small icon keeps its size.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
];
