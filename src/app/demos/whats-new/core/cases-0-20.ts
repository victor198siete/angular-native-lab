import type { Case } from './case.ts';

/**
 * ng-native 0.20.0. Each status is what was seen on the iOS simulator and the Android emulator
 * (Expo Go), never what the note says. Seen on 9 Nov 2026 on 0.22.1, in English and Spanish:
 * the readouts by whats-new-latest.yaml, the drawings by eye on screenshots.
 */
export const cases020 = (): readonly Case[] => [
  {
    id: 'a20-1',
    prs: ['#1305'],
    title: $localize`:@@whatsNew.a20_1.title:A row as wide as its content`,
    note: $localize`:@@whatsNew.a20_1.note:A row sized to its content (align-self: flex-start) stays that wide when one of its items grows.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a20-2',
    prs: ['#1355', '#1336', '#1318'],
    title: $localize`:@@whatsNew.a20_2.title:Shorthands in a style attribute and a binding`,
    note: $localize`:@@whatsNew.a20_2.note:border, outline, box-shadow, background, font and text-decoration written in a style attribute or a [style] binding are drawn, as they are from a stylesheet.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a20-3',
    prs: ['#1350', '#1322'],
    title: $localize`:@@whatsNew.a20_3.title:calc() in a bound style`,
    note: $localize`:@@whatsNew.a20_3.note:calc(), min(), max() and clamp() in a style attribute or a [style] binding are worked out as in a stylesheet, and a calc() of px, rem and numbers is committed as points.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a20-4',
    prs: ['#1361'],
    title: $localize`:@@whatsNew.a20_4.title:A page that works only while it is in front`,
    note: $localize`:@@whatsNew.a20_4.note:injectPageFocused() is true while the page is the screen showing, and false while another screen covers it or its tab is not selected; the page stays mounted.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'b20-1',
    prs: ['#1351', '#1331', '#1332'],
    title: $localize`:@@whatsNew.b20_1.title:A canDeactivate guard answers a swipe down`,
    note: $localize`:@@whatsNew.b20_1.note:On iOS, a swipe down on a presented formSheet runs the canDeactivate guard of its route: if the guard refuses, the sheet stays up and the url does not change. On Android, dragging the sheet still dismisses it. Only a device shows this.`,
    status: { kind: 'verified', platforms: ['iOS'] },
  },
];
