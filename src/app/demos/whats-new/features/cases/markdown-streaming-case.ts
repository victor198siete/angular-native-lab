import { Component, computed, signal } from '@angular/core';
import { Markdown } from '@ng-native/components/markdown';
import { Text, View } from '@ng-native/components';
import { WnButton } from '../shared/action-button.ts';

/** Chunks cut where syntax is still open: inside a code span, a link, and a fence's opening line. */
export const CHUNKS: readonly string[] = [
  '# Weekly ',
  'digest\n\nThe `redeem',
  '()` call is **bold',
  '** and a [link to the cata',
  'log](https://ng-native.com) ends here.\n\n```t',
  's\nconst points = 120;\n```\n',
];

/**
 * #867: `<markdown streaming>` over a source that arrives a chunk at a time. Each press adds the
 * next chunk, so the state between two chunks can be looked at; the raw source so far is shown
 * under the drawing. While streaming, the open code span, bold, link and fence opening line are
 * held back instead of drawn as text; Finish clears `streaming` and the whole source is drawn.
 */
@Component({
  selector: 'app-markdown-streaming-case',
  imports: [Markdown, Text, View, WnButton],
  template: `
    <view class="gap-2">
      <view testID="whats-new-a15-4-drawn" class="drawn">
        <markdown [source]="source()" [streaming]="streaming()" />
      </view>
      <text testID="whats-new-a15-4-raw" selectable class="raw">{{ source() }}</text>
      <text testID="whats-new-a15-4-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <view class="flex-row flex-wrap gap-2">
        <app-wn-button testId="whats-new-a15-4-next" [label]="nextLabel" (act)="next()" />
        <app-wn-button testId="whats-new-a15-4-finish" [label]="finishLabel" (act)="streaming.set(false)" />
        <app-wn-button testId="whats-new-a15-4-restart" [label]="restartLabel" (act)="restart()" />
      </view>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a15_4.hint">Press Next chunk. Expected: the line under the drawing shows the raw text so far, ending in the open code span, bold, link or fence; the drawing above never shows that open end as raw text.</text>
    </view>
  `,
  styles: `
    .drawn {
      padding: 8px;
      border-radius: 6px;
      background-color: #ece8dc;
    }
    .raw {
      padding: 6px;
      border-radius: 6px;
      background-color: #ece8dc;
      font-family: Menlo, monospace;
      font-size: 11px;
      color: #12131a;
    }
  `,
})
export class MarkdownStreamingCase {
  protected readonly chunks = signal(0);
  protected readonly streaming = signal(true);
  protected readonly source = computed(() => CHUNKS.slice(0, this.chunks()).join(''));

  protected readonly nextLabel = $localize`:@@whatsNew.a15_4.next:Next chunk`;
  protected readonly finishLabel = $localize`:@@whatsNew.a15_4.finish:Finish`;
  protected readonly restartLabel = $localize`:@@whatsNew.a15_4.restart:Restart`;
  protected readonly readout = () => {
    const shown = this.chunks();
    const total = CHUNKS.length;
    return this.streaming()
      ? $localize`:@@whatsNew.a15_4.streaming:Streaming: chunk ${shown}:shown: of ${total}:total:`
      : $localize`:@@whatsNew.a15_4.done:Finished: chunk ${shown}:shown: of ${total}:total:, drawn as written`;
  };

  protected next(): void {
    if (this.streaming()) this.chunks.update((n) => Math.min(n + 1, CHUNKS.length));
  }

  protected restart(): void {
    this.chunks.set(0);
    this.streaming.set(true);
  }
}
