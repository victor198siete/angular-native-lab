# Reproduction attempt: ng-native#357

[ng-native/ng-native#357](https://github.com/ng-native/ng-native/issues/357) — *"tailwind: the
--watch child never rebuilds the sheet after startup"*.

> **Resumen en español:** Este lab usa **Tailwind 4.3.3**. Intentamos reproducir el #357 en el lab
> tal como está (corrida A) y, como el issue es con Tailwind 3.4.19, también en una **copia temporal**
> del lab con esa versión (corrida B), fuera del repo y ya descartada. **En nuestro entorno el watcher no se atoró**: cada clase nueva reescribió el CSS en
> el mismo segundo y llegó al simulador. **Esto no descarta el bug**: probamos con **npm** (el issue
> usa **pnpm**) y con **Node 22** (el issue usa **Node 24**), y sin el preset en TypeScript. Esas
> diferencias quedan como sospechosas.

**This lab runs Tailwind 4.3.3.** Run B used a throwaway copy on Tailwind 3.4.19 only because the
issue reports 3.4.19; nothing in this repo was changed to Tailwind 3.

**Date:** 2 Oct 2026. **Result:** not reproduced, in an environment that differs from the issue's
in package manager, Node version and preset format (see [the caveat](#what-this-does-not-show)).

## Environment

| | This attempt | Issue #357 |
|---|---|---|
| `@ng-native/metro` / `@ng-native/tailwind` | 0.3.0 / 0.3.0 | 0.3.0 / 0.3.0 |
| Tailwind — **this lab (Run A)** | **`tailwindcss` 4.3.3 + `@tailwindcss/cli` 4.3.3**, CSS-first (`@import`s, no `content`) | — |
| Tailwind — throwaway copy (Run B) | `tailwindcss` 3.4.19, `tailwind.config.js` with `content` as an absolute glob | 3.4.19, `content` as absolute globs, preset in TypeScript |
| **Package manager** | **npm** | **pnpm** (workspace) |
| **Node** | **22.22.3** | **24** |
| Expo | SDK 57 (`expo` 57.0.26) | SDK 57 |
| OS | macOS 27.0 (26A428) | macOS |
| Device | iOS 27 simulator (iPhone 18 Pro), Expo Go | — |
| `CI` env var | unset | not stated |

## How the watcher is started

From `node_modules/@ng-native/tailwind/config.cjs` (0.3.0), read only:

- Loading `metro.config.js` builds once without `--watch` (`execFileSync`, line 61).
- Then, if `watchesByDefault()` allows it, it spawns the CLI with `--watch` (line 267):
  `spawn(process.execPath, [cli, '-i', input, '-o', css, '--watch'], { cwd: projectRoot, stdio: ['pipe', 'ignore', 'ignore'] })`,
  calls `unref()`, and polls the CSS with `watchFile` every 200 ms to regenerate the `.js` module.
- **`watchesByDefault()` (lines 86–92) starts no watcher at all when `CI` is set** (to anything but
  `false` or `0`), for `export`/`bundle`/`prebuild`, and for `node metro.config.js`. Running
  `CI=1 npx expo start` therefore never has a watcher. That is a different symptom from the issue's
  (there the child is alive), but worth ruling out.

## Method

1. Start `npx expo start` **without `CI`**, open the app in Expo Go on the simulator.
2. Read the child's exact command with `ps`, and the modification time of
   `.angular-native/app.tailwind.css` and `.js`.
3. Add a class that exists nowhere else in the project to a template, save, and for 10–12 seconds
   check: the mtime of both files, whether the class is in the generated CSS, whether the child is
   still alive, and the simulator.
4. Repeat in a second and a third file; the third after the child had run for 5 minutes.
5. Revert each edit and check again.

Nothing was changed in `node_modules` or in ng-native. This repo stayed on Tailwind 4 throughout.

## Run A — this lab (Tailwind 4.3.3)

Child command (`ps`):

```
node …/node_modules/@tailwindcss/cli/dist/index.mjs -i …/src/styles.css -o …/.angular-native/app.tailwind.css --watch
```

| # | Child uptime | File | New class | CSS / JS rewritten | Class in CSS | Simulator |
|---|---|---|---|---|---|---|
| — | 0:00 | (startup) | — | 16:43:23 / 16:43:23 | — | — |
| 1 | ~2 min | `wallet.screen.ts` | `text-fuchsia-700` | **16:45:42 / 16:45:42** (edit at 16:45:42) | yes | purple, no reload |
| 2 | ~4 min | `category-chips.ts` | `bg-lime-300` | **16:47:38 / 16:47:38** (edit at 16:47:38) | yes | lime |
| 3 | 5:03 | `points-hero-card.ts` | `border-2 border-sky-500` | **16:48:26 / 16:48:26** (edit at 16:48:26) | yes, both | blue border |
| — | 5:36 | (reverts at 16:46:12 and 16:48:55) | removed | **not rewritten** (stayed 16:48:26) | class stays | template reverted |

The child stayed alive throughout (state `S`). No `[angular-native] the Tailwind watcher exited`
message, no errors.

## Run B — throwaway copy on Tailwind 3.4.19, to match the issue

A copy of this repo outside it (`$SCRATCH/lab-tw3`), deleted afterwards. Changes in the copy only: `tailwindcss@3.4.19` (exact), this `tailwind.config.js`, and
`@tailwind base; @tailwind components; @tailwind utilities;` in place of the Tailwind 4 `@import`s
(the v4-only `@theme` block removed, so the app's own colour tokens were missing — irrelevant to
the watcher).

```js
const path = require('node:path');
module.exports = {
  presets: [require('@ng-native/tailwind/preset.cjs')],
  content: [path.join(__dirname, 'src/**/*.{ts,html}')],
};
```

Child command (`ps`):

```
node $SCRATCH/lab-tw3/node_modules/tailwindcss/lib/cli.js -i $SCRATCH/lab-tw3/src/styles.css -o $SCRATCH/lab-tw3/.angular-native/app.tailwind.css --watch
```

| # | Child uptime | File | New class | CSS / JS rewritten | Class in CSS | Simulator |
|---|---|---|---|---|---|---|
| — | 0:00 | (startup) | — | 16:50:43 / 16:50:43 | — | — |
| 1 | 0:29 | `wallet.screen.ts` | `text-fuchsia-700` | **16:51:12 / 16:51:12** (edit at 16:51:12) | yes | purple |
| 2 | 1:00 | `category-chips.ts` | `bg-lime-300` | **16:51:43 / 16:51:43** (edit at 16:51:43) | yes | not checked visually |
| 3 | 5:01 | `points-hero-card.ts` | `border-2 border-sky-500` | **16:55:44 / 16:55:45** (edit at 16:55:44) | yes | blue border |
| — | 5:17 | (revert at 16:56:00) | removed | **not rewritten** (stayed 16:55:44) | class stays | — |

The child stayed alive throughout. No `watcher exited` message, no errors.

## Results

| | Value |
|---|---|
| Versions | ng-native 0.3.0 · Tailwind 4.3.3 (this lab, A) and 3.4.19 (throwaway copy, B) · Node 22.22.3 · npm · macOS 27.0 · Expo SDK 57 |
| Child command (`ps`) | See each run above |
| Is the CSS rewritten on save? | **Yes**, every time a new class was added, in the same second, in both runs (6 of 6) |
| Does the class reach the simulator? | **Yes** (5 checked visually; 1 not checked) |
| Does the CLI work without `--watch`? | Not run: the watcher never got stuck, so there was nothing to compare against |
| Does a hand-started `--watch` work? | Not run, for the same reason |
| Literal errors or warnings | None from the watcher. Metro's usual `[angular-native] .visible (Tailwind): dropped 'visibility'` and `.table (Tailwind): dropped 'display'` warnings, reprinted on each rebuild |

Other observations, both runs:

- **Removing a class does not rewrite the CSS** until the dev server restarts; the class stays in
  the generated sheet. It is the same in Tailwind 3 and 4 and does not look like the issue's bug.
  We did not check whether this is documented Tailwind behaviour.
- After each rebuild Metro re-bundles `src/main.ts` (which imports `app.tailwind.js`) and every
  component logs `hmr registered` again; the app keeps its state.

## What this does not show

**This attempt does not rule the bug out.** It ran in an environment that differs from the issue's
in ways that could be the cause:

- **npm instead of pnpm.** pnpm's linked `node_modules` changes how `require.resolve` finds the CLI
  and how the child resolves its own dependencies.
- **Node 22.22.3 instead of Node 24.** File watching and child-process behaviour change between
  major versions.
- **`tailwind.config.js` instead of a preset in TypeScript.** Tailwind 3 loads a TypeScript config
  through `jiti`, a different path.
- **A single app instead of a pnpm workspace.**
- The `CI` variable in the issue's environment is not known.

Narrowing it further means trying those one at a time.

## Reproduce

```sh
# Run A, from this repo
npx expo start            # without CI set; press i, or open it in Expo Go
ps -ax -o pid,etime,command | grep -E "tailwindcss|@tailwindcss/cli"
stat -f "%Sm" -t "%H:%M:%S" .angular-native/app.tailwind.css
# add a class that exists nowhere else to a template, save, and stat again
```
