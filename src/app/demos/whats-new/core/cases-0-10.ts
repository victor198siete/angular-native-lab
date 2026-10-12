import type { Case } from './case.ts';

/**
 * ng-native 0.10.0. Each status is what was seen on the iOS simulator and the Android emulator
 * (Expo Go), never what the note says. A case nobody has run stays `not-checked`.
 */
export const cases010 = (): readonly Case[] => [
  {
    id: 'a10-1',
    prs: ['#729'],
    title: $localize`:@@whatsNew.a10_1.title:Dialogs.choose() on Cancel`,
    note: $localize`:@@whatsNew.a10_1.note:On iOS, picking Cancel or dismissing the sheet resolves null, as on Android.`,
    status: { kind: 'not-checked' },
  },
  {
    id: 'a10-2',
    prs: ['#715', '#733'],
    title: $localize`:@@whatsNew.a10_2.title:Deep link pushed over the screen`,
    note: $localize`:@@whatsNew.a10_2.note:A link that arrives while the app runs is pushed over the screen showing, and Back returns to it.`,
    status: { kind: 'not-checked' },
  },
  {
    id: 'a10-3',
    prs: ['#754'],
    title: $localize`:@@whatsNew.a10_3.title:ng-deep after a selector`,
    note: $localize`:@@whatsNew.a10_3.note:A rule written as host, then ng-deep, then .inner styles .inner in the components the host holds; with nothing before ng-deep it is still dropped.`,
    status: { kind: 'not-checked' },
  },
  {
    id: 'a10-4',
    prs: ['#707'],
    title: $localize`:@@whatsNew.a10_4.title:dark class on the root view`,
    note: $localize`:@@whatsNew.a10_4.note:dark: applies to the view that has the dark class itself, not only to what is inside it.`,
    status: { kind: 'not-checked' },
  },
  {
    id: 'a10-5',
    prs: ['#752'],
    title: $localize`:@@whatsNew.a10_5.title:Border with no color`,
    note: $localize`:@@whatsNew.a10_5.note:A border with a width and no color is drawn in the text color, not black.`,
    status: { kind: 'not-checked' },
  },
  {
    id: 'a10-6',
    prs: ['#753'],
    title: $localize`:@@whatsNew.a10_6.title:One long word`,
    note: $localize`:@@whatsNew.a10_6.note:A single word is one line cut at the box edge, not wrapped between letters; several words still wrap.`,
    status: { kind: 'not-checked' },
  },
  {
    id: 'a10-7',
    prs: ['#726'],
    title: $localize`:@@whatsNew.a10_7.title:z-index across plain views`,
    note: $localize`:@@whatsNew.a10_7.note:A box with a z-index is drawn over what follows the plain views it sits in.`,
    status: { kind: 'not-checked' },
  },
];
