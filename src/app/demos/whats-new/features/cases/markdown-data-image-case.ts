import { Component } from '@angular/core';
import { Markdown } from '@ng-native/components/markdown';
import { Text, View } from '@ng-native/components';

/** A 32 x 32 PNG (blue left, red top right, green bottom right) as base64: what a web editor writes for a pasted screenshot. */
const PNG =
  'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAOklEQVR42mNkzlzIQArYvXI2SeqZGGgMRi0YtWDUglELRi2gBmAhVUN4HuNoHIxaMGrBqAWjFgw/CwCz2gQUGgyjDwAAAABJRU5ErkJggg==';
const SVG = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSJyZWQiLz48L3N2Zz4=';

/** #905: a raster `data:` image in a document is drawn; an SVG `data:` url is still its alt text. */
@Component({
  selector: 'app-markdown-data-image-case',
  imports: [Markdown, Text, View],
  template: `
    <view class="gap-2">
      <view testID="whats-new-a15-5-drawn" class="drawn">
        <markdown [source]="source" />
      </view>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a15_5.hint">Expected: a small picture in three colours for the PNG, and the words "vector logo" for the SVG. Before, both were their alt text.</text>
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
export class MarkdownDataImageCase {
  protected readonly source = `![pasted screenshot](data:image/png;base64,${PNG})\n\n![vector logo](data:image/svg+xml;base64,${SVG})`;
}
