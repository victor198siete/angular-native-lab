import { Component, Renderer2, inject, input, signal } from '@angular/core';
import { Pressable, ScrollView, Text, View } from '@ng-native/components';
import { IcuV1, IcuV1i, IcuV2, IcuV2i, IcuV3, IcuV3i, IcuV4, IcuV5, IcuV6, IcuV7 } from './icu-variants.ts';

/**
 * Temporary reproduction screen (`/--/repro/icu`). A button mounts one variant behind an `@if`; `?v=v3` mounts it
 * 1.5 s after the screen is up, so each variant can start from a fresh launch.
 */
@Component({
  selector: 'app-icu-repro',
  imports: [View, Text, Pressable, ScrollView, IcuV1, IcuV1i, IcuV2, IcuV2i, IcuV3, IcuV3i, IcuV4, IcuV5, IcuV6, IcuV7],
  host: { style: 'flex: 1' },
  template: `
    <scroll-view [style]="{ flex: 1, padding: 16, paddingTop: 80 }">
      <text testID="probe">{{ probe() }}</text>
      <text testID="shown">shown: {{ shown() }}</text>
      <view [style]="{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 12 }">
        @for (name of names; track name) {
          <pressable
            [style]="{ padding: 12, backgroundColor: '#ddd', borderRadius: 8 }"
            [testID]="'show-' + name"
            [nativeID]="'show-' + name"
            accessibilityRole="button"
            (press)="show(name)"
          >
            <text>{{ name }}</text>
          </pressable>
        }
      </view>
      <view testID="stage">
        @switch (shown()) {
          @case ('v1') { <app-icu-v1 /> }
          @case ('v1i') { <app-icu-v1i /> }
          @case ('v2') { <app-icu-v2 /> }
          @case ('v2i') { <app-icu-v2i /> }
          @case ('v3') { <app-icu-v3 /> }
          @case ('v3i') { <app-icu-v3i /> }
          @case ('v4') { <app-icu-v4 /> }
          @case ('v5') { <app-icu-v5 /> }
          @case ('v6') { <app-icu-v6 /> }
          @case ('v7') { <app-icu-v7 /> }
        }
      </view>
    </scroll-view>
  `,
})
export class IcuReproScreen {
  /** Query param `v`: the variant to mount on its own. */
  readonly v = input<string>();

  protected readonly names = ['v1', 'v1i', 'v2', 'v2i', 'v3', 'v3i', 'v4', 'v5', 'v6', 'v7'];
  protected readonly shown = signal('none');
  protected readonly probe = signal('probe: pending');

  constructor() {
    const renderer = inject(Renderer2);
    // What the global `Node` answers for a node the renderer made (the 0.11 note says true on iOS and Android).
    let line: string;
    try {
      const NodeG = (globalThis as { Node?: unknown }).Node as (abstract new () => unknown) | undefined;
      const comment = renderer.createComment('probe');
      const el = renderer.createElement('view');
      line =
        `typeof Node=${typeof NodeG}; comment instanceof Node=${NodeG ? comment instanceof NodeG : 'n/a'}; ` +
        `view instanceof Node=${NodeG ? el instanceof NodeG : 'n/a'}; comment.nodeType=${String((comment as { nodeType?: unknown }).nodeType)}`;
    } catch (e) {
      line = `probe threw: ${String(e)}`;
    }
    this.probe.set(line);
    setTimeout(() => {
      const v = this.v();
      if (v) this.show(v);
    }, 1500);
  }

  protected show(name: string): void {
    this.shown.set(name);
  }
}
