import { Component, signal } from '@angular/core';
import { Text, View } from '@ng-native/components';

/**
 * Minimal ICU variants for the "#anchor is not a DOM Node" assertion. Each is a component of its own so one
 * that throws does not take the screen down. Keys `repro.*` are in src/locale/messages*.json only for V3, V3i, V4.
 */

/** V1: plural, no i18n id, no interpolation. */
@Component({
  selector: 'app-icu-v1',
  imports: [Text],
  template: `<text testID="v1-text">{n(), plural, =0 {none} one {one} other {many}}</text>`,
})
export class IcuV1 {
  protected readonly n = signal(1);
}

/** V1i: plural, no i18n id, interpolation inside the case. */
@Component({
  selector: 'app-icu-v1i',
  imports: [Text],
  template: `<text testID="v1i-text">{n(), plural, =0 {none} one {{{ n() }} one} other {{{ n() }} many}}</text>`,
})
export class IcuV1i {
  protected readonly n = signal(1);
}

/** V2: plural with i18n id, no translation loaded for it. */
@Component({
  selector: 'app-icu-v2',
  imports: [Text],
  template: `<text testID="v2-text" i18n="@@repro.v2">{n(), plural, =0 {none} one {one} other {many}}</text>`,
})
export class IcuV2 {
  protected readonly n = signal(1);
}

/** V2i: V2 with interpolation inside the case. */
@Component({
  selector: 'app-icu-v2i',
  imports: [Text],
  template: `<text testID="v2i-text" i18n="@@repro.v2i">{n(), plural, =0 {none} one {{{ n() }} one} other {{{ n() }} many}}</text>`,
})
export class IcuV2i {
  protected readonly n = signal(1);
}

/** V3: plural with i18n id and a translation, no interpolation. */
@Component({
  selector: 'app-icu-v3',
  imports: [Text],
  template: `<text testID="v3-text" i18n="@@repro.v3">{n(), plural, =0 {none} one {one} other {many}}</text>`,
})
export class IcuV3 {
  protected readonly n = signal(1);
}

/** V3i: plural with i18n id, a translation and interpolation (the lab's case without the label attribute). */
@Component({
  selector: 'app-icu-v3i',
  imports: [Text],
  template: `<text testID="v3i-text" i18n="@@repro.v3i">{n(), plural, =0 {none} one {{{ n() }} one} other {{{ n() }} many}}</text>`,
})
export class IcuV3i {
  protected readonly n = signal(1);
}

/** V4: V3i plus `i18n-accessibilityLabel` (the lab's full case). */
@Component({
  selector: 'app-icu-v4',
  imports: [Text],
  template: `<text
    testID="v4-text"
    i18n="@@repro.v4"
    i18n-accessibilityLabel="@@repro.v4.label"
    accessibilityLabel="Count"
  >{n(), plural, =0 {none} one {{{ n() }} one} other {{{ n() }} many}}</text>`,
})
export class IcuV4 {
  protected readonly n = signal(1);
}

/** V5: select, no i18n id. */
@Component({
  selector: 'app-icu-v5',
  imports: [Text],
  template: `<text testID="v5-text">{t(), select, a {Alpha} b {Beta} other {Other}}</text>`,
})
export class IcuV5 {
  protected readonly t = signal('a');
}

/** V6: plural, no i18n id, inside a view instead of a text. */
@Component({
  selector: 'app-icu-v6',
  imports: [View],
  template: `<view testID="v6-view">{n(), plural, =0 {none} one {one} other {many}}</view>`,
})
export class IcuV6 {
  protected readonly n = signal(1);
}

/** V7: no ICU at all, a plain text with an `@if` (an anchor that is not an ICU one). Control. */
@Component({
  selector: 'app-icu-v7',
  imports: [Text],
  template: `@if (on()) {<text testID="v7-text">plain if</text>}`,
})
export class IcuV7 {
  protected readonly on = signal(true);
}
