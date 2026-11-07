import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeAreaView, Switch, Text, View } from '@ng-native/components';
import { injectPageFocused, NativeNavigation, NativeStackOutlet } from '@ng-native/router';
import { WnButton } from '../shared/action-button.ts';
import { KeepMeHere } from './keep-guard.ts';
import { orgOf, urlSignal } from './lab-url.ts';

const BASE = '/whats-new/tabs';

/** How often Home's counter advances while the page is in front (#1361). */
export const TICK_MS = 1000;

/**
 * Home: where the lab starts. "Go to org 2" moves the same bar to another account (#774), "Present a
 * Library page" shows a page of the Library tab over this one (#783), and "Leave" returns to the cases.
 */
@Component({
  selector: 'app-tabs-lab-home',
  imports: [SafeAreaView, Text, View, WnButton],
  template: `
    <safe-area-view [edges]="['top']" class="flex-1 bg-canvas dark:bg-canvas-dk">
      <view class="gap-3 p-5">
        <text testID="whats-new-lab-home-title" accessibilityRole="header" class="text-h1 font-black text-ink dark:text-ink-dk">Tabs lab: Home</text>
        <text testID="whats-new-lab-home-url" class="text-body font-semibold text-ink dark:text-ink-dk">url: {{ url() }}</text>
        <text testID="whats-new-lab-home-org" class="text-body font-semibold text-ink dark:text-ink-dk">org: {{ org() }}</text>
        <app-wn-button testId="whats-new-lab-org" [label]="'Go to org ' + otherOrg()" (act)="switchOrg()" />
        <app-wn-button testId="whats-new-lab-present" label="Present a Library page" (act)="presentGuarded()" />
        <app-wn-button testId="whats-new-lab-present-keep" label="Present a sheet that can stay" (act)="presentKeep()" />
        <text testID="whats-new-lab-ticks" class="text-body font-semibold text-ink dark:text-ink-dk">Seconds in front: {{ ticks() }}</text>
        <app-wn-button testId="whats-new-lab-leave" label="Leave the lab" (act)="leave()" />
      </view>
    </safe-area-view>
  `,
})
export class TabsLabHome {
  private readonly router = inject(Router);
  private readonly nav = inject(NativeNavigation);
  protected readonly url = urlSignal();
  protected readonly org = () => orgOf(this.url());
  protected readonly otherOrg = () => (this.org() === '1' ? '2' : '1');
  protected readonly ticks = signal(0);
  private readonly focused = injectPageFocused();

  constructor() {
    // The page is never unmounted: the timer lives only while it is in front (#1361).
    effect((onCleanup) => {
      if (!this.focused()) return;
      const timer = setInterval(() => this.ticks.update((n) => n + 1), TICK_MS);
      onCleanup(() => clearInterval(timer));
    });
  }

  protected switchOrg(): void {
    void this.router.navigateByUrl(`${BASE}/${this.otherOrg()}/home`);
  }

  protected presentGuarded(): void {
    void this.nav.present(`${BASE}/${this.org()}/library/guarded`, { as: 'formSheet' });
  }

  protected presentKeep(): void {
    void this.nav.present(`${BASE}/${this.org()}/library/keep`, { as: 'formSheet' });
  }

  protected leave(): void {
    this.nav.back();
  }
}

/** Search: its route sits behind a guard that waits, so the tab takes a while to open (#761). */
@Component({
  selector: 'app-tabs-lab-search',
  imports: [SafeAreaView, Text, View],
  template: `
    <safe-area-view [edges]="['top']" class="flex-1 bg-canvas dark:bg-canvas-dk">
      <view class="gap-3 p-5">
        <text testID="whats-new-lab-search-title" accessibilityRole="header" class="text-h1 font-black text-ink dark:text-ink-dk">Tabs lab: Search</text>
        <text testID="whats-new-lab-search-url" class="text-body font-semibold text-ink dark:text-ink-dk">url: {{ url() }}</text>
      </view>
    </safe-area-view>
  `,
})
export class TabsLabSearch {
  protected readonly url = urlSignal();
}

/** The Library tab is a stack of its own, so a page can be pushed in it and the tab remembers it. */
@Component({
  selector: 'app-tabs-lab-library-stack',
  imports: [NativeStackOutlet],
  host: { style: 'flex: 1' },
  template: `<native-stack-outlet />`,
})
export class TabsLabLibraryStack {}

/** Library's first page: "Open album x" pushes a page onto this tab's stack. */
@Component({
  selector: 'app-tabs-lab-library',
  imports: [SafeAreaView, Text, View, WnButton],
  template: `
    <safe-area-view [edges]="['top']" class="flex-1 bg-canvas dark:bg-canvas-dk">
      <view class="gap-3 p-5">
        <text testID="whats-new-lab-library-title" accessibilityRole="header" class="text-h1 font-black text-ink dark:text-ink-dk">Tabs lab: Library</text>
        <text testID="whats-new-lab-library-url" class="text-body font-semibold text-ink dark:text-ink-dk">url: {{ url() }}</text>
        <app-wn-button testId="whats-new-lab-open-x" label="Open album x" (act)="openAlbum()" />
      </view>
    </safe-area-view>
  `,
})
export class TabsLabLibrary {
  private readonly nav = inject(NativeNavigation);
  protected readonly url = urlSignal();

  protected openAlbum(): void {
    void this.nav.push(`${BASE}/${orgOf(this.url())}/library/x`);
  }
}

/**
 * An album page. The one named `guarded` has unsaved changes: it refuses a native dismissal
 * (Android's Back, an iOS swipe) and counts the attempts, which is what #783 is about. "Close" leaves
 * through `back()`, which is not refused.
 */
@Component({
  selector: 'app-tabs-lab-album',
  imports: [SafeAreaView, Text, View, WnButton],
  host: {
    '[preventNativeDismiss]': 'guarded',
    '(nativeDismissCancelled)': 'attempts.set(attempts() + 1)',
  },
  template: `
    <safe-area-view [edges]="['top', 'bottom']" class="flex-1 bg-canvas dark:bg-canvas-dk">
      <view class="gap-3 p-5">
        <text testID="whats-new-lab-album-title" accessibilityRole="header" class="text-h1 font-black text-ink dark:text-ink-dk">Album {{ id }}</text>
        <text testID="whats-new-lab-album-url" class="text-body font-semibold text-ink dark:text-ink-dk">url: {{ url() }}</text>
        <text testID="whats-new-lab-album-attempts" class="text-body font-semibold text-ink dark:text-ink-dk">Back refused: {{ attempts() }}</text>
        <app-wn-button testId="whats-new-lab-album-close" label="Close" (act)="close()" />
      </view>
    </safe-area-view>
  `,
})
export class TabsLabAlbum {
  private readonly nav = inject(NativeNavigation);
  protected readonly id = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';
  protected readonly guarded = this.id === 'guarded';
  protected readonly attempts = signal(0);
  protected readonly url = urlSignal();

  protected close(): void {
    this.nav.back();
  }
}

/**
 * The sheet with "Keep me here": a `canDeactivate` guard on its route (`keepMeHereGuard`) answers a
 * swipe down on iOS, so with the switch on the sheet stays and the url does not change (#1351). On
 * Android dragging a formSheet down dismisses it whatever the guard says. "Close" leaves through `back()`
 * and is asked too. The switch is turned off again when the page goes, so the next sheet opens unlocked.
 */
@Component({
  selector: 'app-tabs-lab-keep',
  imports: [SafeAreaView, Switch, Text, View, WnButton],
  template: `
    <safe-area-view [edges]="['top', 'bottom']" class="flex-1 bg-canvas dark:bg-canvas-dk">
      <view class="gap-3 p-5">
        <text testID="whats-new-lab-keep-title" accessibilityRole="header" class="text-h1 font-black text-ink dark:text-ink-dk">Sheet</text>
        <text testID="whats-new-lab-keep-url" class="text-body font-semibold text-ink dark:text-ink-dk">url: {{ url() }}</text>
        <view class="flex-row items-center gap-3">
          <switch testID="whats-new-lab-keep-switch" accessibilityLabel="Keep me here" [checked]="state.keep()" (checkedChange)="state.keep.set($event)" />
          <text class="text-body font-semibold text-ink dark:text-ink-dk">Keep me here</text>
        </view>
        <app-wn-button testId="whats-new-lab-keep-close" label="Close" (act)="close()" />
      </view>
    </safe-area-view>
  `,
})
export class TabsLabKeep {
  private readonly nav = inject(NativeNavigation);
  protected readonly state = inject(KeepMeHere);
  protected readonly url = urlSignal();

  constructor() {
    this.state.keep.set(false);
    inject(DestroyRef).onDestroy(() => this.state.keep.set(false));
  }

  protected close(): void {
    this.nav.back();
  }
}
