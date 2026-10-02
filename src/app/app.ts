import { Component, inject, signal } from '@angular/core';
import { Pressable, SafeAreaProvider, SafeAreaView, Text, View } from '@ng-native/components';
import { StatusBar } from '@ng-native/device';

/**
 * Element names are lowercase, and that is load-bearing rather than style: an uppercase name is
 * read as an unknown Angular component and commits as a plain view with nothing in it.
 */
@Component({
  imports: [Pressable, SafeAreaProvider, SafeAreaView, Text, View],
  selector: 'app-root',
  template: `
    <safe-area-provider>
      <safe-area-view class="screen">
        <view class="body">
          <text class="title">Angular, natively</text>
          <text class="hint">Real native views. React is never in the render path.</text>

          <pressable accessibilityRole="button" class="button" (press)="count.set(count() + 1)">
            <text class="label">Tapped {{ count() }} times</text>
          </pressable>
        </view>
      </safe-area-view>
    </safe-area-provider>
  `,
  styles: `
    :host {
      flex: 1;
    }
    .screen {
      flex: 1;
      background-color: #f5f5f7;
    }
    .body {
      flex: 1;
      justify-content: center;
      gap: 12px;
      padding: 24px;
    }
    .title {
      color: #101014;
      font-size: 28px;
      font-weight: 700;
    }
    .hint {
      color: #5f5f6b;
      font-size: 15px;
    }
    .button {
      align-items: center;
      margin-top: 8px;
      padding: 14px;
      border-radius: 10px;
      background-color: #3b6ef5;
    }
    .label {
      color: #ffffff;
      font-size: 16px;
      font-weight: 600;
    }
    @media (prefers-color-scheme: dark) {
      .screen {
        background-color: #101014;
      }
      .title {
        color: #ffffff;
      }
      .hint {
        color: #8b8b96;
      }
    }
  `,
})
export class App {
  protected readonly count = signal(0);

  constructor() {
    // Dark status bar icons in light mode and light ones in dark mode. Unclaimed, Android keeps
    // light icons whatever the scheme.
    inject(StatusBar).set({ style: 'auto' });
  }
}
