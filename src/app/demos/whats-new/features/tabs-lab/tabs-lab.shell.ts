import { Component } from '@angular/core';
import { NativeHeader, NativeTab, NativeTabsOutlet } from '@ng-native/router';

/**
 * The tab bar of the tabs lab, a small bar of its own for the 0.11 and 0.13 tab cases. It sits under
 * `whats-new/tabs/:org` as one screen kept by `reuseScreen`. The text in the lab is English only: it
 * is a fixture for the cases, not part of the app's copy.
 */
@Component({
  selector: 'app-tabs-lab-shell',
  imports: [NativeHeader, NativeTab, NativeTabsOutlet],
  template: `
    <native-header [hidden]="true" />
    <native-tabs-outlet>
      <native-tab path="home" title="Home" sfSymbol="house.fill" />
      <native-tab path="search" title="Search" sfSymbol="magnifyingglass" />
      <native-tab path="library" title="Library" sfSymbol="books.vertical.fill" />
    </native-tabs-outlet>
  `,
})
export class TabsLabShell {}
