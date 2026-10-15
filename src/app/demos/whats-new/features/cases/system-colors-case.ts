import { Component } from '@angular/core';
import { Text, View } from '@ng-native/components';

/** Text in the CSS system colours; on Android they drew nothing. */
@Component({
  selector: 'app-system-colors-case',
  imports: [Text, View],
  template: `
    <view class="gap-1">
      <text testID="whats-new-a14-10-canvas" class="canvas">CanvasText</text>
      <text testID="whats-new-a14-10-field" class="field">FieldText</text>
      <text testID="whats-new-a14-10-button" class="button">ButtonText</text>
      <text testID="whats-new-a14-10-gray" class="gray">GrayText</text>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a14_10.hint">Expected: four words in the text colour (on Android GrayText is the same colour, it has no grey of its own).</text>
    </view>
  `,
  styles: `
    .canvas {
      font-size: 20px;
      color: CanvasText;
    }
    .field {
      font-size: 20px;
      color: FieldText;
    }
    .button {
      font-size: 20px;
      color: ButtonText;
    }
    .gray {
      font-size: 20px;
      color: GrayText;
    }
  `,
})
export class SystemColorsCase {}
