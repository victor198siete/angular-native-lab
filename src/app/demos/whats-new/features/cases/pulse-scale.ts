import { Component, input } from '@angular/core';
import { View } from '@ng-native/components';

/** Its `pulse` scales. */
@Component({
  selector: 'app-pulse-scale',
  imports: [View],
  template: `<view testID="whats-new-a9-2-scale" class="square" [class.playing]="playing()"></view>`,
  styles: `
    .square {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background-color: royalblue;
    }
    .square.playing {
      animation: pulse 2s ease-in-out 1 both;
    }
    @keyframes pulse {
      from {
        transform: scale(1);
      }
      to {
        transform: scale(1.6);
      }
    }
  `,
})
export class PulseScale {
  readonly playing = input(false);
}
