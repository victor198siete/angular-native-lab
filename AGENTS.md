# AGENTS.md

This is an Angular app rendering real native iOS and Android views with
[Angular Native](https://ng-native.com): Angular components on React Native's Fabric renderer,
inside an Expo app. It is not a web app and not React: there is no DOM and no JSX.

The whole documentation, for reading before a change: https://ng-native.com/llms-full.txt. An
outline with a line per page: https://ng-native.com/llms.txt.

Angular's own rules apply as well: https://angular.dev/assets/context/best-practices.md. Its
browser-only parts do not: there is no `NgOptimizedImage` (use `<image>`), and no AXE
(accessibility is the props below). Where the two disagree, this file wins.

## Commands

```sh
npm start           # Metro; press i or a for a simulator, or scan the QR code with Expo Go
npm run ios         # the iOS simulator
npm run android     # the Android emulator
npm test            # Vitest, in Node against a fake native layer: no simulator needed
npm run typecheck
```

`src/main.ts` mounts the root component, `src/app/app.ts`. Run `npm test` and `npm run typecheck` after a
change; both are fast.

## Rules that are easy to get wrong

- **Element names are lowercase:** `<view>`, `<text>`, `<pressable>`, `<scroll-view>`,
  `<text-input>`, `<image>`, `<switch>`, `<safe-area-view>`, `<virtual-list>`, `<modal>`. Each is
  imported from `@ng-native/components` into the component's `imports`, like any Angular
  component: `imports: [View, Text]`. `<View>` compiles to an empty template, and an element used
  without its import renders as a plain view.
- **There is no DOM.** No `document`, no `window`, no `<div>`, `<span>`, `<button>` or `<input>`,
  no `@angular/platform-browser`, and no `@angular/animations`. Use the native elements above.
- **A component's host is a flex item.** `<app-case-list />` commits as a view of its own, with no
  `flex`, so a `flex: 1` scroll view inside it gets a height of zero and shows nothing. A component
  that fills the space it is given sets `host: { style: 'flex: 1' }` (or `:host { flex: 1; }`).
- **Text only renders inside `<text>`.** `<view>Hello</view>` compiles and shows nothing.
- **Events are native:** `(press)` on `<pressable>`, not `(click)`; `[(value)]` or `(changeText)` on
  `<text-input>`; `(scroll)`, `(layout)`. A pressable text is `<text pressable (press)="...">`.
- **Signals, zoneless, AOT.** State is signals and `computed()`; there is no zone.js, so nothing
  updates from a plain field changing outside a signal or an event.
- **No backticks inside an inline template**, even in an HTML comment: they end the template string
  and the build fails with a misleading parse error.
- **Accessibility is props:** `accessibilityRole="button"`, `accessibilityLabel`,
  `[accessibilityState]`. The web spellings work too, as aliases: `role`, and the `aria-*` names
  React Native maps (`aria-label`, `aria-checked`, `aria-hidden` and so on). Screen readers and
  the testing library's `getByRole` both read them.

## Styling

- `[style]` takes a React Native style object: camelCase keys, numbers in points
  (`{ padding: 16, backgroundColor: '#fff' }`).
- A component's `styles` is real CSS, compiled at build time: type, class, id and attribute
  selectors, combinators, `:host`, `@media`, custom properties, transitions and `@keyframes`.
  Grid, float, `::before`/`::after`, `:hover` and `:focus-visible` are dropped with a build
  warning naming the file, line and reason - lay out with flexbox, and drive a hover or focus look
  from a bound attribute. Everything is `display: flex`
  with `flex-direction: column` by default, as in React Native.
- Tailwind v4 works through `@ng-native/tailwind`, with `ios:`, `android:` and `dark:` variants.

## Lists, navigation, forms

- A long list is `<virtual-list>`: `@for (row of list.window(); track row.slot)` recycles rows as
  they scroll. `<scroll-view>` renders everything, so keep it for short content.
- Navigation is `@angular/router` on native stacks and tabs: `provideNativeRouter(routes)` from
  `@ng-native/router` in `mount`'s `providers`, and `<native-stack-outlet />` in a template. Add
  `withComponentInputBinding()` from `@angular/router` for route params to arrive as inputs, in
  tests too.
- Forms are Signal Forms (`@angular/forms/signals`), with `[formField]` on `<text-input>` and
  `<switch>`.
- HTTP needs `provideNativeHttpClient()` from `@ng-native/platform/http`, not `provideHttpClient()`.

## Tests

`app.test.ts` shows the shape: `render(Component)`, then query with `screen.getByRole`,
`getByText` or `getByTestId` (which matches `nativeID` and `testID`), and act with
`userEvent.setup().press(...)` or `.type(...)`, all from `@ng-native/testing`. Tests run in Node
with no simulator, so write one alongside a change.
