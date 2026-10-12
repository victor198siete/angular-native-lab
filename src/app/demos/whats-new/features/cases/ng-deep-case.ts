import { Component, input } from '@angular/core';
import { Text, View } from '@ng-native/components';

/** The component the parent's `::ng-deep` has to reach: a text with the class `inner`. */
@Component({
  selector: 'app-ng-deep-child',
  imports: [Text],
  template: `<text [testID]="testId()" class="inner">{{ label() }}</text>`,
  styles: `
    .inner {
      color: gray;
      font-weight: 600;
    }
  `,
})
export class NgDeepChild {
  readonly testId = input.required<string>();
  readonly label = input.required<string>();
}

/** `:host ::ng-deep .inner` has something before `::ng-deep`: the child's text should turn red. */
@Component({
  selector: 'app-ng-deep-with-host',
  imports: [NgDeepChild],
  template: `<app-ng-deep-child testId="whats-new-a10-3-with" [label]="label" />`,
  styles: `
    :host ::ng-deep .inner {
      color: crimson;
    }
  `,
})
export class NgDeepWithHost {
  protected readonly label = $localize`:@@whatsNew.a10_3.with:Something before ng-deep: should be crimson`;
}

/** `::ng-deep .inner` with nothing before it: the note says the rule is still dropped (stays gray). */
@Component({
  selector: 'app-ng-deep-bare',
  imports: [NgDeepChild],
  template: `<app-ng-deep-child testId="whats-new-a10-3-bare" [label]="label" />`,
  styles: `
    ::ng-deep .inner {
      color: royalblue;
    }
  `,
})
export class NgDeepBare {
  protected readonly label = $localize`:@@whatsNew.a10_3.bare:Nothing before ng-deep: should stay gray`;
}

@Component({
  selector: 'app-ng-deep-case',
  imports: [NgDeepBare, NgDeepWithHost, View],
  template: `
    <view class="gap-2">
      <app-ng-deep-with-host />
      <app-ng-deep-bare />
    </view>
  `,
})
export class NgDeepCase {}
