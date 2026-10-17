import type { Case } from './case.ts';

/**
 * ng-native 0.15.0. Each status is what was seen on the iOS simulator and the Android emulator
 * (Expo Go), never what the note says. A case nobody has run stays `not-checked`.
 */
export const cases015 = (): readonly Case[] => [
  {
    id: 'a15-1',
    prs: ['#866'],
    title: $localize`:@@whatsNew.a15_1.title:Colours made of tokens`,
    note: $localize`:@@whatsNew.a15_1.note:A bound colour made of tokens, color-mix(in srgb, var(--brand), white 20%) or a relative colour such as color(from var(--brand) srgb r g b), is worked out where it is used; it reached native as text and painted nothing.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a15-2',
    prs: ['#903', '#858'],
    title: $localize`:@@whatsNew.a15_2.title:Text input events on Android`,
    note: $localize`:@@whatsNew.a15_2.note:(scroll) and (keyPress) on a text-input, and (contentSizeChange) on a multiline one, fire on Android, where the native field was never asked to send them.`,
    status: { kind: 'verified', platforms: ['Android'] },
  },
  {
    id: 'a15-3',
    prs: ['#865', '#850'],
    title: $localize`:@@whatsNew.a15_3.title:A markdown table that scrolls sideways`,
    note: $localize`:@@whatsNew.a15_3.note:A markdown table wider than the page scrolls sideways, each column as wide as its widest cell (up to 280pt), instead of squeezing every column into the page.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a15-4',
    prs: ['#867', '#851'],
    title: $localize`:@@whatsNew.a15_4.title:Markdown that streams in`,
    note: $localize`:@@whatsNew.a15_4.note:markdown takes a streaming input for a source that arrives a chunk at a time, holding back what has not closed yet: a code span, emphasis, a link, an image, a table row or a code fence's opening line.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a15-5',
    prs: ['#905'],
    title: $localize`:@@whatsNew.a15_5.title:A base64 picture in markdown`,
    note: $localize`:@@whatsNew.a15_5.note:markdown draws an image written as a base64 data: url of a raster picture, PNG, JPEG, GIF or WebP; an SVG data: url is still its alt text.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a15-6',
    prs: ['#907', '#831'],
    title: $localize`:@@whatsNew.a15_6.title:NavigationBar claims on Android`,
    note: $localize`:@@whatsNew.a15_6.note:NavigationBar in @ng-native/device is a stack of claims on Android's navigation bar: style picks light or dark buttons, hidden hides the bar until a swipe. Expo Go has expo-navigation-bar; on iOS the claims change nothing.`,
    status: { kind: 'verified', platforms: ['Android'] },
  },
  {
    id: 'a15-7',
    prs: ['#863'],
    title: $localize`:@@whatsNew.a15_7.title::has() with an ancestor test in a list`,
    note: $localize`:@@whatsNew.a15_7.note:A :has() whose argument is a list with an ancestor test, such as .card:has(.x:is(.p *, .y)), matches either alternative, as a browser does, instead of needing both.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a15-8',
    prs: ['#880'],
    title: $localize`:@@whatsNew.a15_8.title::host:has() follows a change beneath the host`,
    note: $localize`:@@whatsNew.a15_8.note:A :has() rule in a component's own styles, such as :host:has(.on), now follows a change beneath the host, where it kept what it matched before.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a15-9',
    prs: ['#876'],
    title: $localize`:@@whatsNew.a15_9.title:No transition before the first frame`,
    note: $localize`:@@whatsNew.a15_9.note:A class added to a view before a frame has drawn it no longer starts a transition, as in a browser; Spartan's sheet appeared with a 200 ms fade from transparent. A change made once the view has been drawn eases as before.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a15-10',
    prs: ['#864'],
    title: $localize`:@@whatsNew.a15_10.title:An unreadable SVG paint`,
    note: $localize`:@@whatsNew.a15_10.note:An SVG shape whose fill or stroke contains a colour React Native cannot read, such as a custom property set to a typo, is drawn with no paint of its own instead of stopping the app.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
];
