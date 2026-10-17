import { Component } from '@angular/core';
import { Markdown } from '@ng-native/components/markdown';
import { Text, View } from '@ng-native/components';

const TABLE = [
  '| Reward | Points | Where it can be redeemed | Expires |',
  '|---|---|---|---|',
  '| Free coffee | 120 | Any Horizon store in the city centre, at the counter | 31 Dec |',
  '| Cinema ticket | 480 | Partner cinemas only, never on Saturday evenings | 30 Nov |',
  '| Gym day pass | 300 | Horizon Fit, all branches | 15 Jan |',
].join('\n');

/** #865: a markdown table wider than the page scrolls sideways; each column is as wide as its widest cell. */
@Component({
  selector: 'app-markdown-table-case',
  imports: [Markdown, Text, View],
  template: `
    <view class="gap-2">
      <view testID="whats-new-a15-3-drawn" class="drawn">
        <markdown [source]="table" />
      </view>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a15_3.hint">Expected: the table is wider than the card; swipe it sideways to read the last columns, each as wide as its longest cell. Before, every column was squeezed into the card's width.</text>
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
export class MarkdownTableCase {
  protected readonly table = TABLE;
}
