import type { Case } from './case.ts';

/**
 * ng-native 0.7.0. Each status is what was seen on the iOS simulator and the Android emulator
 * (Expo Go), never what the note says. A case nobody has run stays `not-checked`. A7-1 is verified on both: iOS draws the toolbar and hears its presses, Android draws nothing, as the note says.
 */
export const cases07 = (): readonly Case[] => [
  {
    id: 'a7-1',
    prs: ['#658', '#657'],
    title: $localize`:@@whatsNew.a7_1.title:A bottom toolbar on iOS`,
    note: $localize`:@@whatsNew.a7_1.note:native-toolbar with native-toolbar-item buttons (an SF Symbol or a title, and a press output) and a spacer is the screen's bottom toolbar on iOS 18; Android draws nothing.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a7-2',
    prs: ['#647'],
    title: $localize`:@@whatsNew.a7_2.title:endReached on a short list`,
    note: $localize`:@@whatsNew.a7_2.note:A virtual-list fires endReached when its rows are shorter than the viewport, and again when a page is appended while it rests at the end, without waiting for a drag; viewableItemsChanged reports again when the items change.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a7-3',
    prs: ['#645'],
    title: $localize`:@@whatsNew.a7_3.title:A link to a url already on the stack`,
    note: $localize`:@@whatsNew.a7_3.note:A nativeRouterLink to a url that is already on the stack pushes a new screen over it, and Back returns to the page the link was on, where the press popped back to the earlier screen; a link whose extras set replaceUrl replaces the screen.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a7-4',
    prs: ['#641', '#649'],
    title: $localize`:@@whatsNew.a7_4.title:Transitions from the initial value`,
    note: $localize`:@@whatsNew.a7_4.note:A transition of an opacity or a background-color that no rule sets runs from or to the initial value (1 and transparent), also with transition: all; it jumped.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a7-5',
    prs: ['#639', '#638'],
    title: $localize`:@@whatsNew.a7_5.title:A unitless line-height is inherited as the number`,
    note: $localize`:@@whatsNew.a7_5.note:Under a card with font-size 10px and line-height 2, a text with font-size 20px has lines 40 points tall, where it took the card's 20.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a7-6',
    prs: ['#648'],
    title: $localize`:@@whatsNew.a7_6.title:Markdown: wrapped lines and every entity`,
    note: $localize`:@@whatsNew.a7_6.note:markdown no longer breaks a paragraph where its source wrapped a line, decodes every named HTML entity such as &rarr; and &hearts;, and still breaks at two spaces or a backslash.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
];
