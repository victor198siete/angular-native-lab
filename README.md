# Angular Native Lab

A public lab of [Angular Native](https://ng-native.com) demos: Angular components
rendered as real native iOS and Android views on Expo, with no WebView. Each tab in
the app is a self-contained demo using mock data.

> **Resumen en español:** Laboratorio público de demos de Angular Native (ng-native).
> Cada tab es una demo independiente con datos mock: sin backend ni llaves de API.
> Cada demo documenta la versión de ng-native con la que se probó, qué funcionó y qué
> falló, con el error literal. Se clona y se corre en el simulador de iOS en unos
> cinco minutos.

⚠️ Angular Native is in **alpha**. This repo is pinned to an exact version and
documents what breaks; it is not a production guide.

## Tested versions

| Package | Version |
|---|---|
| @ng-native/* | 0.3.0 |
| Angular | 22 |
| Expo | 57 |
| React Native | 0.86.3 |
| Node | 22 |

## Getting started

Requirements: Node 22 and Xcode with an iOS simulator (or Expo Go on your phone).

    git clone https://github.com/victor198siete/angular-native-lab.git
    cd angular-native-lab
    npm install
    npm run ios        # iOS simulator
    npm start          # or scan the QR code with Expo Go

Tests and type checking (run in Node, no simulator needed):

    npm test
    npm run typecheck

## Demos

| Tab | What it shows | Status |
|---|---|---|
| Rewards | Signals + `computed()`, Router with native tabs, Tailwind v4 with `dark:`, a 200-item virtual list, Lucide icons | In progress |
| Forms | Signal Forms on native inputs | Planned |
| Device | Theme, network, safe areas and location as signals | Planned |
| Vault | Secure storage + Face ID / fingerprint | Planned |
| Lists | 200 vs 2,000 items | Planned |

### Rewards

- **What was tested:** _(filled in once the port is done)_
- **What worked:** _(…)_
- **What failed:** _(literal error, version, and whether there was a fix)_
- Capture: `docs/rewards.gif`

## Why this exists

This repo backs my posts about Angular Native on
[LinkedIn](POST_URL). Each post links to the demo that supports it.

## Credits

- [Ashley Hunter](https://github.com/ashley-hunter), creator of Angular Native.
- The app starts from the [`@ng-native/template`](https://www.npmjs.com/package/@ng-native/template) template.

## License

MIT © 2026 Víctor Moreno
