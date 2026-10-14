import type { Case } from './case.ts';

/**
 * ng-native 0.11.0. Each status is what was seen on the iOS simulator and the Android emulator
 * (Expo Go), never what the note says. A case nobody has run stays `not-checked`.
 */
export const cases011 = (): readonly Case[] => [
  {
    id: 'a11-1',
    prs: ['#776'],
    title: $localize`:@@whatsNew.a11_1.title:DeepLinks.openSettings()`,
    note: $localize`:@@whatsNew.a11_1.note:DeepLinks.openSettings() opens the app's own page in the system settings, where to send a person once a permission is blocked.`,
    status: {
      kind: 'caveat',
      note: 'Android: the button opens Expo Go\'s App info page (permissions, notifications, storage). iOS simulator: it opens the Settings app at its top-level list (Apple Account, General, Accessibility, ...), not a page of Expo Go. The app kept running and came back on both.',
    },
  },
  {
    id: 'a11-2',
    prs: ['#761'],
    title: $localize`:@@whatsNew.a11_2.title:Back to the tab in front while another loads`,
    note: $localize`:@@whatsNew.a11_2.note:Tapping back to the tab in front while a tap on another tab is still loading stays on the tab in front, instead of the other tab opening when it finishes.`,
    status: { kind: 'verified', platforms: ['iOS', 'Android'] },
  },
  {
    id: 'a11-3',
    prs: ['#774'],
    title: $localize`:@@whatsNew.a11_3.title:Tab bar under a route with a parameter`,
    note: $localize`:@@whatsNew.a11_3.note:A tab bar kept as one screen with reuseScreen under org/:org opens a tab in the account in front, not the one it was last on.`,
    status: {
      kind: 'caveat',
      note: 'On iOS and Android the url does go to org 2\'s own first page, /whats-new/tabs/2/library, not to /1/library/x. But the Library tab then drew org 1\'s Album x page and the Library page together, one above the other, and stayed that way.',
    },
  },
];
