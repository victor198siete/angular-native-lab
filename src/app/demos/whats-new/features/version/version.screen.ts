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
import { IconColorVarCase } from '../cases/icon-color-var-case.ts';
import { IconConfigCase } from '../cases/icon-config-case.ts';
import { IconLabelCase } from '../cases/icon-label-case.ts';
import { IconLoaderCase } from '../cases/icon-loader-case.ts';
import { IconShapesCase } from '../cases/icon-shapes-case.ts';
import { IconSizeTokenCase } from '../cases/icon-size-token-case.ts';
import { IconValuesCase } from '../cases/icon-values-case.ts';
import { OpenSettingsCase } from '../cases/open-settings-case.ts';
import { TabsLabCase } from '../cases/tabs-lab-case.ts';
import { FirstDrawCase } from '../cases/first-draw-case.ts';
import { HasEitherCase } from '../cases/has-either-case.ts';
import { HostHasCase } from '../cases/host-has-case.ts';
import { MarkdownDataImageCase } from '../cases/markdown-data-image-case.ts';
import { MarkdownStreamingCase } from '../cases/markdown-streaming-case.ts';
import { MarkdownTableCase } from '../cases/markdown-table-case.ts';
import { NavigationBarCase } from '../cases/navigation-bar-case.ts';
import { SvgBadPaintCase } from '../cases/svg-bad-paint-case.ts';
import { TextInputEventsCase } from '../cases/text-input-events-case.ts';
import { TokenColorsCase } from '../cases/token-colors-case.ts';
import { AriaCheckedCase } from '../cases/aria-checked-case.ts';
import { AspectStretchCase } from '../cases/aspect-stretch-case.ts';
import { BorderLaterCase } from '../cases/border-later-case.ts';
import { BoundUnitsCase } from '../cases/bound-units-case.ts';
import { LabelColumnCase } from '../cases/label-column-case.ts';
import { NumberDefaultsCase } from '../cases/number-defaults-case.ts';
import { SizeLimitsCase } from '../cases/size-limits-case.ts';
import { StyleAttributeCase } from '../cases/style-attribute-case.ts';
import { SystemColorsCase } from '../cases/system-colors-case.ts';
import { TransitionArrivesCase } from '../cases/transition-arrives-case.ts';
import { TruncateViewCase } from '../cases/truncate-view-case.ts';
import { WrapLinesCase } from '../cases/wrap-lines-case.ts';
import { InheritedLineHeightCase } from '../cases/inherited-line-height-case.ts';
import { InitialValueTransitionCase } from '../cases/initial-value-transition-case.ts';
import { LinkOnStackCase } from '../cases/link-on-stack-case.ts';
import { MarkdownEntitiesCase } from '../cases/markdown-entities-case.ts';
import { ShortListCase } from '../cases/short-list-case.ts';
import { ToolbarCase } from '../cases/toolbar-case.ts';
import { DisplayNoneCase } from '../cases/display-none-case.ts';
import { FlexBasisCase } from '../cases/flex-basis-case.ts';
import { InvisibleBackdropCase } from '../cases/invisible-backdrop-case.ts';
import { KeyframesBlockCase } from '../cases/keyframes-block-case.ts';
import { LightDarkMixCase } from '../cases/light-dark-mix-case.ts';
import { ListHeaderFooterCase } from '../cases/list-header-footer-case.ts';
import { MarkdownPostCase } from '../cases/markdown-post-case.ts';
import { MultilineRowsCase } from '../cases/multiline-rows-case.ts';
import { VarFallbackCase } from '../cases/var-fallback-case.ts';
import { CaseCard } from '../shared/case-card.ts';

/**
 * The cases of one release, in a scroll; the version arrives as the `:version` route parameter.
 * Each case card projects its own demo, picked by the case id.
 */
@Component({
  selector: 'app-whats-new-version-screen',
  imports: [
    AnimateInCase, AriaCheckedCase, AspectStretchCase, BorderColorCase, BorderLaterCase, BoundUnitsCase, LabelColumnCase,
    NumberDefaultsCase, SizeLimitsCase, StyleAttributeCase, SystemColorsCase, TransitionArrivesCase, TruncateViewCase, WrapLinesCase, CaseCard, DarkClassCase, DeepLinkCase, DialogsCase, GradientVarCase,
    IcuCase, IconColorVarCase, IconConfigCase, IconLabelCase, IconLoaderCase, IconShapesCase, IconSizeCase,
    IconSizeTokenCase, IconValuesCase, InvisiblePressCase, KeyframesScopeCase, NativeHeader, NgDeepCase,
    NotDarkCase, OneWordCase, OpenSettingsCase, PanelHeightCase, PermissionRecheckCase, SafeAreaView,
    ScrollView, SpacingTransitionCase, TabsLabCase, Text, TransitionsBlockCase, ZIndexCase,
    DisplayNoneCase, FlexBasisCase, InvisibleBackdropCase, KeyframesBlockCase, LightDarkMixCase, ListHeaderFooterCase,
    MarkdownPostCase, MultilineRowsCase, VarFallbackCase,
    FirstDrawCase, HasEitherCase, HostHasCase, MarkdownDataImageCase, MarkdownStreamingCase, MarkdownTableCase,
    NavigationBarCase, SvgBadPaintCase, TextInputEventsCase, TokenColorsCase,
    InheritedLineHeightCase, InitialValueTransitionCase, LinkOnStackCase, MarkdownEntitiesCase, ShortListCase, ToolbarCase,
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
              @case ('a6-1') { <app-display-none-case /> }
              @case ('a6-2') { <app-markdown-post-case /> }
              @case ('a6-3') { <app-multiline-rows-case /> }
              @case ('a6-4') { <app-flex-basis-case /> }
              @case ('a6-5') { <app-list-header-footer-case /> }
              @case ('a6-6') { <app-keyframes-block-case /> }
              @case ('a6-7') { <app-var-fallback-case /> }
              @case ('a6-8') { <app-invisible-backdrop-case /> }
              @case ('a6-9') { <app-light-dark-mix-case /> }
              @case ('a7-1') { <app-toolbar-case /> }
              @case ('a7-2') { <app-short-list-case /> }
              @case ('a7-3') { <app-link-on-stack-case /> }
              @case ('a7-4') { <app-initial-value-transition-case /> }
              @case ('a7-5') { <app-inherited-line-height-case /> }
              @case ('a7-6') { <app-markdown-entities-case /> }
              @case ('a15-1') { <app-token-colors-case /> }
              @case ('a15-2') { <app-text-input-events-case /> }
              @case ('a15-3') { <app-markdown-table-case /> }
              @case ('a15-4') { <app-markdown-streaming-case /> }
              @case ('a15-5') { <app-markdown-data-image-case /> }
              @case ('a15-6') { <app-navigation-bar-case /> }
              @case ('a15-7') { <app-has-either-case /> }
              @case ('a15-8') { <app-host-has-case /> }
              @case ('a15-9') { <app-first-draw-case /> }
              @case ('a15-10') { <app-svg-bad-paint-case /> }
              @case ('a14-1') { <app-bound-units-case /> }
              @case ('a14-2') { <app-transition-arrives-case /> }
              @case ('a14-3') { <app-border-later-case /> }
              @case ('a14-4') { <app-aspect-stretch-case /> }
              @case ('a14-5') { <app-size-limits-case /> }
              @case ('a14-6') { <app-wrap-lines-case /> }
              @case ('a14-7') { <app-truncate-view-case /> }
              @case ('a14-8') { <app-label-column-case /> }
              @case ('a14-9') { <app-aria-checked-case /> }
              @case ('a14-10') { <app-system-colors-case /> }
              @case ('a14-11') { <app-number-defaults-case /> }
              @case ('a14-12') { <app-style-attribute-case /> }
              @case ('a13-1') { <app-icon-shapes-case /> }
              @case ('a13-2') { <app-icon-color-var-case /> }
              @case ('a13-3') { <app-icon-config-case /> }
              @case ('a13-4') { <app-icon-loader-case /> }
              @case ('a13-5') { <app-icon-label-case /> }
              @case ('a13-6') { <app-icon-size-token-case /> }
              @case ('a13-7') { <app-icon-values-case /> }
              @case ('a13-8') { <app-tabs-lab-case caseId="a13-8" [steps]="steps813" [expected]="expected813" /> }
              @case ('a11-1') { <app-open-settings-case /> }
              @case ('a11-2') { <app-tabs-lab-case caseId="a11-2" [steps]="steps112" [expected]="expected112" /> }
              @case ('a11-3') { <app-tabs-lab-case caseId="a11-3" [steps]="steps113" [expected]="expected113" /> }
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
  protected readonly steps112 = $localize`:@@whatsNew.a11_2.steps:Open the lab. Press Search, whose route waits 4 seconds behind a guard, then press Home at once.`;
  protected readonly expected112 = $localize`:@@whatsNew.a11_2.expected:Expected: when the 4 seconds pass, Home is still in front and Search never opens. Before: Search opened when it finished.`;
  protected readonly steps113 = $localize`:@@whatsNew.a11_3.steps:Open the lab (org 1). In Library press Open album x, then in Home press Go to org 2, then press Library.`;
  protected readonly expected113 = $localize`:@@whatsNew.a11_3.expected:Expected: Library opens at org 2's first page, not at org 1's album x. Before: it went back to org 1's url.`;
  protected readonly steps813 = $localize`:@@whatsNew.a13_8.steps:Android. Open the lab. On Home press Present a Library page, then press the system Back button.`;
  protected readonly expected813 = $localize`:@@whatsNew.a13_8.expected:Expected: the sheet stays up and Back refused goes to 1; Close leaves. Before: Back closed the sheet.`;
  protected readonly title = computed(() => $localize`:@@whatsNew.versionTitle:Version ${this.version()}:version:`);
}
