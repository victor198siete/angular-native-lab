# What's new demo: triage of the ng-native release notes 0.6.0 to 0.10.0

Date: 2026-10-11. Versions: 0.6.0, 0.7.0, 0.8.0, 0.9.0, 0.10.0 (the lab is on 0.10.0). Analysis only: no app code was written.
Source: the five release notes, plus the lab's README and `src/` (what is already touched). Nothing below was run on a simulator:
every "expected result" is what the release note claims, and the demo's job is to confirm or contradict it (badge verified / caveat / does not behave as the note says).

Counts per verdict (rows, where an entry with several PRs or a repeated PR may take more than one row; a PICK case can cover two rows, so there are fewer cases than PICK rows):

| Version | Rows | PICK | TEST-ONLY | LIST | SKIP | Cases (A + B) |
|---|---|---|---|---|---|---|
| 0.6.0 | 62 | 18 | 27 | 1 | 16 | 9 + 4 |
| 0.7.0 | 19 | 9 | 8 | 0 | 2 | 6 + 2 |
| 0.8.0 | 17 | 8 | 5 | 2 | 2 | 6 + 1 |
| 0.9.0 | 14 | 8 | 3 | 0 | 3 | 5 + 2 |
| 0.10.0 | 44 | 13 | 17 | 5 | 9 | 7 + 5 |
| Total | 156 | 56 | 60 | 8 | 32 | 33 + 14 |

Legend. Expo Go: `yes` / `dev build` / `browser-only` / `n/o` (not observable at runtime: build, cache, types, performance). Verdict: PICK (live case, tier A = core, tier B = reserve), TEST-ONLY (Vitest test, no screen), LIST (mention as needs dev build / not demoable), SKIP (internal or irrelevant).

Facts about the lab that shape the triage:
- Not installed today: `@expo/ui`, `expo-router`, `marked`, `@ng-native/analog`, `tw-animate-css`, `expo-video`. `@oxc-angular/vite` 0.0.40 (the version #687 needs) is already installed. Anything that needs a new JS package is still "Expo Go yes" if the package is JS-only or already in Expo Go's native binary; the two `@expo/ui` / `expo-router` cases need a 10-minute probe first (see Open questions Q1).
- The lab already has: `dark:` variant and `ColorScheme.set` (Lists segmented, theme), `NativeNavigation.reset()` (Login), Location permission with a `blocked()` state (Device), `<virtual-list>` with footer (Rewards catalog, Lists), CSS `@keyframes` + `AnimatedStyle` + worklet tiles + "Block JS for 3 s" (Gestures), i18n EN/ES with `$localize` (ICU plurals and `i18n-` attributes explicitly avoided), deep links `exp://127.0.0.1:8081/--/<demo>`, 138 Vitest tests.

## Proposed cases

One screen section per version. Within a version, ordered by video value. Tier B = reserve if time allows.

### Top 3 overall

1. **A9-1 ICU plurals and selects (#687, 0.9.0).** The lab's README says "Not tested, avoided by design: ICU plurals and selects, and `i18n-` attributes. The guide documents both as broken." 0.9.0 says they work. Closing that open item, in EN and ES, is the strongest "the note says X, here it is" story the lab has.
2. **A8-1 `Permission.ensure()` re-checks after Settings (#682, 0.8.0).** Toggle Location in iOS Settings while the app is open and watch `blocked()` flip with no dialog and no restart. Lives next to the Device demo's existing blocked state.
3. **A8-2 Transitions and animations survive "Block JS" (#672 + #676, 0.8.0, with #629 + #617 from 0.6.0).** The Gestures screen already has a "Block JS for 3 s" button and a four-ways comparison; the notes say CSS transitions of opacity/transform/size and percent-translate keyframes are now played by native. Same button, new tiles, the squares keep moving. Honourable mentions: A10-1 (`Dialogs.choose` returns `null` on Cancel) and A6-1 (`display: none` removes the view, scroll offset lost).

### 0.6.0

Built in What's new 0.6 (2026-10-15, ng-native 0.14.0 on iOS 27 and the Android emulator): **A6-1 to A6-9, all nine, each with its badge verified on iOS and Android.** B6-1 to B6-4 are not built. A6-2 imports a `.md` through Metro (`marked` was installed for it); A6-6 is built inside What's new with its own Block JS button, the Gestures demo is untouched; A6-3's `rows` still prints a `<text-input> has no prop 'rows'` warning although it sizes the field.

| Id | Entries | Demo sketch | Observable proof |
|---|---|---|---|
| A6-1 | #604 (#587) | A short `<scroll-view>` of 30 lines, scrolled by a button to offset 300 (readout from `(scroll)`), inside a box toggled with `display: none`. Second box hidden the documented way (`position: absolute; opacity: 0; pointer-events: none`). | After hide then show, the display:none box reads offset 0 (view recreated); the opacity-0 box still reads 300. Note says exactly this. |
| A6-2 | #509 (`<markdown>`, `.md` module import; needs `marked`) | One `post.md` imported with `import post from './post.md'` and drawn with `<markdown [tokens]="post.tokens">`: heading, nested emphasis, task list, table, code block in a horizontal scroll, link with `(linkPress)`. | Native text and views on screen (no WebView); pressing the link reports its URL in a readout; `<markdown>` parses nothing at runtime because tokens come from the bundle. |
| A6-3 | #609 (#580) | Three multiline `<text-input>`s with `rows="1"`, `rows="3"`, `rows="5"` and a line-height, each with a `(layout)` height readout. | Heights are about rows x line-height + padding + border (e.g. 3 rows is three lines tall while empty); before it was one line. |
| A6-4 | #613 | A bar bound to `flex-basis: 100%`, a button that sets it to `60%`, then back; readout of the bar's `(layout)` width. | Width goes 100% to 60% of the track and back (before: stayed full width). |
| A6-5 | #589 (#558, the lab's first upstream issue) | `<virtual-list>` with `listHeader` and `listFooter`, on the Android emulator (Expo Go). | Opens and scrolls with no "ScrollView can host only one direct child". Story value: reported from this lab, resolved in 0.6.0. Already verified in README (Android section); this makes it a tile. |
| A6-6 | #629 + #617 (also #618) | New tiles in the Gestures "four ways" comparison: a `@keyframes` slide with `translateX(200%)` and one that gains a transform function; press "Block JS for 3 s". | Both squares keep moving during the block (native-played), while the "JavaScript thread" tile freezes. Caveat risk: percentage translate is worked out after first commit; check it still moves on Android. |
| A6-7 | #591 + #562 | A box with `border-radius: var(--r, 50% 50% 50% 0)` and a box with `margin: var(--gap, 0 24px)`, token unset. | Teardrop shape (three round corners, one square); margin applies 0 vertical / 24 horizontal (layout readout). Before: all corners alike with no warning, no margin. |
| A6-8 | #574 (iOS) | A full-screen `<pressable>` backdrop at `opacity: 0` over a button, with counters for each. | Pressing anywhere increments the backdrop counter and not the button's, on iOS as on Android. |
| A6-9 | #559 + #565 | Two swatches: a custom property written with `light-dark(#fff, #111)` and a `color-mix(in srgb, var(--ink) calc(var(--share) * 100%), transparent)` with a share token, with the lab's existing dark toggle. | Swatch flips with the colour scheme; the mix shows the token's share (e.g. 40% ink). Before: no value / dropped with a warning. |
| B6-1 | #635 (Android) | `:focus { outline: none }` stylesheet on a `<text-input>` on the Android emulator. | Typed text stays visible after focus (before: vanished and stayed gone). |
| B6-2 | #624 + #622 (the Expo Go half) | A panel whose height changes inside `LayoutAnimation.animate()`. | iOS animates; Android in Expo Go lands in one step, exactly as the note says ("Expo Go on Android ... does not animate"). A "caveat" badge by design. The `android.layoutAnimations` plugin option is dev build only. |
| B6-3 | #621 (conditional on Q1) | `<ui-bottom-sheet [(open)] fitToContents>` with the lab's own components inside. | Native SwiftUI sheet on iOS (grabber, system detents), Material sheet on Android; `dismissed` fires. Needs `@expo/ui` present in Expo Go. |
| B6-4 | #590 (iOS 26+) | A slider (a pan on a `touch-action: pan-y` track) inside a pushed native-stack screen. | Dragging from near the left edge moves the slider and does not pop the screen. Needs a second route and an edge-drag via touch path; fiddly to record. |

### 0.7.0

Built in What's new 0.7 (2026-10-15, ng-native 0.14.0 on iOS 27 and the Android emulator): **A7-1 to A7-6, all six, each with its badge verified on iOS and Android.** B7-1 and B7-2 are not built. Two corrections to the sketches below: A7-1 needed no `expo-router` install (Expo Go carries the native half); A7-3 is about a url already **on the stack under the page**, so the demo links from a second page (`whats-new/link-lab`) back to `/whats-new/0.7`, because a link to the url on top does nothing.

| Id | Entries | Demo sketch | Observable proof |
|---|---|---|---|
| A7-1 | #658 (#657), iOS 18+ | `<native-toolbar>` with two `<native-toolbar-item>` buttons (SF Symbol, title), a spacer and a press counter, on a stack screen. Needs `npx expo install expo-router` (native half only). | Buttons appear in the bottom toolbar and `(press)` increments the counter; on Android nothing is drawn (the badge notes it). |
| A7-2 | #647 | `<virtual-list>` with 3 rows (shorter than the viewport) and `(endReached)` that appends a page of 3 until 12, with a call counter. | `endReached` fires with no drag, and again after each append while resting at the end; counter climbs to 4 on its own. `viewableItemsChanged` count also updates when a filter leaves fewer rows. |
| A7-3 | #645 | Page A with a `nativeRouterLink` to its own url (and one with `[extras]="{replaceUrl: true}"`), plus a stack-depth readout. | Link pushes a new screen over the same url (depth +1); Back returns to the page the link was on; the `replaceUrl` link keeps depth. |
| A7-4 | #641 + #649 (and #670 in 0.8.0) | A box with `.closed { opacity: 0 }` and `transition: opacity 1000ms` that never writes `opacity: 1`; a second with `transition: all`; toggle button. | Fades out and back in (mid-fade screenshot at ~500 ms shows half opacity) instead of jumping. |
| A7-5 | #639 + #638 | `.card { font-size: 10px; line-height: 2 }` holding a `font-size: 20px` text of three wrapped lines, next to a copy with `line-height: 20px` fixed; `(layout)` heights. | Unitless 2 inherits as the number: lines 40 pt tall (height about 120) versus 20 pt lines in the fixed copy (about 60). |
| A7-6 | #648 | The A6-2 markdown screen with a paragraph hard-wrapped in source, `&rarr; &eacute; &euro; &hearts;`, and a two-space line break. | Wrapped source line reads as a space; every entity renders as its glyph; the two-space break still breaks. Reuses A6-2. |
| B7-1 | #656 (#652), iOS, conditional on Q1 | `ui-bottom-sheet` with `<ui-toolbar-item><ui-button role="close">`. | The system close button (iOS 26 glass) appears top of the sheet and closes it. Needs `@expo/ui` 57.0.20+ in Expo Go; the note says Expo Go "can" lack the views. |
| B7-2 | #653 + #655 | A card with `group` and a child using Tailwind `group-active:`; hold the press (touch path with a long duration). | The label restyles while pressed and after a second press on a second card; the "whole screen restyle" part is performance and is not visible. |

### 0.8.0

| Id | Entries | Demo sketch | Observable proof |
|---|---|---|---|
| A8-1 | #682 | In the Device Location card: deny, background the app, enable Location for Expo Go in iOS Settings, return. Show `blocked()` and call `ensure()` again. | `blocked()` flips to false by itself on resume and `ensure()` resolves granted with no dialog and no app restart. Before: stayed blocked until restart. |
| A8-2 | #672 + #676 | On the Gestures screen, CSS-transition tiles (opacity+transform tile and a width/height tile) triggered by a button, then "Block JS for 3 s". | Transitions run through the block (native-played); a tile with a size transition plus a second box resized in the same commit is the documented exception and falls back to JS (caveat to show). |
| A8-3 | #670 | `view { transition: padding 600ms }` with `.open { padding: 20px }`, same for `margin` and `border-radius`. | Padding/radius ease in and back out rather than jump (check a mid-transition frame). |
| A8-4 | #664 (+ #728 in 0.10.0) | A track whose background is `var(--x)` where `--x` is set at runtime via `style.setProperty('--x', 'linear-gradient(90deg, red 0%, blue 100%)')`, a slider changes the stops. | A real gradient is drawn and follows the slider; `background-color: var(--x)` with the same value draws nothing (the documented limit). |
| A8-5 | #668 | A row of `<ng-icon>` with `size="18px"`, `size="1.5rem"` and `size="24"`; plus one unparsable size. | Three sizes drawn at 18 / 24 / 24 points (rem is 16 x 1.5); the unparsable one takes the surrounding text size. Before: no size at all. |
| A8-6 | #675 | A swatch with Tailwind `not-dark:bg-amber-200 dark:bg-zinc-800` and the lab's dark toggle. (`md:max-lg:` needs a width change, skip on phone.) | In dark mode the `not-dark:` colour no longer applies (swatch zinc); in light it is amber. Before: still applied in dark. |
| B8-1 | #665 (#663) | A focused `<text-input>` inside a view whose opacity transitions in. | Field keeps focus (keyboard stays up; a `focus`/`blur` readout shows no blur) when the fade ends. |

### 0.9.0

| Id | Entries | Demo sketch | Observable proof |
|---|---|---|---|
| A9-1 | #687 (+ closes the README "avoided by design" item) | A rewards counter with `{count(), plural, =0 {No rewards} one {# reward} other {# rewards}}` and `{tier(), select, gold {...} other {...}}`, a +/- stepper, plus `<text i18n-accessibilityLabel accessibilityLabel="...">`; extract with `localize-extract`, translate to ES (new `{$START_TAG_TEXT}` placeholder names), switch EN/ES. | 0, 1, 5 render the right case in EN and ES (Spanish plural rules via `LOCALE_ID`); the accessibility label carries its text; `i18n:check` passes after the placeholder rename. Caveat to look for: an element inside a case is dropped (documented). |
| A9-2 | #694 | Two components each with `@keyframes pulse` of a different movement (one scales, one slides). | Each square plays its own keyframes; before, both used whichever sheet loaded last. |
| A9-3 | #696 + #697 | Three panels with `@keyframes open { from { height: 0 } to { height: var(--panel-height) } }`, each with a different `--panel-height` (and one in `em`). | Each panel opens to its own height. Before: build error or dropped. |
| A9-4 | #690 (pairs with A6-8) | A button that fades to `opacity: 0` by a transition; keep pressing the invisible button. | iOS: press counter still increments after the fade ends. |
| A9-5 | #700 (needs `tw-animate-css`) | `animate-in fade-in-0 zoom-in-95 duration-200` on a card that mounts via `@if`. | Fades and zooms in over about 200 ms (mid-frame screenshot); before: animation dropped with a build warning. |
| B9-1 | #695 | A component whose `styleUrl` is in `../shared/fonts.css` declaring `url('./Inter.ttf')`. | Text draws in Inter and Metro resolves the file. Needs a font file in the repo. |
| B9-2 | #685 | A `svg:not([class*='size-'])` rule on icons with and without a `size-6` class. | The icon with `size-` keeps its class size; before it was overridden. |

**Status of A8-1 ... A8-6 (built in `feat/whats-new-0-8`, run on iOS and Android):** A8-1, A8-3, A8-4, A8-5 and A8-6 verified on both (A8-1 by a Settings round trip with the same process alive; A8-6's nested `@media` half, `md:max-lg:`, not tried on a phone). A8-2 not as described, isolated on 15 Oct in `src/app/repro/size-transition/` (draft `docs/findings/size-transition-block-js.md`): a `width`/`height` transition alone in its commit does not animate at all on iOS or Android (the box is at its end size within 0.5 s, block or not); the case's freeze came from the button's label changing length in the same commit, which sends the size to JavaScript as documented; the pair tile (the documented exception) freezes during the block, as the note says; the transform control keeps moving.

**Status of A9-1 ... A9-5 (built in `feat/whats-new-0-9`, run on iOS and Android):** A9-1 not as described (extraction works; on a device in development the ICU sample throws `must be an instance of a DOM Node but got #anchor`; Q3 answered), A9-2 and A9-3 verified on both, A9-4 verified on iOS, A9-5 caveat (fade and zoom seen; blur dropped on iOS). See the README, "What's new".

### 0.10.0

| Id | Entries | Demo sketch | Observable proof |
|---|---|---|---|
| A10-1 | #729, iOS | Button that opens `Dialogs.choose()` with three choices, the last `style: 'cancel'`; result readout. | Choosing Cancel, or tapping outside the sheet, shows `null` (not the cancel choice's index); a real choice shows its index. Same on Android. |
| A10-2 | #715 (+ #733) | On the running app (on a detail screen), open `exp://127.0.0.1:8081/--/device` with `xcrun simctl openurl`; then Back. | Device is pushed over the screen showing; Back returns to the screen it was opened over. Lab already uses these links; stack-depth readout. |
| A10-3 | #754 | Parent component `:host ::ng-deep .inner { color: red }` and a child component with an `.inner` text. | The child's `.inner` is red (and Metro no longer prints the `@ng-icons/core` `::ng-deep` warning). A rule with nothing before `::ng-deep` is still dropped. |
| A10-4 | #707 | A root view that carries the `dark` class itself with `dark:bg-zinc-950`, flipped by a switch. | The root view's own background turns dark, not just its children (before: children only). Lab already uses `dark:` (README says checked on Lists). |
| A10-5 | #752 | Two boxes with `border-width: 3px` and no `border-color`, inside `color: crimson` text. | Border is crimson (text colour), not black; adding `border-color: black` restores black. Lab check: it names every border color, so this changes nothing there. |
| A10-6 | #753 | A 90 pt-wide box with the word "Supercalifragilistic", and a second with three words. | The single word is one line cut at the edge; the three words wrap. Before: wrapped between letters. |
| A10-7 | #726 | Three overlapping absolutely positioned boxes with `z-index` 1, 2, 3 in reverse DOM order, one nested in a plain view. | Paint order follows `z-index` (the nested box above later siblings). |
| B10-1 | #725 | `.card:has(.action) .title { color: ... }` with a card that has an action and one that does not. | Only the first card's title restyles; before: rule dropped with a warning. |
| B10-2 | #727 | `StatusBar.push({hidden: true})` and a style push; drop the claim. | Status bar hides, returns, and its style goes back to the platform's. |
| B10-3 | #718 + #717 | A Rewards-like tab bar with a tab behind an `@if` flag; toggle it away and back, add a tab late. | Tab returns showing its page where it was left; late tab opens by tap. Touches the Rewards tabs. |
| B10-4 | #724 (#720), Android | A `formSheet` route dismissed with `NativeNavigation.back()` and the system back button on the emulator (screen recording or frames). | The sheet slides away with its content (not blank). Needs a recording; transient. |
| B10-5 | #757, iOS, conditional on Q1 | `ui-text` with `timerInterval` and `ui-progress` with `countsDown` on an iOS screen. | The timer counts by itself, no app updates. |

## Full table per version

Columns: version, PR/issue, one-line description, area, Expo Go, how it would be shown, lab already touches it, verdict.

### 0.6.0 (62 rows)

| Ver | PR | What | Area | Expo Go | Shown | Lab touches | Verdict |
|---|---|---|---|---|---|---|---|
| 0.6 | #604, #587 | `display: none` element has no native view (and nothing inside); scroll offset lost across it; testing queries skip it | CSS engine | yes | on screen | `display:none`/hidden used in wallet, reward detail; not this behaviour | PICK A6-1 |
| 0.6 | #509 | `@ng-native/analog` `pageRoutes`/`withAnalog`: Analog file-based pages on a native stack | other (new package) | yes (JS) but restructures routing | Vitest | no | TEST-ONLY |
| 0.6 | #509 | Analog content files (`provideContentFiles`, `injectContent`...) and `.md` pages | other | yes (JS) | Vitest | no | TEST-ONLY |
| 0.6 | #509 | `fileRoutes(pages)` in `@ng-native/router`: routes by files | router | yes (JS) but restructures routing | Vitest | no (routes are hand-written) | TEST-ONLY |
| 0.6 | #509 | `.md` file is a module under `withAngularNative` (`import post from './post.md'`), tokens lexed at build | tooling-build | yes | on screen (with `<markdown>`) | no | PICK A6-2 |
| 0.6 | #509 | `<markdown>`: headings, lists, tables, code, links, images as native views | component | yes | on screen | no | PICK A6-2 |
| 0.6 | #592 | Every component library's CSS compiled with no `libraryStyles` entry | tooling-build | n/o | not demonstrable | Metro prints `@ng-icons/core` warning (README) | SKIP |
| 0.6 | #572 | Unscoped (`ViewEncapsulation.None`) CSS restyles only matching views on first render | CSS engine | n/o (perf) | not demonstrable | no | SKIP |
| 0.6 | #575 | Same for unscoped CSS naming a cascade layer (CDK overlays) | CSS engine | n/o (perf) | not demonstrable | no | SKIP |
| 0.6 | #624 | `LayoutAnimation.animate()` animates its own change during a JS-driven CSS animation; commits before returning | other (animation) | yes | on screen (iOS) | no | PICK B6-2 |
| 0.6 | #622, #569 | `android.layoutAnimations` plugin option so `LayoutAnimation` animates on Android | tooling-build | dev build (config plugin, prebuild); Expo Go Android does not animate | on screen as a caveat only | no | PICK B6-2 (Expo Go half) |
| 0.6 | #625, #588 | A row that moved keeps its style/subtree under `:nth-child` and `~` | CSS engine | n/o (perf) | not demonstrable | no | SKIP |
| 0.6 | #561 | `inherit` taken for radius, sizes, font props, background-color, opacity (`bg-inherit`) | CSS engine | yes | on screen (square vs round layer) or Vitest | no | TEST-ONLY |
| 0.6 | #633 | `!important` in a stylesheet beats an inline style | CSS engine | yes | Vitest (committed style) | no | TEST-ONLY |
| 0.6 | #600 | Hot reload keeps state/route for far more edits; Expo Go Android reloads on edits it cannot apply | tooling-build | yes (dev only) | not demonstrable (developer experience; a screen recording of an edit) | no | LIST |
| 0.6 | #603 | A field already focused does not hear a second `focus` event | component | yes | Vitest (needs programmatic focus) | no | TEST-ONLY |
| 0.6 | #613 | `flex-basis` changes after layout are followed; percentage follows its box | CSS engine | yes | on screen | no | PICK A6-4 |
| 0.6 | #591 | `border-radius`/`transform` `var()` with multi-part fallback | CSS engine | yes | on screen | no | PICK A6-7 |
| 0.6 | #621, #576 | `UiBottomSheet` `<ui-bottom-sheet [(open)]>` system sheet from any component; `UiGroup` | expo module | yes if `@expo/ui` is in Expo Go (Q1); dev build otherwise | on screen | no | PICK B6-3 (conditional) |
| 0.6 | #610, #584 | An empty `span`/`p`/`label` is a view (an 8x8 dot is a box) | CSS engine | yes | on screen or Vitest | no | TEST-ONLY |
| 0.6 | #571 | `:empty` matches an element whose only child is an empty text node; restyles on first character | CSS engine | yes | on screen or Vitest | no | TEST-ONLY |
| 0.6 | #618 | Animation with empty keyframes no longer commits every frame | CSS engine | n/o (perf) | not demonstrable | no | SKIP |
| 0.6 | #565 | `color-mix()` with a token share | CSS engine | yes | on screen | no | PICK A6-9 |
| 0.6 | #596 | A class restyles only what the rules naming it reach | CSS engine | n/o (perf) | not demonstrable | no | SKIP |
| 0.6 | #608, #585 | Flex-container text element places one inner text element (centred label) | CSS engine | yes | on screen or Vitest | no | TEST-ONLY |
| 0.6 | #560 | `border-right: none` under later `border-width` draws no side; `border-*-style` supported | CSS engine | yes | on screen or Vitest | borders in Lists/Join (all with colour) | TEST-ONLY |
| 0.6 | #568 | `align-items: baseline` row with a `display:none` first box keeps its height | CSS engine | yes | Vitest | no | TEST-ONLY |
| 0.6 | #615, #586 | `@media (prefers-reduced-motion)` without value reads as `reduce` | CSS engine | yes (toggle Reduce Motion in simulator Settings) | on screen (Settings toggle) or Vitest | no | TEST-ONLY (see Q4) |
| 0.6 | #636 | `background: inherit` is the parent's colour | CSS engine | yes | Vitest | no | TEST-ONLY |
| 0.6 | #634 | `aspect-ratio` ignored when both width and height are set | CSS engine | yes | Vitest (committed props) or on screen with `(layout)` | no | TEST-ONLY |
| 0.6 | #607, #582 | `animation` shorthand with `calc()` duration on a token | CSS engine | yes | Vitest | no | TEST-ONLY |
| 0.6 | #628 | Exiting element not seen at rest for a frame before `animationend` removes it | CSS engine | yes (one frame, not capturable) | not demonstrable | no | SKIP |
| 0.6 | #606 | Transform eased between lists of different lengths | CSS engine | yes | on screen (mid-frame) or Vitest | no | TEST-ONLY |
| 0.6 | #590 | `touch-action: pan-y`/`none` holds back the screen's swipe (iOS 26+); Tailwind `touch-none` | CSS engine | yes (iOS 26+) | on screen (edge drag) | no | PICK B6-4 |
| 0.6 | #632 | Elements with same custom properties as parent share the map (Tailwind `*` base) | CSS engine | n/o (perf) | not demonstrable | no | SKIP |
| 0.6 | #609, #580 | `rows` sizes a multiline `<text-input>` | component | yes | on screen | no | PICK A6-3 |
| 0.6 | #563 | `ngNative()` Vitest plugin takes `libraryStyles` | testing | n/o | Vitest config | no | SKIP |
| 0.6 | #559 | `light-dark()` works with the Tailwind preset | CSS engine | yes | on screen | dark toggle exists | PICK A6-9 |
| 0.6 | #630 | Faster first render with library stylesheets | CSS engine | n/o (perf) | not demonstrable | no | SKIP |
| 0.6 | #562 | `margin`/`padding` `var()` with multi-value fallback | CSS engine | yes | on screen | no | PICK A6-7 |
| 0.6 | #616 | Gaining/losing a row restyles only the two ends for `:first/last-child` rules | CSS engine | n/o (perf) | not demonstrable | no | SKIP |
| 0.6 | #620 | Same for `:nth-child()` rules | CSS engine | n/o (perf) | not demonstrable | no | SKIP |
| 0.6 | #602 | Shorthand side `calc()` around a `var()` is worked out | CSS engine | yes | Vitest | no | TEST-ONLY |
| 0.6 | #567 | `opacity` in `::placeholder` fades the placeholder | CSS engine | yes | on screen or Vitest | no | TEST-ONLY |
| 0.6 | #619, #606, #583 | Translate eased between a percentage and a length (Material floating label) | CSS engine | yes | on screen (mid-frame) or Vitest | no | TEST-ONLY |
| 0.6 | #611, #579 | `height: 100%` under a row sized by content is no height | CSS engine | yes | on screen (`(layout)`) or Vitest | no | TEST-ONLY |
| 0.6 | #612, #578 | Percentage height on an absolute box under a content-sized parent kept | CSS engine | yes | on screen or Vitest | no | TEST-ONLY |
| 0.6 | #574 | Pressed view with `opacity: 0` takes the press on iOS | component | yes | on screen | no | PICK A6-8 |
| 0.6 | #635 | `outline: none` not sent to native; fixes text vanishing on focus, Android | CSS engine | yes (Android) | on screen (Android) | no | PICK B6-1 |
| 0.6 | #509 | `@ng-native/*` component CSS compiled from npm with no `libraryStyles` | tooling-build | n/o | not demonstrable | no | SKIP |
| 0.6 | #623 | Row added/removed under `+` rules restyles only rows next to it | CSS engine | n/o (perf) | not demonstrable | no | SKIP |
| 0.6 | #631 | `detectChanges()` in a lifecycle hook no longer commits the screen on its own | other (renderer) | n/o (perf) | not demonstrable | no | SKIP |
| 0.6 | #617 | Keyframes whose transform gains/loses a function are played by native | CSS engine | yes | on screen (with Block JS) | Block JS button | PICK A6-6 |
| 0.6 | #629 | Keyframes translating by a percentage are played by native | CSS engine | yes | on screen (with Block JS) | Block JS button | PICK A6-6 |
| 0.6 | #595 | Keyframe animation no longer leaves view at first frame when made in a long task | CSS engine | yes (timing-dependent) | not demonstrable | no | SKIP |
| 0.6 | #566 | Transition named with 0ms is eased when one change gives value and time | CSS engine | yes | Vitest | no | TEST-ONLY |
| 0.6 | #509 | Tab with no component of its own (`loadChildren`, route groups) opens; stack kept | router | yes | Vitest | Rewards tabs (all have components) | TEST-ONLY |
| 0.6 | #589, #558 | `<virtual-list>`/`<section-list>` with header/footer no longer stops the app on Android | component | yes (Android) | on screen (Android) | yes: Rewards catalog footer, README Android section | PICK A6-5 |
| 0.6 | #570 | `var()` fallback of `calc(100vw - 32px)` honoured | CSS engine | yes | Vitest | no | TEST-ONLY |
| 0.6 | #577 | `transition` shorthand with a token time (`var(--duration, 0ms)`) | CSS engine | yes | Vitest | no | TEST-ONLY |
| 0.6 | #605, #581 | `transform: var(--move)` where the token holds functions with `var()`/`calc()` | CSS engine | yes | Vitest | no | TEST-ONLY |
| 0.6 | #564 | `scale3d()`, `translate3d()`, `translateZ(0)` read as flat transforms | CSS engine | yes | Vitest | no | TEST-ONLY |

### 0.7.0 (19 rows; #648 appears three times in the notes and is one row)

| Ver | PR | What | Area | Expo Go | Shown | Lab touches | Verdict |
|---|---|---|---|---|---|---|---|
| 0.7 | #653 | Press no longer restyles the whole screen under Tailwind `group-active:`/`peer-active:` | CSS engine | n/o (perf) | not demonstrable (the visible half is B7-2) | no | SKIP |
| 0.7 | #655 | Press on an element named as one alternative of `:is()` restyles its children | CSS engine | yes | on screen (long press) | no | PICK B7-2 |
| 0.7 | #647 | `endReached` fires when rows are shorter than the viewport and after appends; `viewableItemsChanged` reports on item changes | component | yes | on screen | `<virtual-list>` in Lists/Rewards (no `endReached`) | PICK A7-2 |
| 0.7 | #638 | Unitless `line-height` in global stylesheet is a multiple of the element's own font size | CSS engine | yes | Vitest | `line-height` in `styles.css` | TEST-ONLY |
| 0.7 | #641 | Transition of `opacity`/`background-color` that no rule sets runs from/to initial value | CSS engine | yes | on screen | transitions in Rewards (`reward-row`, `tier-progress`) | PICK A7-4 |
| 0.7 | #649 | `transition: all` does the same | CSS engine | yes | on screen | no | PICK A7-4 |
| 0.7 | #640 | `steps()` easing drops only its declaration, not the whole rule | CSS engine | yes | Vitest | no | TEST-ONLY |
| 0.7 | #658, #657 | `<native-toolbar>` and `<native-toolbar-item>` bottom toolbar on iOS 18+ (needs `expo-router` native half) | router | yes if Expo Go bundles `expo-router` native code (Q1) | on screen | no | PICK A7-1 |
| 0.7 | #643 | Transition turned back part way takes as long to return as it had run | CSS engine | yes | Vitest (timing) | no | TEST-ONLY |
| 0.7 | #642 | Colour transitions/keyframes mix in premultiplied alpha | CSS engine | yes | Vitest (committed values) | no | TEST-ONLY |
| 0.7 | #654 | `max-content` read as a size (`w-max`, `h-max`, `max-w-max`) | CSS engine | yes | Vitest | no | TEST-ONLY |
| 0.7 | #645 | `nativeRouterLink` to a url on the stack pushes a new screen; `replaceUrl` replaces | router | yes | on screen | router stack in Rewards | PICK A7-3 |
| 0.7 | #646 | `reset()`/`replace()`/`present()` to a page whose guard redirects act on the redirect target | router | yes | Vitest | yes: `reset()` + guard in Login logout | TEST-ONLY |
| 0.7 | #639 | Unitless `line-height` inherited as the number (also `font: 10px/2`, custom properties) | CSS engine | yes | on screen | no | PICK A7-5 |
| 0.7 | #644 | Single-line text field with `min-height: auto` centres its text on iOS | component | yes (iOS) | Vitest (sub-5-pt, not visible) | Join form inputs | TEST-ONLY |
| 0.7 | #650 | Single-line text field in a baseline row aligns with neighbouring text on iOS | component | yes (iOS) | Vitest (about 2.5 pt, not visible) | no | TEST-ONLY |
| 0.7 | #656, #652 | `ui-bottom-sheet` toolbar and `<ui-button role="close">`; `UiNavigationStack`, `UiToolbar`, `UiToolbarItem` | expo module | yes if `@expo/ui` 57.0.20+ is in Expo Go (Q1) | on screen | no | PICK B7-1 (conditional) |
| 0.7 | #637 | Debug build no longer stops with "Attempt to mutate a sealed object" in a baseline row with text | CSS engine | n/o (debug assertion) | not demonstrable | no | SKIP |
| 0.7 | #648 | Markdown: soft line break is a space, all named HTML entities, Analog slugs with spaces/accents, dotted static pages first | component | yes (markdown); Analog parts JS only | on screen (markdown), Vitest (Analog/routes) | no | PICK A7-6 |

### 0.8.0 (17 rows)

| Ver | PR | What | Area | Expo Go | Shown | Lab touches | Verdict |
|---|---|---|---|---|---|---|---|
| 0.8 | #667 | Attribute selectors with empty value (`^=""`, `$=""`, `*=""`, `~=""`) match nothing | CSS engine | yes | Vitest | no | TEST-ONLY |
| 0.8 | #664 | `background: var(--x)` draws a gradient held by a custom property set on an element | CSS engine | yes | on screen | no | PICK A8-4 |
| 0.8 | #673 | A prop no selector names no longer restyles the element's subtree | CSS engine | n/o (perf) | not demonstrable | no | SKIP |
| 0.8 | #670 | Transition/animation of padding, margin, `border-radius` from/to unset (0) | CSS engine | yes | on screen | no | PICK A8-3 |
| 0.8 | #665, #663 | Focused text field keeps focus while a view around it fades; view with a transition gets `collapsable: false` | component | yes | on screen | no | PICK B8-1 |
| 0.8 | #674 | Attribute-only / descendant-of-class rules filed under attribute/class (perf) | CSS engine | n/o (perf) | not demonstrable | no | SKIP |
| 0.8 | #669 | `reset()` to a url landing on the screen already on top clears screens under it | router | yes | Vitest | yes: `reset()` in Login | TEST-ONLY |
| 0.8 | #681 | Release build from a warm Metro cache ships an edited `templateUrl`/`styleUrl` | tooling-build | n/o | not demonstrable | no | LIST |
| 0.8 | #682 | `Permission.ensure()` re-checks a refused permission; `blocked()` updates on foreground | device | yes | on screen (Settings toggle) | yes: Device Location blocked state | PICK A8-1 |
| 0.8 | #675 | Nested `@media` and `:not(:where(.dark, .dark *))`: `md:max-lg:`, `not-dark:` work | CSS engine | yes (`md:max-lg:` needs a width change, not on a phone) | on screen (`not-dark:`) | dark toggle exists | PICK A8-6 |
| 0.8 | #672 | Transitions of opacity/transform/background/border colour played by native | CSS engine | yes | on screen (with Block JS) | Block JS button, Rewards press fade | PICK A8-2 |
| 0.8 | #676 | Transitions of size/place are one native layout-animated commit | CSS engine | yes | on screen (with Block JS) | Block JS button | PICK A8-2 |
| 0.8 | #659 | `:is(<scope> <compound> > *)` / `... *` read (Tailwind `*:` and `group-*` in a scope) | CSS engine | yes | Vitest | no | TEST-ONLY |
| 0.8 | #662 | `:is(<scope> <compound>)` read (`in-data-[slot=dialog]:`, `rtl:`) | CSS engine | yes | Vitest | no | TEST-ONLY |
| 0.8 | #666 | Keyframes leave a `!important` property where the rule puts it | CSS engine | yes | Vitest (or tile) | no | TEST-ONLY |
| 0.8 | #668 | Icon `size="18px"` / `"1.5rem"` read | component (icons) | yes | on screen | Lucide icons (numeric sizes) | PICK A8-5 |
| 0.8 | #683 | Upgrading/removing an `@ng-icons` set rebuilds importing files | tooling-build | n/o | not demonstrable | no | LIST |

### 0.9.0 (14 rows)

| Ver | PR | What | Area | Expo Go | Shown | Lab touches | Verdict |
|---|---|---|---|---|---|---|---|
| 0.9 | #687 | ICU plurals/selects render; `i18n-` attributes keep text; method shorthand in decorators compiles (`@oxc-angular/vite` 0.0.40); placeholder names change | i18n | yes (0.0.40 already installed) | on screen + Vitest | yes: README "not tested, avoided by design" | PICK A9-1 |
| 0.9 | #694 | Same-named `@keyframes` in two components each play their own | CSS engine | yes | on screen | no | PICK A9-2 |
| 0.9 | #685 | `[class*='size-']` and other class-attribute selectors match; `:is()` specificity; two `:host-context()` | CSS engine | yes | on screen or Vitest | no | PICK B9-2 |
| 0.9 | #693 | Element moved between boxes / under a box whose class changed is styled by what is over it | CSS engine | yes | Vitest | no | TEST-ONLY |
| 0.9 | #697 | Two-frame size keyframes committed once and moved by native layout animation; mixed-duration size transitions: longest native | CSS engine | yes | on screen | no | PICK A9-3 |
| 0.9 | #696 | `@keyframes` values may be `var()`, `em`, viewport units | CSS engine | yes | on screen | no | PICK A9-3 |
| 0.9 | #695 | Font declared in a `styleUrl` sheet in another directory resolved beside it; wrapped `@ng-icons` import keeps line numbers | tooling-build | yes (font file needed) | on screen | no | PICK B9-1 |
| 0.9 | #700 | `tw-animate-css` plays (`animate-in fade-in-0 zoom-in-95 duration-200`) | CSS engine | yes (needs the JS package) | on screen | no | PICK A9-5 |
| 0.9 | #698 | Transform with a token takes `translate3d()`/`scale3d()`; `rotate(var(--r, 0))` | CSS engine | yes | Vitest | no | TEST-ONLY |
| 0.9 | #684 | A cleared `bornIn` keeps its transitions | other (renderer internals) | n/o | not demonstrable | no | SKIP |
| 0.9 | #691 | Custom-property / `dark` class change restyles without re-matching rules (perf) | CSS engine | n/o (perf) | not demonstrable | dark toggle (no numbers claimed) | SKIP |
| 0.9 | #692 | A released press is committed as not pressed before its handler runs (overlay not drawn before placed) | component | yes (one frame) | not demonstrable | no | SKIP |
| 0.9 | #699 | iOS single-line field with `height: 100%` and `line-height` centres its text | component | yes (iOS) | Vitest | no | TEST-ONLY |
| 0.9 | #690 | A view that fades to `opacity: 0` by a transition still hears a press on iOS | component | yes (iOS) | on screen | no | PICK A9-4 |

### 0.10.0 (44 rows)

| Ver | PR | What | Area | Expo Go | Shown | Lab touches | Verdict |
|---|---|---|---|---|---|---|---|
| 0.10 | #724, #720 | Android: closed `formSheet` keeps content while it animates away (`provideNativeRouter` loads react-native-screens' module) | router | yes (Android) | on screen (recording) | no | PICK B10-4 |
| 0.10 | #762 | `ongoingNotification()` Android ongoing notification/Live Update; new permissions | expo module | dev build (rebuild) | not demonstrable | no | LIST |
| 0.10 | #723 | `Renderer2.removeChild` removes from the node's own parent | other (renderer) | n/o | Vitest | no | TEST-ONLY |
| 0.10 | #756 | A library rule that does not parse keeps the rules nested beside it | CSS engine | n/o | not demonstrable | Metro `@ng-icons/core` warning | SKIP |
| 0.10 | #726 | Box with `z-index` > 0 drawn over what follows the views it is in | CSS engine | yes | on screen | no | PICK A10-7 |
| 0.10 | #732 | `NativeNavigation.popTo()` works when the stack holds the same url twice | router | yes | Vitest | no | TEST-ONLY |
| 0.10 | #740 | Video player `state()` starts with its own `muted`/`volume` | expo module | yes with `expo-video` (new dep) | Vitest | no | TEST-ONLY |
| 0.10 | #751 | `:first-of-type`, `:last-of-type`, `:only-of-type`, `:nth-of-type()`, `:nth-last-of-type()` | CSS engine | yes | on screen or Vitest | no | TEST-ONLY |
| 0.10 | #754 | `::ng-deep` read when something precedes it (`:host ::ng-deep .inner`) | CSS engine | yes | on screen | yes: upgrade note says Metro stopped printing the `@ng-icons/core` `::ng-deep` warning | PICK A10-3 |
| 0.10 | #760 | Tap on a Live Activity button that starts the app reaches `onTaps` | expo module | dev build (iOS rebuild) | not demonstrable | no | LIST |
| 0.10 | #759 | Live Activity layout takes `ui-button` (iOS 17+); `onTaps` target | expo module | dev build | not demonstrable | no | LIST |
| 0.10 | #755 | Text with a `line-height` is never laid out shorter than one line | CSS engine | yes | on screen or Vitest | no | TEST-ONLY |
| 0.10 | #733 | Launch deep link followed over the first page, or not at all | router | yes | Vitest | deep links | TEST-ONLY |
| 0.10 | #713 | Element after one that changed is matched on its own (sibling combinator perf) | CSS engine | n/o (perf) | not demonstrable | no | SKIP |
| 0.10 | #725 | `:has()` of a box the styled node is in (`.card:has(.action) .title`) | CSS engine | yes | on screen | no | PICK B10-1 |
| 0.10 | #719 | `@font-face` with several files registered from the TrueType/OpenType file and the last `src` | CSS engine | yes (font file needed) | on screen | no | TEST-ONLY |
| 0.10 | #707 | `dark:` applies to the view that has the `dark` class (both Tailwind presets) | CSS engine | yes | on screen | yes: `dark:` and `ColorScheme.set` (Lists checked per README) | PICK A10-4 |
| 0.10 | #729 | iOS `Dialogs.choose()` resolves `null` when the cancel choice is picked or sheet dismissed | device | yes | on screen | no | PICK A10-1 |
| 0.10 | #752 | Border with width and no colour draws in the text colour | CSS engine | yes | on screen | yes: README says every lab border names its colour | PICK A10-5 |
| 0.10 | #735 | Text written straight into a view takes a custom font that loads after first render | CSS engine | yes (font needed) | Vitest | no | TEST-ONLY |
| 0.10 | #728 | `background` shorthand takes gradients; `background: red` removes an earlier gradient | CSS engine | yes | on screen (pairs with A8-4) | no | TEST-ONLY |
| 0.10 | #734 | `[attr.class]`/`[attr.style]` set to null removes classes/styles | other (renderer) | yes | Vitest | no | TEST-ONLY |
| 0.10 | #702 | Transform cache restarts when the app's own `@angular/core`/worklets/reanimated changes | tooling-build | n/o | not demonstrable | no | SKIP |
| 0.10 | #753 | One-word text is one line cut at the box edge, not wrapped between letters | CSS engine | yes | on screen | no | PICK A10-6 |
| 0.10 | #704 | `<scroll-view pagingEnabled>` pages in a browser | web-browser-only | browser-only | not demonstrable on device | no | SKIP |
| 0.10 | #703 | `<text numberOfLines>` cut with ellipsis in a browser | web-browser-only | browser-only | not demonstrable on device | `numberOfLines` used on device (rows) | SKIP |
| 0.10 | #701 | `<text-input>` `(keyPress)`/`(selectionChange)` payloads in a browser | web-browser-only | browser-only | not demonstrable on device | no | SKIP |
| 0.10 | #705 | `Updates` keeps a downloaded update waiting when a later `check()` fails | expo module | dev build / EAS Update (Expo Go has no updates module of the app's own) | Vitest | no | TEST-ONLY |
| 0.10 | #757 | `ui-text` `date`/`dateStyle`/`timerInterval`/`countsDown`; `ui-progress` timer, for Live Activities, widgets, iOS screens | expo module | iOS screen: yes if `@expo/ui` in Expo Go (Q1); Live Activity/widget: dev build | on screen (iOS screen only) | no | PICK B10-5 (conditional) |
| 0.10 | #758 | `ui-image` `assetName` (asset catalog image or custom symbol) | expo module | dev build (asset catalog) | not demonstrable | no | LIST |
| 0.10 | #746 | Token of two to four lengths with `var()` parts gives padding/margin/border-width/radius per side | CSS engine | yes | Vitest | no | TEST-ONLY |
| 0.10 | #763 | Text centred in a taller box at system text sizes smaller than default | CSS engine | yes (iOS Larger Text setting) | Vitest | no | TEST-ONLY |
| 0.10 | #711, #710 | Test importing a `'use dom'` file gets a page reference (no `window is not defined`) | testing | n/o | Vitest | no | LIST (DOM components not used in the lab) |
| 0.10 | #706 | `userEvent.press`/`type` etc. do nothing on nodes with `pointerEvents` none/box-none; `g`/`y` RegExp queries find every match | testing | n/o | Vitest | no (138 tests, none of this) | TEST-ONLY |
| 0.10 | #718 | `<native-tab>` taken away by `@if` and back shows its page where it was left | router | yes | on screen | Rewards tabs | PICK B10-3 |
| 0.10 | #717 | `<native-tab>` added after the bar starts can be opened | router | yes | on screen | Rewards tabs | PICK B10-3 |
| 0.10 | #727 | Dropping a `StatusBar.push()` claim restores what only it changed | device | yes | on screen | no | PICK B10-2 |
| 0.10 | #712 | Rules naming an absent ancestor are passed over without walking up (perf) | CSS engine | n/o (perf) | not demonstrable | no | SKIP |
| 0.10 | #722 | Custom property of two to four lengths gives per-side padding/margin/border/radius | CSS engine | yes | Vitest | no | TEST-ONLY |
| 0.10 | #730 | Screen with `animation-timeline: scroll()` is released when closed (leak) | CSS engine | n/o (memory) | not demonstrable | no | SKIP |
| 0.10 | #715 | Deep link arriving while running is pushed over the screen showing (no `withLinkParent`) | router | yes | on screen (`simctl openurl`) | yes: lab's deep links | PICK A10-2 |
| 0.10 | #714 | Default style / class-presence rules restyle only what they reach (perf) | CSS engine | n/o (perf) | not demonstrable | no | SKIP |
| 0.10 | #721 | `reset()`/`replace()` to a page that navigates elsewhere in `ngOnInit` removes superseded screens | router | yes | Vitest | yes: Login sign-out via `reset()` | TEST-ONLY |
| 0.10 | #716 | `reset()` to a screen still further down the stack leaves it alone on the stack | router | yes | Vitest | yes: `reset()` in Login | TEST-ONLY |

## Needs a development build (for a later phase)

| Ver | PR | Entry | Why Expo Go cannot |
|---|---|---|---|
| 0.6 | #622 (#569) | `android.layoutAnimations` plugin option so `LayoutAnimation.animate()` animates on Android | Config plugin that patches `MainApplication.kt` at prebuild; Expo Go on Android has the flag off |
| 0.10 | #762 | `ongoingNotification()` Android ongoing notification / Live Update, `POST_PROMOTED_NOTIFICATIONS` | Native module and manifest permissions, needs `expo run:android` or EAS |
| 0.10 | #760 | Live Activity button tap that starts the app reaches `onTaps` | Native module held on iOS, needs rebuild |
| 0.10 | #759 | Live Activity layout with `ui-button` (iOS 17+), `onTaps` target | Live Activity extension, needs rebuild |
| 0.10 | #757 (Live Activity / widget part) | `ui-text` / `ui-progress` timers in a Live Activity or home-screen widget | Widget extension; the on-screen iOS part may work in Expo Go (B10-5) |
| 0.10 | #758 | `ui-image` `assetName` from the asset catalog | Needs a compiled asset catalog |
| 0.10 | #705 | `Updates` keeps a downloaded update when a later check fails | Needs a build with EAS Update configured |
| 0.6 / 0.7 / 0.10 | #621, #656, #757 | `@expo/ui` views (bottom sheet, toolbar, `ui-text` timer) | Only if `@expo/ui` 57.0.20+ is not in Expo Go; see Q1 |
| 0.7 | #658 | `<native-toolbar>` | Only if Expo Go does not carry `expo-router`'s native half; see Q1 |
| 0.6 | #600 | Hot reload keeps state; Expo Go Android reloads | Works in Expo Go but is a developer-experience change, listed rather than demoed |
| 0.8 | #681, #683 | Release build cache for edited templates/sheets and `@ng-icons` upgrades | Needs `expo export` / release builds; build behaviour, not runtime |

## Open questions

- **Q1 (#621, #656, #757, #658).** Are `@expo/ui` (57.0.20+) and `expo-router`'s native toolbar views present in Expo Go for SDK 57 on iOS 27? The notes say "Expo Go has it built in" for `expo-router` (#658) but that an iOS build without the sheet views "as Expo Go can be" warns (#656). Proposed probe before building B6-3, B7-1, B10-5 and A7-1: install both with `npx expo install`, render one `ui-bottom-sheet` and one `native-toolbar`. If either is missing, move the entry to the dev build list.
- **Q2 (#641, #649, #670).** Mid-transition proof relies on a screenshot at a known time. If we prefer something verifiable without timing, switch these cases to a slowed (1 s) transition with a readout driven by `(transitionend)` or a computed opacity; whether ng-native emits `transitionend` was not checked.
- **Q3 (#687).** The note says ICU needs `@oxc-angular/vite` 0.0.40; the installed copy is 0.0.40, but whether the lab's Metro path (not Vite) uses it, and whether `localize-extract` extracts ICU messages cleanly, is untested. If the extraction fails, the case becomes a "does not behave as the note says" entry, which is also a valid outcome.
- **Q4 (#615).** Reduced Motion cannot be set from a script on the simulator the way Face ID can; it needs a manual Settings > Accessibility > Motion toggle. Left TEST-ONLY unless Víctor wants a recorded manual step. Also unclear whether `matchMedia`-like reduce motion on Android Expo Go is read at all.
- **Q5 (#600).** Hot-reload behaviour (state kept for method/getter edits, route kept on a field edit) is a real-simulator-only demo and arguably the best video material of 0.6.0, but it demonstrates a developer workflow, not a screen. LISTed; tell me if you want it as a recorded segment without an in-app case.
- **Q6 (#509 Analog / `fileRoutes`).** Demoing them live would replace the lab's hand-written routes with `src/app/pages`. TEST-ONLY by default; a small separate route tree under one demo would be an alternative if you want it visible.
- **Q7 (#648 appears three times in the 0.7.0 notes).** Treated as one entry (a duplicated block in the release text).
- **Q8 (#724, #704 and web entries).** Android formSheet fix is visible only as a transient animation; treated as B tier. Web-only entries (#701, #703, #704) are SKIP because the lab has no `@ng-native/web` build; say so if you want a "browser" badge in the list.
- **Q9 (#574 / #690).** Both fixes are "iOS sends no touch to alpha under 0.01"; the Android column of the badge may read "same as before" rather than "verified", so the case should say iOS only.
- **Q10 (Gestures 0.6/0.8 cases).** A6-6 and A8-2 add tiles to the existing "Block JS" comparison. The README reports pans stopped responding on iOS after a hot template swap (restart the app after editing gesture screens), so those cases should be checked on a fresh launch.

## Addendum: ng-native 0.11.0, 0.12.0 and 0.13.0

Date: 2026-10-14. The lab is on 0.13.0 (upgraded from 0.10.0 in `6e92a62`). Same method as above: the three release notes
read against the lab's `src/` and the PRs (`gh pr view <n> -R ng-native/ng-native`), nothing run yet; every "observable proof" is what the
note claims. The legend above applies. A note's sub-bullets count as rows (`#785` has seven), so the totals are rows, not PR numbers: 21 rows
from 15 entries (10 in 0.11, 3 in 0.12, 2 in 0.13).

| Version | Rows | PICK | TEST-ONLY | LIST | SKIP | Cases |
|---|---|---|---|---|---|---|
| 0.11.0 | 10 | 3 | 0 | 4 | 3 | 3 |
| 0.12.0 | 3 | 0 | 0 | 2 | 1 | 0 (no section) |
| 0.13.0 | 8 | 8 | 0 | 0 | 0 | 8 |
| Total | 21 | 11 | 0 | 6 | 4 | 11 |

Facts about the lab that shape this addendum:
- `react-native-svg` 15.15.4 is already installed (the Icons package needs it), so every `NgIcon` case runs in Expo Go with no new package.
  `<mask>`, `<clipPath>` and `<use>` are exercised with markup written by hand through `[svg]`, which is the same path a lets-icons or
  flag-icons string takes; no `@ng-icons/*` set was installed.
- 0.12.0 is all DOM components and `registerViewName`. The lab has no `@ng-native/web` and AGENTS.md rules out `@angular/platform-browser`,
  so nothing in 0.12.0 can be shown without adding three packages: it has no section in the demo (S4).
- The tab cases (#761, #774, #783) need a tab bar of their own. They live in a small separate route tree under `whats-new/` (the "tabs lab"),
  so the Rewards tabs are not touched.

### Proposed cases (PICK)

| Id | Entries | Demo sketch | Observable proof |
|---|---|---|---|
| A11-1 | #776 (#775) | A button calling `DeepLinks.openSettings()`, beside the platform and a readout of what the button did. | The app's own page in the system Settings opens (iOS: Expo Go's; Android: Expo Go's "App info"). Before: `open()` had no url for it on Android. Observe what the button really does on each platform. |
| A11-2 | #761 | Tabs lab: the Search tab sits behind a guard that waits 4 s; press Search, then Home at once. | After the guard finishes, Home is still the tab in front and Search never opens. Before: Search opened when it finished loading. |
| A11-3 | #774 | Tabs lab under `org/:org` with `reuseScreen`: open Library in org 1, go to org 2, press Library. | The tab opens at org 2's first page, not at org 1's remembered url. |
| A13-1 | #785 (mask, clipPath, use) | Three `[svg]` drawings: a duotone-style icon with `<mask>`, a flag clipped by `<clipPath>`, a star drawn twice by `<use>`. | The mask keeps its line instead of a solid square, the clipped artwork stays inside its edge, both `<use>` stars are drawn. |
| A13-2 | #785 (`color="var(--accent)"`) | An icon whose colour is `var(--accent)`, with `--accent` set on the view around it and changed by a button. | The icon is the accent colour and follows the token; before it was sent to native as the text `var(--accent)`. |
| A13-3 | #785 (`provideNgIconsConfig`) | Icons under `provideNgIconsConfig({ size: 28, color, strokeWidth })`: one with no inputs, one with its own `size`. | The bare icon draws at 28 points in the config colour; the other keeps its own size (layout readout). |
| A13-4 | #785 (`provideNgIconLoader`, `withCaching()`) | Icons whose name no `provideIcons` has, answered by a loader (string, promise); a counter of loader calls. | The loader draws them; two icons of one name ask once with `withCaching()`. |
| A13-5 | #785 (`aria-label`) | `<ng-icon aria-label="...">` beside a decorative icon. | The labelled icon is an accessibility element with that label; the other is not. |
| A13-6 | #785 (`--ng-icon__size`) | An icon with no `size` in a view that sets `--ng-icon__size: 32px`, and one with none around it. | The first draws at 32 points, the second at the text size (layout readout). |
| A13-7 | #785 (`stroke-dasharray="none"`, `opacity="50%"`) | Raw markup with a dashed line, a line with `stroke-dasharray="none"`, and shapes at `opacity="0.5"` and `"50%"`. | The `none` line is solid; the 50% shape is as pale as the 0.5 one. |
| A13-8 | #783, Android | Tabs lab: from Home, `present('/library/7', { as: 'formSheet' })` of a page that sets `preventNativeDismiss`; press Back. | The sheet stays up and the page counts the attempt. Android only. |

### Full table per version

Columns as above.

### 0.11.0 (10 rows)

| Ver | PR | What | Area | Expo Go | Shown | Lab touches | Verdict |
|---|---|---|---|---|---|---|---|
| 0.11 | #766 | Live Activity layout takes a `bannerSmall` slot (Smart Stack, CarPlay) | expo module | dev build | not demonstrable | no | LIST |
| 0.11 | #764 | Tailwind 3 theme `hsl()` colour rounds a half channel as a browser does | tailwind (build) | n/o | not demonstrable | no: the lab is on Tailwind 4 | SKIP |
| 0.11 | #772 | Web host: a template plural follows `LOCALE_ID` | i18n (web host) | n/o (web) | not demonstrable | no | SKIP |
| 0.11 | #773 | Web host: ICU plural/select renders in a development build (`instanceof Node`) | i18n (web host) | n/o (web) | not demonstrable | A9-1 failed on a device with the same assertion, but the note is about the web host only | SKIP |
| 0.11 | #774 | Tab bar kept as one screen with `reuseScreen` under `org/:org` opens a tab in the account in front | router | yes | on screen (tabs lab) | no | PICK A11-3 |
| 0.11 | #761 | Back to the tab in front while another tab loads stays on it | router | yes | on screen (tabs lab) | Rewards tabs, not touched | PICK A11-2 |
| 0.11 | #776 (#775) | `DeepLinks.openSettings()` opens the app's own page in Settings; `DeepLinkSource.openSettings` optional | expo module / device | yes | on screen + Vitest (fake source) | yes: A8-1 (not modified) | PICK A11-1 |
| 0.11 | #767 | `liveActivity()` takes `staleDate`; layout reads `environment().isStale` | expo module | dev build | not demonstrable | no | LIST |
| 0.11 | #765 | `pushToStartToken()` for starting a Live Activity over APNs | expo module | dev build (iOS 17.2) | not demonstrable | no | LIST |
| 0.11 | #768 | `widget()` takes a `timeline`; taps collected from every entry | expo module | dev build | not demonstrable | no | LIST |

### 0.12.0 (3 rows)

| Ver | PR | What | Area | Expo Go | Shown | Lab touches | Verdict |
|---|---|---|---|---|---|---|---|
| 0.12 | #779 (#778) | DOM component page has in-memory `localStorage`/`sessionStorage` on Android | DOM components | yes, but needs `@ng-native/web` and `@angular/platform-browser` (not in the lab) | on screen if the lab had a DOM component | no | LIST |
| 0.12 | #781 (#777) | A font or image in a DOM component's stylesheet `url()` ships in a release build | DOM components (build) | n/o (release export) | not demonstrable | no | LIST |
| 0.12 | #780 | `registerViewName` takes `looseText` (an element for text written into a native view) | renderer | yes | not demonstrable: the lab registers no view | no | SKIP |

### 0.13.0 (8 rows)

| Ver | PR | What | Area | Expo Go | Shown | Lab touches | Verdict |
|---|---|---|---|---|---|---|---|
| 0.13 | #783 | A page presented from another tab refuses Android's Back while it sets `preventNativeDismiss` | router | yes (Android) | on screen (tabs lab, emulator) | no | PICK A13-8 |
| 0.13 | #785 | `NgIcon` draws `<mask>`, `<clipPath>`, `<use>` | icons | yes | on screen | A8-5 uses `NgIcon` sizes (not modified) | PICK A13-1 |
| 0.13 | #785 | `provideNgIconsConfig({ size, color, strokeWidth })` sets defaults; the input wins | icons | yes | on screen + Vitest | no | PICK A13-3 |
| 0.13 | #785 | `provideNgIconLoader` for a name no `provideIcons` has; string, promise or observable; `withCaching()` | icons | yes | on screen + Vitest | no | PICK A13-4 |
| 0.13 | #785 | `color="var(--accent)"` resolves against the tokens in scope | icons | yes | on screen + Vitest | no | PICK A13-2 |
| 0.13 | #785 | A static `aria-label` labels the icon | icons / a11y | yes | Vitest + screen reader tree | no | PICK A13-5 |
| 0.13 | #785 | With no `size`, an icon takes `--ng-icon__size` | icons | yes | on screen (layout) | no | PICK A13-6 |
| 0.13 | #785 | `stroke-dasharray="none"` is a solid line; `opacity="50%"` reads as a fraction | icons | yes | on screen | no | PICK A13-7 |

### 0.14.0 (64 rows)

Source: the 0.14.0 release note (`gh pr view <n>` for #786, #803, #819, #820, #840 to #846). Nothing below was run when it was written; the "Shown" column is what the demo will do. PICK A14-n is a case built in `src/app/demos/whats-new/` (ids A14-1 to A14-12); "PICK B" is a reserve case that is demoable in Expo Go but was not built in this round. Verdicts: PICK 28 (13 rows in cases A14-1 to A14-12, 15 PICK B reserve), TEST-ONLY 9, LIST 9, SKIP 18. Entries with several PRs, or one PR with several lines, take one row per line.

| Ver | PR | What | Area | Expo Go | Shown | Lab touches | Verdict |
|---|---|---|---|---|---|---|---|
| 0.14 | #801 | A push to a tab-bar page from a screen over the bar goes back to the bar, to that tab, with the page pushed | router | yes | on screen (tabs lab, needs a screen over the bar) | Rewards tabs, not touched | PICK B |
| 0.14 | #818 (#814) | `<native-tab>` icon as SVG markup, `[icon]="{ svg }"`, with `withSvgIcons(SvgImages)` | router / icons | yes (react-native-svg is in Expo Go) | on screen (needs a tab bar of its own) | Rewards tabs, not touched | PICK B |
| 0.14 | #803 | Unitless `line-height` in a `style` is a multiple of the font size (was points); negative dropped | styles | yes | on screen + Vitest | no | PICK A14-12 |
| 0.14 | #803 | `padding`, `margin`, `inset`, `gap` with a value per side in a `style` set each side; too many values dropped | styles | yes | on screen + Vitest | no | PICK A14-12 |
| 0.14 | #809 | Engine node's element tag is `tag`, not `name` (`EngineNode`, `StyleTarget`, ...) | renderer API | n/o | not demonstrable | no | SKIP |
| 0.14 | #807 | `<ui-picker>` works on Android (segmented row, dropdown menu) | expo ui | dev build (`@expo/ui` is not in the lab) | not demonstrable | no | LIST |
| 0.14 | #823 | `<native-tab role="search" automaticallyActivatesSearch>` makes the search tab on iOS 26.1+ | router | no: needs react-native-screens 4.29, the lab has 4.26 | not demonstrable | Rewards tabs, not touched | LIST |
| 0.14 | #821 (#813) | `<search-field>` from `@ng-native/expo/search-field` (UISearchBar / SearchView) | expo module | dev build (note: "Expo Go draws nothing for it") | not demonstrable | no | LIST |
| 0.14 | #835 | `StatusBar` `backgroundColor`/`translucent` and the `status/navigationBar*` options deprecated; a warning, no iOS warning | status bar | yes | warning in the console only | no | SKIP |
| 0.14 | #819 | A border given its width or style after its colour is drawn in that colour on Android (was black) | styles | yes (Android) | on screen | A10-5 is the same area (not modified) | PICK A14-3 |
| 0.14 | #802 | A node that leaves the tree focused or pressed is not styled that way when it returns; `inherit` follows a bound parent style | engine | yes | on screen (field removed with the keyboard up) | no | TEST-ONLY |
| 0.14 | #802 | A focused field hidden by a rule is shown again once hiding it has taken its focus | engine | yes | on screen (keyboard) | no | TEST-ONLY |
| 0.14 | #836 | A commit asks nothing about transitions until one is declared (faster restyling) | engine perf | n/o | not demonstrable | no | SKIP |
| 0.14 | #804 | `DeepLinks` reads `/--/` as a prefix only in a url's path | device | yes | Vitest (fake source) | A10-2 deep link (not modified) | TEST-ONLY |
| 0.14 | #807 | `<ui-date-picker [displayedComponents]>` works on Android | expo ui | dev build | not demonstrable | no | LIST |
| 0.14 | #805 | A shorthand the build drops is dropped whole (`padding: 8px calc(50% - 10px)`) | build | n/o (build warning) | not demonstrable | no | SKIP |
| 0.14 | #839 | A commit steps over each unchanged child (a fade among rows takes half the time) | engine perf | n/o | not demonstrable | no | SKIP |
| 0.14 | #845 | A class list is split at the spaces HTML names, not at a no-break space | engine | yes | Vitest | no | TEST-ONLY |
| 0.14 | #786 (#784) | A bound style in `em`, `rem`, `vw`/`vh`/`vmin`/`vmax` is measured as in a stylesheet; `<ng-icon size="2em">` is 2em | styles / icons | yes | on screen + Vitest (size measured) | A8-5 and A13-6 use icon sizes (not modified) | PICK A14-1 |
| 0.14 | #842 | A view with `aspect-ratio` that stretches across its line is as wide as its column | layout | yes | on screen | no | PICK A14-4 |
| 0.14 | #803 | `aria-checked="false"` as an attribute reaches native as a boolean | a11y | yes | Vitest (prop) + screen reader tree | no | PICK A14-9 |
| 0.14 | #820 | CSS system colours (`CanvasText`, `FieldText`, `ButtonText`, `GrayText`) show on Android | styles | yes (Android) | on screen | no | PICK A14-10 |
| 0.14 | #834 | On Android the app's `StatusBar` claim stays after a push or a pop (`forScreens`) | status bar | yes (Android) | on screen (two screens, icon colour) | no | PICK B |
| 0.14 | #825 | A push into another tab resolves `false` when a guard redirects | router | yes | on screen (tabs lab) | no | PICK B |
| 0.14 | #793 | A `nativeRouterLink` in a page presented over another tab leaves that page | router | yes | on screen (tabs lab) | no | PICK B |
| 0.14 | #827 | A `nativeRouterLink` to a tab nobody opened puts its first screen under the page; a query in the url is a query | router | yes | on screen (tabs lab) | no | PICK B |
| 0.14 | #789 | A root guard's redirect at launch lands before a pushed screen or a deep link | router | yes | cold start only | no | TEST-ONLY |
| 0.14 | #799 | A size transition restarted twice inside its duration is committed where it ends | engine | yes | on screen (a stepping progress bar), no observable difference | the size-transition repro says it does not touch a first start | PICK B |
| 0.14 | #791 | A page of another tab shown with `present()` puts the tab under it behind (`SCREEN_IN_FRONT`) | router | yes | on screen (tabs lab) | no | PICK B |
| 0.14 | #792 | `present()` of another tab's page at launch waits for the first screen | router | yes | cold start only | no | TEST-ONLY |
| 0.14 | #798 | `@oxc-angular/vite` 0.0.41: a template arrow function that reads its parameter compiles | build | yes | the A14 toggles use `on.update((was) => !was)` | the lab is already on 0.0.41 | TEST-ONLY |
| 0.14 | #798 | A component's `host` and `styles` can use a spread, a concatenation or a constant | build | yes | build only | no | SKIP |
| 0.14 | #798 | An unclosed `@if (on() {` is reported by the compiler | build | n/o | not demonstrable | no | SKIP |
| 0.14 | #798 | A hot update no longer patches the compiler's update module | build | n/o | not demonstrable | no | SKIP |
| 0.14 | #806 | `nx g @ng-native/nx:tailwind` keeps `@charset` first and writes a Tailwind 3 config for a library named `require` | generator | n/o | not demonstrable | no | SKIP |
| 0.14 | #806 | `nx g ... tailwind` run again keeps the first library | generator | n/o | not demonstrable | no | SKIP |
| 0.14 | #806 | `nx g ... tailwind` puts Tailwind into an existing `src/styles.css` | generator | n/o | not demonstrable | no | SKIP |
| 0.14 | #788 | An app that injects `Notifications` starts in Expo Go on Android | device | yes (Android) | on screen (no red screen) | no | PICK B |
| 0.14 | #807 | A module missing from the build is reported when the service is used, not injected; the service is inert (`available` false) | device | yes | Vitest + on screen | no | TEST-ONLY |
| 0.14 | #805 | A `templateUrl` or `styleUrl` is read when Metro starts from another directory | build | n/o | not demonstrable | no | SKIP |
| 0.14 | #805 | A dev server started again shows a template edited while it was stopped | build | n/o | not demonstrable | no | SKIP |
| 0.14 | #805 | A component whose template is only a comment builds | build | n/o | build only | no | SKIP |
| 0.14 | #805 | `@media screen and (min-width: 500px), print` keeps its other queries | styles | yes | on screen | no | PICK B |
| 0.14 | #805 | A `@font-face` url with a query or fragment bundles the file; remote or `data:` is dropped | build | n/o (font build) | not demonstrable | no | SKIP |
| 0.14 | #802 | Five stale states follow the change (`.dark .title`, `:has()` in `display: none`, endless keyframes while hidden, scroll-driven animation, custom property with `calc()`) | engine | yes | on screen | no | TEST-ONLY |
| 0.14 | #841 | The lines of a wrapping flex container with no `align-content` stretch across it | layout | yes | on screen | no | PICK A14-6 |
| 0.14 | #853 | `ngNativeWeb()` registered twice (Storybook recipe) applies once | web build | n/o | not demonstrable | no | SKIP |
| 0.14 | #843 | Text written into a view is truncated by `truncate`, `line-clamp` or `numberOfLines` on the view | text | yes | on screen | no | PICK A14-7 |
| 0.14 | #846 | A class change that brings in a `transition` with the value it eases animates from the old value | transitions | yes | on screen (screenshot loop) | A8-2, A8-3 and the size-transition repro are the same area (not modified) | PICK A14-2 |
| 0.14 | #826 | A `<native-toolbar>` ahead of a page's scroll view no longer stops the large title from collapsing | router (iOS toolbar) | dev build (toolbar needs `expo-router`'s native half, not installed) | not demonstrable | no | LIST |
| 0.14 | #795 | `@ng-native/testing`'s Node hook runs on Node 22 and early Node 24 | testing | n/o | not demonstrable | the lab's tests run on its own Node | SKIP |
| 0.14 | #828 | A `<native-header>` in a tab's page with no stack of its own does not configure the tab bar's stack screen | router | yes (Android) | on screen (tabs lab) | no | PICK B |
| 0.14 | #855 (#849) | A SwiftUI `font` modifier on an `@expo/ui` view names an app `@font-face` face | expo ui | dev build | not demonstrable | no | LIST |
| 0.14 | #817 | An icon whose shape has `opacity` or `clip-rule` no longer stops the app on Android | icons | yes (Android) | on screen | A13-1 and A13-7 draw icons (not modified) | PICK B |
| 0.14 | #844 | A `<label class="flex flex-col">` holding two `<span>` stacks them | text | yes | on screen + Vitest | no | PICK A14-8 |
| 0.14 | #862 (#848) | Presses in a `ui-bottom-sheet` keep working when a `ui-toolbar-item` comes and goes | expo ui | dev build | not demonstrable | no | LIST |
| 0.14 | #815 (#810) | A `ui-bottom-sheet` with `ui-toolbar-item`s has no empty band on iOS | expo ui | dev build (the note says Expo Go keeps the band) | not demonstrable | no | LIST |
| 0.14 | #838 | A change to opacity or transform after a native animation of it ended is drawn | transitions | yes | on screen (screenshot loop) | A8-2 (not modified) | PICK B |
| 0.14 | #816 (#812) | A `font` modifier on a segmented `ui-picker` draws its segments in that font on iOS | expo ui | dev build (the note says Expo Go cannot load it) | not demonstrable | no | LIST |
| 0.14 | #803 | A number input with a default keeps it when bound to `undefined` (`[delayLongPress]`, `[rowGap]`) | components | yes | on screen + Vitest | no | PICK A14-11 |
| 0.14 | #800 | `<native-header-item type="title">` no longer crashes a screen on Android | router | yes (Android) | on screen (needs a header item) | no | PICK B |
| 0.14 | #830 | A `<native-header-item>` written inside a component of the header shows in the bar | router | yes | on screen | no | PICK B |
| 0.14 | #840 | A `min-height` or `min-width` over a `max-height` or `max-width` wins; padding and border too | layout | yes | on screen | no | PICK A14-5 |
| 0.14 | #805 | An `@ng-icons` import in a template-literal code sample is left as text | build | n/o | not demonstrable | no | SKIP |

### Needs a development build (added)

| Ver | PR | Entry | Why Expo Go cannot |
|---|---|---|---|
| 0.11 | #766, #767, #765, #768 | Live Activity `bannerSmall`, `staleDate`, `pushToStartToken`, widget `timeline` | Live Activity / widget extension, native modules |
| 0.12 | #779, #781 | DOM component storage on Android, `url()` assets in a release build | Needs `@ng-native/web` + `@angular/platform-browser` (not in the lab); #781 is a release export |
| 0.14 | #807, #855, #816, #862, #815, #826 | `ui-picker` on Android, `ui-date-picker` `displayedComponents` on Android, a SwiftUI font modifier, the segmented picker font, bottom-sheet toolbar items and band, a toolbar before a scroll view | `@expo/ui` / `expo-router` native halves, not in the lab |
| 0.14 | #821, #823 | `<search-field>` (native code of `@ng-native/expo`, "Expo Go draws nothing for it"), `role="search"` tab (needs react-native-screens 4.29, the lab has 4.26) | dev build rebuild / newer native module |

**Status of A11-1 ... A11-3 and A13-1 ... A13-8 (built in `feat/whats-new-0-11-0-13`, run on iOS and Android):** A11-2, A13-1 to A13-7 verified on both; A13-8 verified on Android (Back is Android only). A11-1 caveat (Android opens Expo Go's App info; the iOS simulator opens the top-level Settings list, not an Expo Go page). A11-3 caveat (the url goes to org 2's first page, but the Library tab drew org 1's stale Album x page together with the Library page). 0.12.0 has no section. See the README, "What's new".

**Status of A14-1 ... A14-12 (built in `feat/whats-new-0-14`, run on iOS and Android):** A14-1, A14-4 to A14-9, A14-11 and A14-12 verified on both; A14-3 and A14-10 verified on Android (the claim is Android only). A14-2 (#846) caveat: opacity and transform ease on both platforms, `width` does not (the bar is at its end width in the first capture after the press, in both lanes, with and without `transition: none` before), the same snap as the size-transition repro. A14-3 side observation: `border-style: dashed` given later is drawn solid on Android, dashed on iOS. The 0.14 section of `.maestro/whats-new.yaml` passed 3 of 3 on each platform. See the README, "What's new".

## Addendum: ng-native 0.15.0

Date: 2026-10-16. The lab is on 0.15.0 (`bfecb81`). Same method and legend as above, with the verdict `PICK` meaning BUILD (a live case in `src/app/demos/whats-new/`, ids A15-1 to A15-10), `PICK B` a reserve case that is demoable in Expo Go but was not built in this round, and `LIST` an entry that needs a new npm package or a development build. Nothing below was run when it was written; the "Shown" column is what the demo will do. The 0.15.0 note is all fixes (47 rows from 27 entries; a sub-bullet is a row). Verdicts: PICK 11 rows in 10 cases, PICK B 3, TEST-ONLY 6, LIST 9, SKIP 16, card update 2 (the #902 row and the #885 row, which change cards that already exist: A8-2, A14-2 and A9-1). Total 47.

Facts about the lab that shape this addendum:
- No package is installed for a case. `@expo/ui`, `expo-camera`, `expo-video`, `expo-blur` and `@ng-native/web` are not in `package.json` and the task rules out `npm install`, so every entry that needs one is LIST with that reason, even where Expo Go carries the native half (`node_modules/expo/bundledNativeModules.json` lists `@expo/ui`, `expo-camera`, `expo-video`, `expo-blur`).
- `NavigationBar` (#907) needs no install: `@ng-native/device` reaches `expo-navigation-bar`'s native module by the name `ExpoNavigationBar` (`navigation-bar.js` line 22), and the bundled module list of Expo SDK 57 carries `expo-navigation-bar ~57.0.3`, so Expo Go has it. `expo-navigation-bar` is not in `node_modules`, and does not need to be. To confirm on the emulator, not assumed.
- `<markdown>` is already used (A6-2, A7-6) and `marked` is installed, so the three Markdown entries need nothing new. The `data:` image (#905) is a base64 PNG written into the case.
- Three cards that already exist are made out of date by this release: A9-1 (#882 fixed), A8-2 and A14-2 (#883 fixed on Android only, per the README's "Upgrading to 0.15.0"). They are updated, not rebuilt.

### Proposed cases (PICK)

| Id | Entries | Demo sketch | Observable proof |
|---|---|---|---|
| A15-1 | #866 | Swatches bound with `[style.backgroundColor]` to `color-mix(in srgb, var(--brand), white 20%)` and to `color(from var(--brand) srgb r g b)`, with `--brand` set on the view around them and changed by a button; one relative colour with `clamp()`. | Each swatch is the colour worked out from the token and follows it. Before: the text reached native and nothing was painted. |
| A15-2 | #903 (#858) | A multiline `<text-input [rows]>` with `(keyPress)`, `(scroll)` and `(contentSizeChange)` counters. | On Android each counter moves when typing, scrolling a long text and growing the text; iOS is unchanged (its `contentSizeChange` comes when the field resizes). Android only claim for the three events. |
| A15-3 | #865 (#850) | A `<markdown source>` table with a long cell, wider than the card. | The table scrolls sideways and the columns are as wide as their widest cell; before, every column was squeezed into the page's width. |
| A15-4 | #867 (#851) | A `<markdown [streaming]>` fed a chunk at a time by a timer, with a code span, a link and a fence cut in the middle of a chunk; a button restarts it. | While streaming, the open span, link and fence opening line are held back rather than drawn as raw text; when it ends, the whole source is drawn. |
| A15-5 | #905 | `<markdown>` with a base64 `data:image/png` image and an SVG `data:` image. | The PNG is drawn; the SVG `data:` url is still its alt text. |
| A15-6 | #907 (#831) | Buttons that `NavigationBar.set()`/`push()` a style and `hidden`, with a readout of `state()`. | Android: the bar is hidden until a swipe; the buttons' colour follows `style` on three-button navigation. iOS: the `state` readout changes and nothing else. |
| A15-7 | #863 | A card styled by `.card:has(.x:is(.p *, .y))` with a child that matches only one alternative. | The card matches on either alternative (the old behaviour needed both). |
| A15-8 | #880 | A component with `:host:has(.on)` in its own styles and a button that adds `.on` to a child. | The host's style follows the change beneath it, where it kept what it matched before. |
| A15-9 | #876 | A box mounted on a press, with a class added by its own `effect` and a 3 s `transition: opacity`. | The box appears at once; before it faded in from transparent. |
| A15-10 | #864 | A `[svg]` icon with `fill="var(--typo)"` where no token `--typo` exists, beside a good one. | The app stays up and the shape is drawn with no paint of its own. |

### 0.15.0 (47 rows)

Source: the 0.15.0 release note (ng-native/ng-native releases). Entries with several lines take one row per line.

| Ver | PR | What | Area | Expo Go | Shown | Lab touches | Verdict |
|---|---|---|---|---|---|---|---|
| 0.15 | #866 | A colour bound as a style and made of tokens, `color-mix(in srgb, var(--brand), white 20%)` or `color(from var(--brand) srgb r g b)`, is worked out where it is used | styles | yes | on screen + Vitest | A13-2 colour from `var()` (not modified) | PICK A15-1 |
| 0.15 | #866 | The channels of a relative colour use `min()`, `max()`, `clamp()`; `color()` in `srgb` is worked out too | styles | yes | on screen | no | PICK A15-1 |
| 0.15 | #875 (#852) | `ui-bottom-sheet` takes `backgroundColor` / CSS `background-color` as the sheet's colour (iOS 26 glass sheet made opaque) | expo ui | dev build (`@expo/ui` is not in the lab, no install) | not demonstrable | no | LIST |
| 0.15 | #875 | `Engine` gains `takePaint` | renderer API | n/o | not demonstrable | no | SKIP |
| 0.15 | #912 (#899) | A `<ui-slot name="header">` / `footer` in a `ui-section` is the section's header or footer on iOS | expo ui | dev build (`@expo/ui`) | not demonstrable | no | LIST |
| 0.15 | #912 | A `title` wins over a header slot; an empty `title=""` counts as unset | expo ui | dev build (`@expo/ui`) | not demonstrable | no | LIST |
| 0.15 | #901 (#895) | `<text-input rows>` is an input: no "has no prop 'rows'" in development, `rows` is not sent to native | components | yes | console only; the field in A15-2 is sized by `[rows]` | A6-3 multiline rows (not modified) | TEST-ONLY |
| 0.15 | #903 (#858) | `(scroll)`, `(keyPress)` on a `<text-input>` and `(contentSizeChange)` on a multiline one fire on Android | components (Android) | yes (Android) | on screen (counters) | no | PICK A15-2 |
| 0.15 | #903 | iOS is unchanged; the input docs say so | components | n/o | docs | no | SKIP |
| 0.15 | #864 | An SVG shape whose `fill` or `stroke` has a colour React Native cannot read is drawn with no paint instead of stopping the app | icons | yes (`react-native-svg` is installed) | on screen | A13-1 and A13-7 draw icons (not modified) | PICK A15-10 |
| 0.15 | #891 (#884) | On Android, an `<ng-icon>` that loses a `pointer-events` it had (a parked and reused `<virtual-list>` row) no longer stops the app with a NullPointerException | icons (Android) | yes (Android) | a list scrolled fast, no crash; needs the right rows to reproduce | `src/app/repro/` has no icon repro | PICK B |
| 0.15 | #891 | A `pointerEvents` that goes away is committed as `auto`, not `null`, on every view | engine | yes | Vitest (prop) | no | TEST-ONLY |
| 0.15 | #916 (#913) | On Android a native stack screen keeps a `statusBarStyle` / `statusBarHidden` its host binding set to the same value the `StatusBar` claim carries | status bar (Android) | yes (Android) | on screen (two screens, icon colour) | no | PICK B |
| 0.15 | #902 (#883, #859) | A CSS transition of a size or a place and a `@keyframes` size animation animate on Android where layout animations are off (always in Expo Go) | transitions | yes | screenshot loop | A8-2, A14-2 and `src/app/repro/size-transition` | card update (A8-2, A14-2) |
| 0.15 | #902 | `getFabricUIManager()` reads the layout-animation flag and eases from JavaScript | engine | n/o | not demonstrable | no | SKIP |
| 0.15 | #893 (#890) | `<search-field>` draws its text in the CSS `font-family`, `font-size`, `font-weight`, `font-style` | expo module | dev build (note on 0.14: "Expo Go draws nothing for it") | not demonstrable | no | LIST |
| 0.15 | #893 | On iOS a system font over about 21px needs a height on the field | expo module | dev build | not demonstrable | no | LIST |
| 0.15 | #904 | A size transition restarted twice before it ends is committed where it ends from the third start; each step is drawn at once | engine perf | yes | a stepping bar; the note says it departs from CSS | the size-transition repro | SKIP |
| 0.15 | #888 | A prop no rule asks of an element before another no longer restyles every element after it | engine perf | n/o | not demonstrable | no | SKIP |
| 0.15 | #888 | A global sheet that asks about a prop that way restyles rows after it only while it is added | engine perf | n/o | not demonstrable | no | SKIP |
| 0.15 | #892 (#886) | A destroyed `<native-stack-outlet>` / `<native-tabs-outlet>` clears its route's context only while it is its own (a sheet over the tab bar swiped away) | router | yes | on screen (tabs lab; a sheet with its own stack over the tab bar, swiped away) | the tabs lab has a presented page without a stack of its own | PICK B |
| 0.15 | #885 (#882) | An ICU plural or select, or an element in an `i18n` message, renders on iOS and Android in development | i18n | yes | on screen | A9-1 | card update (A9-1) |
| 0.15 | #885 | `mount()` makes whichever `Node` is on the global answer `true` for engine nodes | engine | n/o | not demonstrable | no | SKIP |
| 0.15 | #876 | A class added to a view before a frame has drawn it no longer starts a transition | transitions | yes | on screen (a box mounted on a press) | A14-2 and A7-4 are the same area (not modified) | PICK A15-9 |
| 0.15 | #907 (#831) | `NavigationBar` in `@ng-native/device`: `set()`, `push()`, `state`; `style` light / dark / auto, `hidden` | device (Android) | yes (`expo-navigation-bar` is bundled in Expo Go, see the facts above) | on screen (Android bar) | no | PICK A15-6 |
| 0.15 | #907 | Without the module, and on iOS, the web and in Node, claims are kept in `state` and change nothing | device | yes | Vitest + readout on iOS | no | TEST-ONLY |
| 0.15 | #907 | `EngineNode` gets an optional `writes` set; the outlet keeps a page's own `navigationBarHidden` | renderer API | n/o | not demonstrable | no | SKIP |
| 0.15 | #865 (#850) | A `<markdown>` table wider than the page scrolls sideways, each column as wide as its widest cell (up to 280pt) | markdown | yes | on screen | A6-2 has a table in a post (not modified) | PICK A15-3 |
| 0.15 | #865 | A table is a horizontal `scroll-view`, a cell a `view`, so a custom `th`/`td` class styles the text | markdown | yes | Vitest | no | TEST-ONLY |
| 0.15 | #867 (#851) | `<markdown streaming>` keeps the blocks before the last and holds back a code span, emphasis, link, image, table row or fence opening line | markdown | yes | on screen | no | PICK A15-4 |
| 0.15 | #867 | While streaming only the last block is lexed again; a block that did not change keeps its native views | markdown perf | yes | Vitest | no | TEST-ONLY |
| 0.15 | #905 | `<markdown>` draws a base64 `data:` url of a raster picture (PNG, JPEG, GIF, WebP); other `data:` urls and schemes stay alt text | markdown | yes | on screen | no | PICK A15-5 |
| 0.15 | #900 (#894) | A dev bundle no longer fails, and an edit hot-swaps, when a shared `styleUrl`/`templateUrl` component has an aliased `@if (x; as y)` or a `@switch` | build | n/o | not demonstrable | no | SKIP |
| 0.15 | #900 | Only an error from the compiler stops a hot update; a warning does not | build | n/o | not demonstrable | no | SKIP |
| 0.15 | #863 | A `:has()` argument list with an ancestor test, `.card:has(.x:is(.p *, .y))`, matches either alternative | styles | yes | on screen | no | PICK A15-7 |
| 0.15 | #863 | A `:has()` inside a `:has()` is dropped with a warning | build | n/o (build warning) | not demonstrable | no | SKIP |
| 0.15 | #877 | A change under many `:has()` rules walks each box's subtree once | engine perf | n/o | not demonstrable | no | SKIP |
| 0.15 | #881 | A change beneath a box checks its `:has()` rules again without matching everything under it again | engine perf | n/o | not demonstrable | no | SKIP |
| 0.15 | #881 | Opening a dialog under the root with a class on the root changing no longer matches every element again | engine perf | n/o | not demonstrable | no | SKIP |
| 0.15 | #869 | `deepLinkSource()` is exported from `@ng-native/device` | device | yes | Vitest (import) | A10-2 deep link (not modified) | TEST-ONLY |
| 0.15 | #878 | `registerExpoViews('expo-video')` registers `SurfaceVideoView` on Android; `'expo-blur'` registers `ExpoBlurView`; `viewName` takes `{ ios, android }` | expo views | dev build (`expo-video` and `expo-blur` are not in the lab, no install) | not demonstrable | no | LIST |
| 0.15 | #878 | `videoPlayer()` gives the shared-object `id`; bind `[player]="player.id"` | expo views | dev build (`expo-video`) | not demonstrable | no | LIST |
| 0.15 | #898 (#897) | A font or an image a DOM component's stylesheet names in a relative `url()` loads in development | DOM components | no (`@ng-native/web` and `@angular/platform-browser` are not in the lab) | not demonstrable | no | LIST |
| 0.15 | #880 | A class changing restyles only what a class-attribute test or a `:has()` naming it can reach | engine perf | n/o | not demonstrable | no | SKIP |
| 0.15 | #880 | A `:has()` such as `.p-floatlabel:has([class^='p-'][class$='-fluid'])` no longer restyles the screen on a root class | engine perf | n/o | not demonstrable | no | SKIP |
| 0.15 | #880 | A `:has()` in a component's own styles, `:host:has(.on)`, follows a change beneath the host | styles | yes | on screen | no | PICK A15-8 |
| 0.15 | #879 | `Camera.record(options)` and `stopRecording()` record video | device | dev build (`expo-camera` is not in the lab, no install) | not demonstrable | no | LIST |

Totals: PICK 11 + PICK B 3 + TEST-ONLY 6 + LIST 9 + SKIP 16 + card update 2 = 47.

### Needs a development build or a new package (added)

| Ver | PR | Entry | Why Expo Go (with this `package.json`) cannot |
|---|---|---|---|
| 0.15 | #875, #912 | `ui-bottom-sheet` colour, `ui-section` header and footer slots | `@expo/ui` is not in the lab and `npm install` is out of scope for this round |
| 0.15 | #893 | `<search-field>` font | Native code of `@ng-native/expo` ("Expo Go draws nothing for it", 0.14 note) |
| 0.15 | #878 | `registerExpoViews('expo-video' / 'expo-blur')`, `videoPlayer().id` | `expo-video` and `expo-blur` are not installed |
| 0.15 | #898 | DOM component `url()` assets | `@ng-native/web` and `@angular/platform-browser` (AGENTS.md rules the latter out) |
| 0.15 | #879 | `Camera.record()` | `expo-camera` is not installed (and the iOS simulator has no camera) |
