import type { Case } from './case.ts';

/**
 * ng-native 0.8.0. Each status is what was seen on the iOS simulator and the Android emulator
 * (Expo Go), never what the note says. A case nobody has run stays `not-checked`.
 */
export const cases08 = (): readonly Case[] => [
  {
    id: 'a8-1',
    prs: ['#682'],
    title: $localize`:@@whatsNew.a8_1.title:Permission.ensure() checks again after Settings`,
    note: $localize`:@@whatsNew.a8_1.note:A refused permission that is turned on in Settings works on the next ensure(), and blocked() changes by itself when the app comes back, with no dialog and no restart.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a8-2',
    prs: ['#672', '#676'],
    title: $localize`:@@whatsNew.a8_2.title:Transitions that survive Block JS`,
    note: $localize`:@@whatsNew.a8_2.note:A CSS transition of opacity, a transform or a size is played by native, so it keeps moving while JavaScript is busy; two boxes resized in one commit are eased from JavaScript.`,
    status: {
      kind: 'not-as-described',
      note: 'On iOS and Android the opacity and transform tile kept moving through the 3 s block, in steps every 0.5 s. The width and height tile, the only box resized in its commit, did not: it stayed at its starting width for the whole block and jumped to where it should be when the block ended. The same happened with the block started in the same press and 100 ms later. The pair tile (the documented exception) was not run. Transitions were 10 s linear.',
    },
  },
  {
    id: 'a8-3',
    prs: ['#670'],
    title: $localize`:@@whatsNew.a8_3.title:Padding, margin and radius transitions`,
    note: $localize`:@@whatsNew.a8_3.note:A transition eases a padding, a margin or a border-radius that no rule sets from or to 0, where it jumped.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a8-4',
    prs: ['#664'],
    title: $localize`:@@whatsNew.a8_4.title:A gradient held by a custom property`,
    note: $localize`:@@whatsNew.a8_4.note:background: var(--x) draws a linear-gradient that a custom property set on the element holds; background-color: var(--x) is a colour or nothing.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a8-5',
    prs: ['#668'],
    title: $localize`:@@whatsNew.a8_5.title:Icon size in px and rem`,
    note: $localize`:@@whatsNew.a8_5.note:An icon's size is read as 18px or 1.5rem; one that cannot be read is left the size of the text around it.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a8-6',
    prs: ['#675'],
    title: $localize`:@@whatsNew.a8_6.title:not-dark: in dark mode`,
    note: $localize`:@@whatsNew.a8_6.note:not-dark: with the class-based dark variant no longer applies in dark mode.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
];
