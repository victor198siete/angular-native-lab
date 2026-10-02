# Angular Native Lab

A public lab of [Angular Native](https://ng-native.com) demos: Angular components
rendered as real native iOS and Android views on Expo, with no WebView. Each demo
uses mock data and documents what worked and **what failed**, with the literal error.

> **Resumen en español:** Laboratorio público de demos de Angular Native (ng-native).
> Cada demo usa datos mock (sin backend ni llaves de API) y documenta con qué versión se
> probó, qué funcionó y qué falló, con el error literal. La app está en inglés y en
> español: sigue el idioma del teléfono y tiene un botón EN/ES. Se clona y se corre en
> el simulador de iOS en unos cinco minutos.

⚠️ Angular Native is in **alpha**. This repo is pinned to exact versions and documents
what breaks; it is not a production guide. Everything below was tested on **iOS only**.

<p>
  <img src="docs/rewards.gif" width="280" alt="The Rewards demo switching from English to Spanish, then filtering the catalog" />
  &nbsp;&nbsp;
  <img src="docs/rewards-dark.png" width="280" alt="The Rewards wallet in dark mode, in Spanish" />
</p>

## Tested with

| | Version |
|---|---|
| `@ng-native/*` | 0.3.0 |
| Angular | 22.2.1 |
| Expo SDK | 57 (`expo` 57.0.26) |
| React Native | 0.86.3 |
| TypeScript / Vitest | 6.0.3 / 5.0.3 |
| Node | 22.22.3 |
| Device | iOS 27 simulator (iPhone 18 Pro), Xcode 27, Expo Go |

## Getting started

Requirements: Node 22 (22.18 or later) and Xcode with an iOS simulator, or Expo Go on
your phone. No development build is needed: everything here runs in Expo Go.

```sh
git clone https://github.com/victor198siete/angular-native-lab.git
cd angular-native-lab
npm install
npm run ios        # opens the iOS simulator with Expo Go
npm start          # or scan the QR code with Expo Go on your phone
```

Checks that run in Node, with no simulator:

```sh
npm test               # Vitest against ng-native's fake native layer (56 tests)
npm run typecheck      # ngc with strict templates
npm run i18n:check     # every translation matches the extracted messages
npm run i18n:extract   # re-extract src/locale/messages.json from a Metro bundle
```

## Demos

| Demo | What it shows | Status |
|---|---|---|
| [Rewards](#rewards) | Signals + `computed()`, Router with native tabs, Tailwind v4 with `dark:`, a 200-item `<virtual-list>`, Lucide icons | ✅ iOS |
| [i18n (EN/ES)](#i18n-enes) | Angular's own i18n at runtime, device language, an in-app switch, localized numbers, dates and mock data | ✅ iOS |
| Forms | Signal Forms on native inputs | Planned |
| Device | Theme, network, safe areas and location as signals | Planned |
| Vault | Secure storage + Face ID / fingerprint | Planned |
| Lists | 200 vs 2,000 items | Planned |

### Rewards

A loyalty-program demo: a wallet with an animated balance and tier progress, a catalog
of 200 rewards with category filters, a history grouped by day and a reward detail with
a redeem sheet. It was first built on ng-native 0.1.1 for the LinkedIn post below and
ported here to 0.3.0. Brands and merchants are fictional.

**What was tested:** the four screens on native tabs and a native stack, the
`:id` route param bound as an input, a redemption end to end (sheet, balance, history,
voucher code), the category filter on the virtual list, scrolling, and the dark-mode
toggle, which also restyles the native tab bar.

**What worked**

- The state layer (models, mocks, a `RewardsStore` built on signals and `computed()`)
  moved from 0.1.1 to 0.3.0 **without changing a line**, tests included.
- The UI components and screens also compiled and ran on 0.3.0 as they were.
- Tailwind v4 with `dark:`, `@ng-native/icons` with `@ng-icons/lucide`, and
  `<virtual-list>` behaved the same as on 0.1.1.
- Component tests run in Node with `@ng-native/testing`: no simulator in CI.

**What failed or needed work**

- **The 0.3.0 template no longer ships** `@ng-native/router`, `@ng-native/tailwind` or
  `@ng-native/icons`. They have to be installed (and pinned) by hand, along with
  `react-native-screens` and `react-native-svg` through `npx expo install`. Its
  `src/main.ts` also gained an `import 'expo'` the 0.1.1 one did not have.
- Metro warns once at startup. It is harmless, but it is there:
  ```
  [angular-native] .visible (Tailwind): dropped 'visibility': 'visibility' has no React
  Native equivalent: no style prop of a native view does what it does. Use opacity: 0 to
  hide a box and keep its space, or display: none to remove it.
  ```
- In development, each tab is **blank for 2–3 seconds the first time it opens** while
  Metro bundles that lazy route (2.6 s for the catalog). A release build was not tested.
- My own mistake, not ng-native's: moving a file during the port broke an import,
  `TS2307: Cannot find module '../../core/theme.ts'`. Typecheck caught it.
- Expo Go draws a floating tools button over the top-right corner of the app. It can be
  hidden from its developer menu ("Tools button").

### i18n (EN/ES)

English is the source language; Spanish is a translation. The app picks the language
saved in the app, then the phone's languages in order, then English. It follows
[ng-native's localization guide](https://ng-native.com/guide/localization): Angular's
`i18n` and `$localize`, messages extracted from the Metro bundle with
`localize-extract`, and translations loaded with `loadTranslations()` before the first
frame.

**What was tested:** 79 messages (templates, accessibility labels and computed strings),
the phone in English and in Spanish, the EN/ES button, a cold start after switching,
and numbers, dates and mock data in both languages.

**What worked**

- Runtime translation in Expo Go: one build carries both languages.
- Numbers and dates through Angular's locale data and `LOCALE_ID`: `12,480` /
  `12.480`, `$124.80` / `$124,80`, `30 Sep` / `30 sept`.
- **Switching language with `reloadAppAsync()` works in Expo Go on the iOS simulator.**
  The guide marks it as unverified on a device. The choice is saved with
  `expo-secure-store` and survives closing the app.
- `localize-extract` on an unminified Metro bundle extracted all 79 messages;
  `npm run i18n:check` compares every translation with them.
- The Babel pin the guide asks for held: Babel 8 only appears under
  `@angular/localize` and `@angular/compiler-cli`; React Native stays on 7.29.7.

**What failed or needed work**

- A Vitest test that imports a file which imports `expo-secure-store` or
  `@ng-native/expo/locale` fails before any test runs:
  ```
  RolldownError: Parse failure: Parse failed with 1 error:
  Flow is not supported
  At file: /node_modules/react-native/index.js:1:0
  ```
  Fix: keep native imports out of what components and tests import. Here
  `language.ts` is pure, `localization.ts` holds the native providers, and the switch
  reaches the native side through an injection token (`LANGUAGE_RESTART`).
- Rendering with `LOCALE_ID` set to `es` before registering its locale data:
  ```
  NG0701: Missing locale data for the locale "es".
  ```
  Fix: `registerLocaleData(localeEs)` next to the translations, so whatever loads one
  loads the other.
- A test that created a `providedIn: 'root'` token through `Injector.create()`:
  ```
  NG0201: No provider found for `InjectionToken REWARDS_SOURCE`.
  ```
  That is Angular, not ng-native: a root token needs a root injector. The check moved to
  a component test.
- **Not tested, avoided by design:** ICU plurals and selects, and `i18n-` attributes.
  The guide documents both as broken, so this app uses `$localize` strings instead.
- `$localize` at module level runs before the translations load and stays in English.
  Tier and category names are translated inside functions for that reason.

## Not tested yet

Android, a release build, a physical device and any performance measurement. Nothing
in this README claims performance numbers.

## Project structure

```
src/
  main.ts                    mounts the app: router, Tailwind, localization
  locale/                    messages.json (extracted) and messages.es.json
  app/
    app.routes.ts            the app opens straight into the Rewards demo for now
    core/                    shared by every demo: theme, i18n
    demos/rewards/           core (models, mocks, store), shared UI, features, shell
```

## Notes

- `npm audit` reports 13 vulnerabilities (8 moderate, 5 high), all inside Expo's own
  tooling (`@expo/cli`, `@expo/config`, `node-forge`, `uuid`, `xcode`). They come with
  Expo SDK 57; `npm audit fix --force` would break the pinned versions, so they are left
  as they are.
- Mock data only: no backend, no API keys, no environment files.

## Why this exists

This repo backs my posts about Angular Native on
[LinkedIn](https://lnkd.in/p/eQYqFj7e). Each post links to the demo that supports it.

## Credits

- [Ashley Hunter](https://github.com/ashley-hunter), creator of Angular Native
  ([ng-native/ng-native](https://github.com/ng-native/ng-native)).
- The app starts from the
  [`@ng-native/template`](https://www.npmjs.com/package/@ng-native/template) template.

## License

MIT © 2026 Víctor Moreno
