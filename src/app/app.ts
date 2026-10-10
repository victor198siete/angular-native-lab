import { Component } from '@angular/core';
import { SafeAreaProvider } from '@ng-native/components';
import { GestureRoot } from '@ng-native/components/gestures';
import { NativeStackOutlet } from '@ng-native/router';

@Component({
  imports: [GestureRoot, NativeStackOutlet, SafeAreaProvider],
  selector: 'app-root',
  template: `
    <gesture-root>
      <safe-area-provider>
        <native-stack-outlet />
      </safe-area-provider>
    </gesture-root>
  `,
  styles: `
    :host {
      flex: 1;
    }
  `,
})
export class App {}
