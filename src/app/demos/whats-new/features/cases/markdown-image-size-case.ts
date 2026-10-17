import { Component } from '@angular/core';
import { Markdown } from '@ng-native/components/markdown';
import { Text, View } from '@ng-native/components';

/** A 32 x 32 PNG (blue left, red top right, green bottom right) as base64: the same icon as A15-5. */
const SMALL =
  'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAOklEQVR42mNkzlzIQArYvXI2SeqZGGgMRi0YtWDUglELRi2gBmAhVUN4HuNoHIxaMGrBqAWjFgw/CwCz2gQUGgyjDwAAAABJRU5ErkJggg==';
/** A 600 x 100 PNG, six colour bands in a dark frame: wider than any phone's card, and a 6:1 strip. */
const WIDE =
  'iVBORw0KGgoAAAANSUhEUgAAAlgAAABkCAIAAADVI9l0AAADjElEQVR42u3VMQmAUBRAUcHRQXDQ5WMAI4gJbGIHswhiDxs5utvg8xend+AmuMupUholSQpbZYEkCYSSJIFQkqTgEN7dokz1dqqw/lpV2Hs0KmyfHxXWDpMygRCEIAQhCEEIQhCCEIQgBCEIQQhCEIIQhCAEIQhBCEIQghCEIAQhCEEIQhCCEIQgRB0IQQhCEIIQhAIhCEEIQhCCUCAEIQhBCEIQCoQgBCEIQQhCgRCEIAQhCEEoEIIQhCAEIQiFNxCCEIQgBCEIBUIQghCEIAShQAhCEIIQhCAUCEEIQhCCEIQCIQhBCEIQglAgBCEIQQhCEAqEIAQhCEEIQoEQhCAEIQhBKBCCEIQgBCEIQSgQghCEIAQhCAVCEIIQhCAEoUAIQhCCEIQgFAhBCEIQghCEAiEIQQhCEIJQIAQhCEEIQhAKhCAEIQhBCEKBEIQgBCEIQQhCwoEQhCAEIQhBKBCCEIQgBCEIBUIQghCEIAShQAhCEIIQhCAUCEEIQhCCEIQCIQhBCEIQglAgBCEIQQhCEAqEIAQhCEEIQoEQhCAEIQhBCEKBEIQgBCEIQSgQghCEIAQhCAVCEIIQhCAEoUAIQhCCEIQgFAhBCEIQghCEAiEIQQhCEIJQIAQhCEEIQhAKhCAEIQhBCEIQ0g6EIAQhCEEIQoEQhCAEIQhBKBCCEIQgBCEIBUIQghCEIAShQAhCEIIQhCAUCEEIQhCCEIQgBCEIQQhCEIIQhCAEIQhBCEIQghCEIAQhCEEIQhCCEIQgBCEIQQhCEIIQhCAEIQhBSDsQghCEIAQhCAVCEIIQhCAEoUAIQhCCEIQgFAhBCEIQghCEAiEIQQhCEIJQIAQhCEEIQhCCkHAgBCEIQQhCEAqEIAQhCEEIQoEQhCAEIQhBKBCCEIQgBCEIBUIQghCEIAShQAhCEIIQhCAUCEEIQhCCEIQCIQhBCEIQglB4AyEIQQhCEIJQIAQhCEEIQhAKhCAEIQhBCEKBEIQgBCEIQSgQghCEIAQhCAVCEIIQhCAEoUAIQhCCEIQgFAhBCEIQghCEAiEIQQhCEIIQhAIhCEEIQhCCUCAEIQhBCEIQCoQgBCEIQQhCgRCEIAQhCEEoEIIQhCAEIQgFQhCCEIQgBKFACEIQghCEIBQIQQhCEIIQhCAkHAhBCEIQghCEAiEIQQhCEIJQIPwHQkmSogVCSRIIJUkCoSRJAfsAYXNHDKQEK7AAAAAASUVORK5CYII=';

/** #922: a markdown image is drawn at its own size and narrowed, keeping its shape, only when it is wider than the document. */
@Component({
  selector: 'app-markdown-image-size-case',
  imports: [Markdown, Text, View],
  template: `
    <view class="gap-2">
      <view testID="whats-new-a16-1-drawn" class="drawn">
        <markdown [source]="source" />
      </view>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a16_1.hint">Expected: the small icon keeps its own 32 pt size, and the wide strip is narrowed to the card's width, keeping its 6 to 1 shape. Before, both filled the card's width.</text>
    </view>
  `,
  styles: `
    .drawn {
      padding: 8px;
      border-radius: 6px;
      background-color: #ece8dc;
    }
  `,
})
export class MarkdownImageSizeCase {
  protected readonly source = `![small icon](data:image/png;base64,${SMALL})\n\n![wide strip](data:image/png;base64,${WIDE})`;
}
