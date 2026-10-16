import type { Case } from './case.ts';

/**
 * ng-native 0.6.0. Each status is what was seen on the iOS simulator and the Android emulator
 * (Expo Go), never what the note says. A case nobody has run stays `not-checked`. A6-5 and A6-8 are claims about one platform (Android, iOS); both were run on both, and the other platform behaves the same.
 */
export const cases06 = (): readonly Case[] => [
  {
    id: 'a6-1',
    prs: ['#604', '#587'],
    title: $localize`:@@whatsNew.a6_1.title:display: none has no native view`,
    note: $localize`:@@whatsNew.a6_1.note:An element that is display: none has no native view, nor has anything inside it, so what a view holds of its own, such as a scroll offset, is lost; position: absolute with opacity: 0 and pointer-events: none keeps the view.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a6-2',
    prs: ['#509'],
    title: $localize`:@@whatsNew.a6_2.title:A .md file drawn by markdown`,
    note: $localize`:@@whatsNew.a6_2.note:A .md file is a module, import post from './post.md' is { attributes, content, tokens } lexed by marked as the app is bundled, and markdown draws the tokens as native text and views: headings, nested emphasis, lists, tables, code blocks and links.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a6-3',
    prs: ['#609', '#580'],
    title: $localize`:@@whatsNew.a6_3.title:rows on a multiline text-input`,
    note: $localize`:@@whatsNew.a6_3.note:rows on a multiline text-input sizes it: that many lines of its line height, with its padding and border.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a6-4',
    prs: ['#613'],
    title: $localize`:@@whatsNew.a6_4.title:flex-basis that changes after layout`,
    note: $localize`:@@whatsNew.a6_4.note:A flex-basis that changes after a view is first laid out is followed, and a percentage flex-basis follows the box it is a share of.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a6-5',
    prs: ['#589', '#558'],
    title: $localize`:@@whatsNew.a6_5.title:virtual-list with a header and a footer`,
    note: $localize`:@@whatsNew.a6_5.note:A virtual-list with listHeader or listFooter content no longer stops the app on Android with "ScrollView can host only one direct child".`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a6-6',
    prs: ['#629', '#617'],
    title: $localize`:@@whatsNew.a6_6.title:Keyframes that native plays`,
    note: $localize`:@@whatsNew.a6_6.note:A @keyframes animation that moves an element by a percentage of its own size, or whose transform gains or loses a function between frames, is played by native, so it keeps moving while JavaScript is busy.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a6-7',
    prs: ['#591', '#562'],
    title: $localize`:@@whatsNew.a6_7.title:var() with a several-part fallback`,
    note: $localize`:@@whatsNew.a6_7.note:border-radius: var(--r, 50% 50% 50% 0) gives each corner its own radius, margin: var(--gap, 0 24px) takes each side from its part, and transform: var(--t, translateX(...) rotate(...)) takes the list, where they were dropped or discarded.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a6-8',
    prs: ['#574'],
    title: $localize`:@@whatsNew.a6_8.title:A press on an invisible view (iOS)`,
    note: $localize`:@@whatsNew.a6_8.note:A view that is pressed and has opacity: 0 takes the press on iOS, as it does on Android and in a browser.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a6-9',
    prs: ['#559', '#565'],
    title: $localize`:@@whatsNew.a6_9.title:light-dark() and color-mix() with a token`,
    note: $localize`:@@whatsNew.a6_9.note:light-dark() in a Tailwind-preset stylesheet is the two colour schemes it names, and a color-mix() whose share is a token mixes by the token's value.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
];
