import type { Case } from './case.ts';

/**
 * ng-native 0.9.0. Each status is what was seen on the iOS simulator and the Android emulator
 * (Expo Go), never what the note says. A case nobody has run stays `not-checked`. #690 is an iOS change: Android was run too (the press counts), but only iOS is claimed.
 */
export const cases09 = (): readonly Case[] => [
  {
    id: 'a9-1',
    prs: ['#687'],
    title: $localize`:@@whatsNew.a9_1.title:ICU plurals, selects and i18n- attributes`,
    note: $localize`:@@whatsNew.a9_1.note:Plurals and selects render on iOS and Android, translated or not, and an i18n- attribute keeps its text.`,
    status: {
      kind: 'not-as-described',
      note: 'Extraction works: localize-extract wrote the plural, the select and the i18n- label with their source text. But in Expo Go in development, on iOS and Android, mounting them throws "ASSERTION ERROR: The provided value must be an instance of a DOM Node but got #anchor", and none of the three is drawn. A release build was not run. Reported as ng-native/ng-native#882.',
    },
  },
  {
    id: 'a9-2',
    prs: ['#694'],
    title: $localize`:@@whatsNew.a9_2.title:Same-named keyframes in two components`,
    note: $localize`:@@whatsNew.a9_2.note:Two components that each define @keyframes of the same name each play their own.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a9-3',
    prs: ['#696', '#697'],
    title: $localize`:@@whatsNew.a9_3.title:Keyframes with var() and em, opening a panel`,
    note: $localize`:@@whatsNew.a9_3.note:A keyframe value can be a var() or an em, so to height var(--panel-height) opens each panel to the height set on it.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a9-4',
    prs: ['#690'],
    title: $localize`:@@whatsNew.a9_4.title:Press on a view faded to opacity 0`,
    note: $localize`:@@whatsNew.a9_4.note:A view that takes a touch and fades to opacity 0 by a transition still hears a press on iOS.`,
    status: { kind: 'verified', platforms: ['iOS'] },
  },
  {
    id: 'a9-5',
    prs: ['#700'],
    title: $localize`:@@whatsNew.a9_5.title:tw-animate-css animate-in`,
    note: $localize`:@@whatsNew.a9_5.note:animate-in fade-in-0 zoom-in-95 duration-200 fades and zooms in over 200 ms where the animation was dropped.`,
    status: {
      kind: 'caveat',
      note: 'Fade and zoom seen on iOS and Android on the 1.5 s card; the 200 ms card is too quick to catch mid-frame. The build warns that blur() in the enter keyframes is not drawn on iOS.',
    },
  },
];
