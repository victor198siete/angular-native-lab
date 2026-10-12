import { Component, computed, input } from '@angular/core';
import { SafeAreaView, ScrollView, Text } from '@ng-native/components';
import { NativeHeader } from '@ng-native/router';
import { releaseOf } from '../../core/releases.ts';
import { AnimateInCase } from '../cases/animate-in-case.ts';
import { BorderColorCase } from '../cases/border-color-case.ts';
import { DarkClassCase } from '../cases/dark-class-case.ts';
import { DeepLinkCase } from '../cases/deep-link-case.ts';
import { DialogsCase } from '../cases/dialogs-case.ts';
import { IcuCase } from '../cases/icu-case.ts';
import { InvisiblePressCase } from '../cases/invisible-press-case.ts';
import { KeyframesScopeCase } from '../cases/keyframes-scope-case.ts';
import { NgDeepCase } from '../cases/ng-deep-case.ts';
import { PanelHeightCase } from '../cases/panel-height-case.ts';
import { OneWordCase } from '../cases/one-word-case.ts';
import { GradientVarCase } from '../cases/gradient-var-case.ts';
import { IconSizeCase } from '../cases/icon-size-case.ts';
import { NotDarkCase } from '../cases/not-dark-case.ts';
import { PermissionRecheckCase } from '../cases/permission-recheck-case.ts';
import { SpacingTransitionCase } from '../cases/spacing-transition-case.ts';
import { TransitionsBlockCase } from '../cases/transitions-block-case.ts';
import { ZIndexCase } from '../cases/z-index-case.ts';
import { CaseCard } from '../shared/case-card.ts';

/**
 * The cases of one release, in a scroll; the version arrives as the `:version` route parameter.
 * Each case card projects its own demo, picked by the case id.
 */
@Component({
  selector: 'app-whats-new-version-screen',
  imports: [
    AnimateInCase, BorderColorCase, CaseCard, DarkClassCase, DeepLinkCase, DialogsCase, GradientVarCase,
    IcuCase, IconSizeCase, InvisiblePressCase, KeyframesScopeCase, NativeHeader, NgDeepCase, NotDarkCase,
    OneWordCase, PanelHeightCase, PermissionRecheckCase, SafeAreaView, ScrollView, SpacingTransitionCase,
    Text, TransitionsBlockCase, ZIndexCase,
  ],
  host: { style: 'flex: 1' },
  template: `
    <native-header [title]="title()" />
    <safe-area-view [edges]="['bottom']" class="flex-1 bg-canvas dark:bg-canvas-dk">
      <scroll-view testID="whats-new-version-scroll" [contentContainerStyle]="{ padding: 20, gap: 16, paddingBottom: 48 }">
        <text testID="whats-new-version-heading" accessibilityRole="header" class="text-h1 font-black text-ink dark:text-ink-dk">ng-native {{ version() }}</text>
        @for (item of cases(); track item.id) {
          <app-case-card [item]="item">
            @switch (item.id) {
              @case ('a10-1') { <app-dialogs-case /> }
              @case ('a10-2') { <app-deep-link-case /> }
              @case ('a10-3') { <app-ng-deep-case /> }
              @case ('a10-4') { <app-dark-class-case /> }
              @case ('a10-5') { <app-border-color-case /> }
              @case ('a10-6') { <app-one-word-case /> }
              @case ('a10-7') { <app-z-index-case /> }
              @case ('a9-1') { <app-icu-case /> }
              @case ('a9-2') { <app-keyframes-scope-case /> }
              @case ('a9-3') { <app-panel-height-case /> }
              @case ('a9-4') { <app-invisible-press-case /> }
              @case ('a9-5') { <app-animate-in-case /> }
              @case ('a8-1') { <app-permission-recheck-case /> }
              @case ('a8-2') { <app-transitions-block-case /> }
              @case ('a8-3') { <app-spacing-transition-case /> }
              @case ('a8-4') { <app-gradient-var-case /> }
              @case ('a8-5') { <app-icon-size-case /> }
              @case ('a8-6') { <app-not-dark-case /> }
            }
          </app-case-card>
        } @empty {
          <text class="text-body text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.unknown">No cases for this version yet.</text>
        }
      </scroll-view>
    </safe-area-view>
  `,
})
export class VersionScreen {
  /** The `:version` route parameter, bound as an input. */
  readonly version = input<string>();
  protected readonly cases = computed(() => releaseOf(this.version())?.cases() ?? []);
  protected readonly title = computed(() => $localize`:@@whatsNew.versionTitle:Version ${this.version()}:version:`);
}
