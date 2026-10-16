import { Component, signal } from '@angular/core';
import { Markdown, type MarkdownLinkPress } from '@ng-native/components/markdown';
import { Text, View } from '@ng-native/components';
import post from './content/post.md';

/**
 * `import post from './post.md'` is `{ attributes, content, tokens }`: Metro lexed it with `marked`
 * as the app was bundled, so `<markdown [tokens]>` parses nothing on the device. The link reports
 * its href through `(linkPress)`; the handler calls `preventDefault()` so the lab does not leave
 * for a browser.
 */
@Component({
  selector: 'app-markdown-post-case',
  imports: [Markdown, Text, View],
  template: `
    <view class="gap-2">
      <view testID="whats-new-a6-2-drawn" class="drawn">
        <markdown [tokens]="post.tokens" (linkPress)="pressed($event)" />
      </view>
      <text testID="whats-new-a6-2-readout" class="text-body font-semibold text-ink dark:text-ink-dk">{{ readout() }}</text>
      <text class="text-caption text-ink2 dark:text-ink2-dk" i18n="@@whatsNew.a6_2.hint">Drawn from a .md file imported as a module: a heading, nested emphasis, a task list, a table, a code block that scrolls sideways and a link. Press the link: its url is reported here.</text>
    </view>
  `,
  styles: `
    .drawn {
      padding: 12px;
      border-radius: 8px;
      background-color: #ece8dc;
    }
  `,
})
export class MarkdownPostCase {
  protected readonly post = post;
  private readonly heard = signal<string | null>(null);
  protected readonly readout = () => {
    const href = this.heard();
    return href === null
      ? $localize`:@@whatsNew.a6_2.waiting:Link not pressed yet (front matter title: ${String(this.post.attributes['title'])}:title:)`
      : $localize`:@@whatsNew.a6_2.heard:Link pressed: ${href}:href:`;
  };

  protected pressed(link: MarkdownLinkPress): void {
    link.preventDefault();
    this.heard.set(link.href);
  }
}
