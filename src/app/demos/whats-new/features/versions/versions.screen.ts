import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Pressable, SafeAreaView, ScrollView, Text, View } from '@ng-native/components';
import { NativeHeader } from '@ng-native/router';
import { RELEASES } from '../../core/releases.ts';

/** One row per ng-native release that has cases; a row opens that release's screen. */
@Component({
  selector: 'app-whats-new-versions-screen',
  imports: [NativeHeader, Pressable, SafeAreaView, ScrollView, Text, View],
  host: { style: 'flex: 1' },
  template: `
    <native-header [title]="title" />
    <safe-area-view [edges]="['bottom']" class="flex-1 bg-canvas dark:bg-canvas-dk">
      <scroll-view testID="whats-new-scroll" [contentContainerStyle]="{ padding: 20, gap: 16, paddingBottom: 48 }">
        <view class="gap-1">
          <text testID="whats-new-heading" accessibilityRole="header" class="text-h1 font-black text-ink dark:text-ink-dk" i18n="@@whatsNew.heading">What's new: each release note, checked</text>
          <text class="text-body text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.intro">Each case takes one line of an ng-native release note, runs it live, and says what was seen on a simulator and an emulator.</text>
        </view>
        @for (release of releases; track release.version) {
          <pressable
            class="min-h-16 justify-center gap-1 rounded-lg bg-surface p-4 shadow-card dark:bg-surface-dk dark:shadow-card-dk"
            [nativeID]="'whats-new-version-' + release.version"
            [testID]="'whats-new-version-' + release.version"
            accessibilityRole="button"
            [accessibilityLabel]="'ng-native ' + release.version"
            (press)="open(release.version)"
          >
            <text class="text-h2 font-bold text-ink dark:text-ink-dk">ng-native {{ release.version }}</text>
            <text class="text-body text-ink2 dark:text-ink2-dk">{{ count(release.version) }}</text>
          </pressable>
        }
      </scroll-view>
    </safe-area-view>
  `,
})
export class VersionsScreen {
  private readonly router = inject(Router);
  protected readonly title = $localize`:@@whatsNew.title:What's new`;
  protected readonly releases = RELEASES;

  protected count(version: string): string {
    const total = RELEASES.find((release) => release.version === version)?.cases().length ?? 0;
    return $localize`:@@whatsNew.versionCount:${total}:count: cases`;
  }

  protected open(version: string): void {
    void this.router.navigate(['/whats-new', version]);
  }
}
