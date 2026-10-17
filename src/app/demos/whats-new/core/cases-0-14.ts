import type { Case } from './case.ts';

/**
 * ng-native 0.14.0. Each status is what was seen on the iOS simulator and the Android emulator
 * (Expo Go), never what the note says. A case nobody has run stays `not-checked`. A14-3 and A14-10 are claims about Android, so only Android is
 * set (iOS draws the same colours); A14-2 is a caveat: width does not ease.
 */
export const cases014 = (): readonly Case[] => [
  {
    id: 'a14-1',
    prs: ['#786', '#784'],
    title: $localize`:@@whatsNew.a14_1.title:Bound size in em, rem and vw`,
    note: $localize`:@@whatsNew.a14_1.note:[style.width]="'2em'" is measured against the font size in scope and follows it, '2rem' is 32 points, '50vw' follows the viewport, and an ng-icon size in em is drawn at that many em.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a14-2',
    prs: ['#846'],
    title: $localize`:@@whatsNew.a14_2.title:A class brings in the transition and the value`,
    note: $localize`:@@whatsNew.a14_2.note:A class change that brings in a transition together with the value it eases animates from the old value, where out of transition: none or no transition at all it jumped.`,
    status: {
      kind: 'caveat',
      note: 'Measured on 0.15.0 with host-clock capture loops. Opacity and transform (lanes 1 and 2) ease over the 6 s on iOS and Android, from the old value, with no transition before and with transition: none before. Width (lanes 3 and 4): Android eases it, linearly over about 6 s, in both lanes (#902 fixed #883 there); iOS does not, the bar is at its end width in the first capture after the press, 0.5 s apart, in both lanes, the same snap as in 0.13 and 0.14.',
    },
  },
  {
    id: 'a14-3',
    prs: ['#819'],
    title: $localize`:@@whatsNew.a14_3.title:Border colour before its width`,
    note: $localize`:@@whatsNew.a14_3.note:A border given its width or style after its colour is drawn in that colour on Android; a box given one later was drawn with a black border.`,
    status: { kind: 'verified', platforms: ['Android'] },
  },
  {
    id: 'a14-4',
    prs: ['#842'],
    title: $localize`:@@whatsNew.a14_4.title:aspect-ratio across a flex line`,
    note: $localize`:@@whatsNew.a14_4.note:A view with an aspect-ratio that stretches across its flex line is as wide as its column, as in a browser.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a14-5',
    prs: ['#840'],
    title: $localize`:@@whatsNew.a14_5.title:A minimum over a maximum`,
    note: $localize`:@@whatsNew.a14_5.note:A min-height or min-width over a max-height or max-width wins, and so do a box's padding and border over a max.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a14-6',
    prs: ['#841'],
    title: $localize`:@@whatsNew.a14_6.title:Wrapped lines stretch`,
    note: $localize`:@@whatsNew.a14_6.note:The lines of a wrapping flex container that says nothing of align-content stretch across it, so an item that stretches across its line has a size.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a14-7',
    prs: ['#843'],
    title: $localize`:@@whatsNew.a14_7.title:Truncated text written into a view`,
    note: $localize`:@@whatsNew.a14_7.note:A view's truncate or line-clamp-2 around its own words cuts them, as a browser cuts a block's own text.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a14-8',
    prs: ['#844'],
    title: $localize`:@@whatsNew.a14_8.title:A flex-col label of spans`,
    note: $localize`:@@whatsNew.a14_8.note:A label that is a flex column of two spans stacks them one under the other, where they ran on as one line.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a14-9',
    prs: ['#803'],
    title: $localize`:@@whatsNew.a14_9.title:aria-checked="false" as an attribute`,
    note: $localize`:@@whatsNew.a14_9.note:aria-checked written as an attribute reaches native as a boolean; aria-checked="false" was announced as checked.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a14-10',
    prs: ['#820'],
    title: $localize`:@@whatsNew.a14_10.title:CSS system colours on Android`,
    note: $localize`:@@whatsNew.a14_10.note:Text in CanvasText, FieldText, ButtonText and GrayText shows on Android, where it drew nothing.`,
    status: { kind: 'verified', platforms: ['Android'] },
  },
  {
    id: 'a14-11',
    prs: ['#803'],
    title: $localize`:@@whatsNew.a14_11.title:Number inputs bound to undefined`,
    note: $localize`:@@whatsNew.a14_11.note:A number input with a default keeps it when bound to undefined: delayLongPress waits the usual 500 ms, and a virtual-list with rowGap unset lays out.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a14-12',
    prs: ['#803'],
    title: $localize`:@@whatsNew.a14_12.title:CSS in a style attribute`,
    note: $localize`:@@whatsNew.a14_12.note:style="padding: 4px 8px" sets each side, and a unitless line-height in a style is a multiple of the font size, as in a stylesheet.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
];
