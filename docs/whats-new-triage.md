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

**Status of A8-1 ... A8-6 (built in `feat/whats-new-0-8`, run on iOS and Android):** A8-1, A8-3, A8-4, A8-5 and A8-6 verified on both (A8-1 by a Settings round trip with the same process alive; A8-6's nested `@media` half, `md:max-lg:`, not tried on a phone). A8-2 not as described: the opacity and transform tile moves through Block JS, but the width and height tile, alone in its commit, stays still for the block and jumps after it; the pair tile was not run. See the README, "What's new".

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

### Needs a development build (added)

| Ver | PR | Entry | Why Expo Go cannot |
|---|---|---|---|
| 0.11 | #766, #767, #765, #768 | Live Activity `bannerSmall`, `staleDate`, `pushToStartToken`, widget `timeline` | Live Activity / widget extension, native modules |
| 0.12 | #779, #781 | DOM component storage on Android, `url()` assets in a release build | Needs `@ng-native/web` + `@angular/platform-browser` (not in the lab); #781 is a release export |

**Status of A11-1 ... A11-3 and A13-1 ... A13-8 (built in `feat/whats-new-0-11-0-13`, run on iOS and Android):** A11-2, A13-1 to A13-7 verified on both; A13-8 verified on Android (Back is Android only). A11-1 caveat (Android opens Expo Go's App info; the iOS simulator opens the top-level Settings list, not an Expo Go page). A11-3 caveat (the url goes to org 2's first page, but the Library tab drew org 1's stale Album x page together with the Library page). 0.12.0 has no section. See the README, "What's new".
