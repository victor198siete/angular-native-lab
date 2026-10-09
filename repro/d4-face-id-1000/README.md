# D4: `unknown: -1000, Authentication failure.` on the first Face ID prompt

**Outcome: not reproduced on 0.9.0** (it got away). Seen once on 0.5.0, never since.

## What was seen (0.5.0)

In the Vault, the first reveal of the voucher codes failed with

```
unknown: -1000, Authentication failure.
```

and the second attempt passed. The guess then was that the simulated face arrived after the sheet
had given up. It was not confirmed.

## Where it was looked for (0.9.0)

`@ng-native/*` 0.9.0, `expo-local-authentication` 57.0.3, Expo Go, iOS 27 simulator (iPhone 18
Pro), 9 October 2026. No phone. Faces were sent with [`trial.sh`](trial.sh).

| # | Where | What | Result |
|---|---|---|---|
| 1 | Vault, a code row | Matching face about 2 s after the press | Passed first time |
| 2 | Vault, "Show with Face ID" | Matching face 30 s after the press | Not valid: Metro reloaded the app while the sheet waited |
| 3 | Login, cold launch with a session | Matching face about 45 s after the sheet appeared | Passed first time |
| 4 | Login, Lock | Matching face sent the moment Lock was pressed | Passed first time |
| 5 | Login, Lock | Face that does not match, then Cancel on iOS's "Face Not Recognized" | `user_cancel`, shown as "Cancelled. Try again when you are ready." |
| 6 | Login, after re-enrolling Face ID with the app open | Matching face after 2 s | Passed first time |
| 7 | Login, cold launch after `simctl privacy reset all` for Expo Go | Matching face | Passed first time; no permission prompt appeared |
| 8 | Login, cold launch | Matching face | Passed first time |

Six matching faces, six passes on the first try, no `-1000`. A face sent late, early or right
after enrolment did not fail. Both guesses tried here are ruled out on 0.9.0; the cause of the
0.5.0 failure is still unknown.

## To try it

1. `npm start`, then open `exp://127.0.0.1:8081/--/login` in Expo Go on the simulator.
2. Sign in with the account in `src/app/demos/login/core/mock-auth/seed.ts`, then press **Lock**.
3. While the Face ID sheet is up: `./repro/d4-face-id-1000/trial.sh 2 try1` (or a longer delay,
   or `nomatch`).

Anything other than a pass for a matching face is the duel back: copy the message from the screen
as it is. The app shows the platform's error verbatim inside its sentence.

## Notes from the hunt

- After the simulator booted, enrollment was off and the Vault said "Not available on this
  phone." `available()` is read when the screen is created, so after enrolling, Expo Go had to be
  relaunched before it changed.
- Screenshots can lag a tap by a second or so: in trial 5 the Cancel tap looked ignored and had
  in fact gone through. Read the result a few seconds later. Whether the "Try Face ID Again" tap
  before it registered could not be told.
- A face sent **before** the sheet is up (Expo Go still loading after a cold launch) is dropped
  without an error: the sheet then waits for the next one. It does not produce `-1000` either.
- No issue drafted: there is no reproduction to give.
