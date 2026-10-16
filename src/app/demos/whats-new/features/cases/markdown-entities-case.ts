import { Component } from '@angular/core';
import { Markdown } from '@ng-native/components/markdown';
import { Text, View } from '@ng-native/components';
import entities from './content/entities.md';

/**
 * A `.md` file imported as a module (Metro lexes it as the app is bundled) and drawn from its
 * tokens. Its source wraps a paragraph in three lines, has four named entities and a numeric one,
 * and breaks a line twice on purpose, with two spaces and with a backslash. The raw source is
 * shown above the drawing so the two can be compared.
 */
@Component({
  selector: 'app-markdown-entities-case',
  imports: [Markdown, Text, View],
  template: `
    <view class="gap-2">
      <text class="text-caption font-semibold text-ink dark:text-ink-dk" i18n="@@whatsNew.a7_6.sourceTitle">The file, as written</text>
      <text testID="whats-new-a7-6-source" selectable class="source">{{ file.content }}</text>
      <text class="text-caption font-semibold text-ink dark:text-ink-dk" i18n="@@whatsNew.a7_6.drawnTitle">The same file, drawn by markdown</text>
      <view testID="whats-new-a7-6-drawn" class="drawn">
        <markdown [tokens]="file.tokens" />
      </view>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a7_6.hint">Expected: the three source lines read as one paragraph, each entity is its glyph (an arrow, e with an accent, euro, a heart, an ampersand, an apostrophe), and the text breaks twice: after the two spaces and after the backslash.</text>
    </view>
  `,
  styles: `
    .source {
      padding: 8px;
      border-radius: 6px;
      background-color: #ece8dc;
      font-family: Menlo, monospace;
      font-size: 11px;
      color: #12131a;
    }
    .drawn {
      padding: 8px;
      border-radius: 6px;
      background-color: #ece8dc;
    }
  `,
})
export class MarkdownEntitiesCase {
  protected readonly file = entities;
}
