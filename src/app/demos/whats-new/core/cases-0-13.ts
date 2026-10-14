import type { Case } from './case.ts';

/**
 * ng-native 0.13.0. Each status is what was seen on the iOS simulator and the Android emulator
 * (Expo Go), never what the note says. A case nobody has run stays `not-checked`. a13-1 to a13-7
 * are the seven lines of #785 (`NgIcon`); a13-8 is #783.
 */
export const cases013 = (): readonly Case[] => [
  {
    id: 'a13-1',
    prs: ['#785'],
    title: $localize`:@@whatsNew.a13_1.title:Icons with mask, clipPath and use`,
    note: $localize`:@@whatsNew.a13_1.note:NgIcon draws mask, clipPath and use: a duotone icon is not a solid square, a flag keeps its emblem and stays inside its edge.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a13-2',
    prs: ['#785'],
    title: $localize`:@@whatsNew.a13_2.title:Icon color from a token`,
    note: $localize`:@@whatsNew.a13_2.note:color="var(--accent)" resolves against the tokens in scope, where it was sent to native as the text var(--accent).`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a13-3',
    prs: ['#785'],
    title: $localize`:@@whatsNew.a13_3.title:provideNgIconsConfig`,
    note: $localize`:@@whatsNew.a13_3.note:provideNgIconsConfig({ size, color, strokeWidth }) sets the default of each; an icon's own input still wins.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a13-4',
    prs: ['#785'],
    title: $localize`:@@whatsNew.a13_4.title:provideNgIconLoader with caching`,
    note: $localize`:@@whatsNew.a13_4.note:provideNgIconLoader is asked for a name no provideIcons has, and can answer with a string, a promise or an observable; withCaching() asks it once per name.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a13-5',
    prs: ['#785'],
    title: $localize`:@@whatsNew.a13_5.title:aria-label on an icon`,
    note: $localize`:@@whatsNew.a13_5.note:A static aria-label labels the icon for a screen reader, as accessibilityLabel does.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a13-6',
    prs: ['#785'],
    title: $localize`:@@whatsNew.a13_6.title:--ng-icon__size`,
    note: $localize`:@@whatsNew.a13_6.note:With no size, an icon takes --ng-icon__size when something around it sets it.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a13-7',
    prs: ['#785'],
    title: $localize`:@@whatsNew.a13_7.title:stroke-dasharray none and opacity 50%`,
    note: $localize`:@@whatsNew.a13_7.note:stroke-dasharray="none" draws a solid line, and an opacity written as a percentage, opacity="50%", is read as a fraction.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a13-8',
    prs: ['#783'],
    title: $localize`:@@whatsNew.a13_8.title:preventNativeDismiss on a page from another tab`,
    note: $localize`:@@whatsNew.a13_8.note:A page presented from another tab refuses Android's Back button while it sets preventNativeDismiss, and hears nativeDismissCancelled.`,
    status: { kind: 'verified', platforms: ['Android'] },
  },
];
