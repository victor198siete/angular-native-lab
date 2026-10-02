import { Component } from '@angular/core';
import { NativeHeader, NativeTab, NativeTabsOutlet } from '@ng-native/router';

@Component({
  selector: 'app-tabs-shell',
  imports: [NativeHeader, NativeTab, NativeTabsOutlet],
  template: `
    <native-header [hidden]="true" />
    <native-tabs-outlet>
      <native-tab path="wallet" title="Wallet" sfSymbol="creditcard.fill" />
      <native-tab path="catalog" title="Catálogo" sfSymbol="gift.fill" />
      <native-tab path="history" title="Historial" sfSymbol="clock.arrow.circlepath" />
    </native-tabs-outlet>
  `,
})
export class TabsShell {}
