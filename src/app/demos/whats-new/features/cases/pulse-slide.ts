import { Component, input } from '@angular/core';
import { View } from '@ng-native/components';

/** Its `pulse` slides. Same name as the sibling's, a different movement. */
@Component({
  selector: 'app-pulse-slide',
  imports: [View],
  template: `<view testID="whats-new-a9-2-slide" class="square" [class.playing]="playing()"></view>`,
  styles: `
    .square {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background-color: seagreen;
    }
    .square.playing {
      animation: pulse 2s ease-in-out 1 both;
    }
    @keyframes pulse {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(80px);
      }
    }
  `,
})
export class PulseSlide {
  readonly playing = input(false);
}
