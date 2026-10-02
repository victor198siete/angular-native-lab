import { Component } from '@angular/core';
import { NativeHeader, NativeTab, NativeTabsOutlet } from '@ng-native/router';

@Component({
  selector: 'app-tabs-shell',
  imports: [NativeHeader, NativeTab, NativeTabsOutlet],
  template: `
    <native-header [hidden]="true" />
    <native-tabs-outlet>
      <native-tab path="wallet" [title]="walletTitle" sfSymbol="creditcard.fill" />
      <native-tab path="catalog" [title]="catalogTitle" sfSymbol="gift.fill" />
      <native-tab path="history" [title]="historyTitle" sfSymbol="clock.arrow.circlepath" />
    </native-tabs-outlet>
  `,
})
export class TabsShell {
  // Class fields run when the component is created, after the translations load.
  protected readonly walletTitle = $localize`:@@tabs.wallet:Wallet`;
  protected readonly catalogTitle = $localize`:@@tabs.catalog:Catalog`;
  protected readonly historyTitle = $localize`:@@tabs.history:History`;
}
