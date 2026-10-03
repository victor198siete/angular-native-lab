import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-native/icons';
import { render } from '@ng-native/testing';
import { describe, expect, it } from 'vitest';
import { qrSvg } from './qr.ts';

interface Node {
  viewName: string;
  props: Record<string, unknown>;
  children: Node[];
}
const find = (nodes: readonly Node[], name: string): Node[] =>
  nodes.flatMap((n) => [...(n.viewName === name ? [n] : []), ...find(n.children, name)]);

@Component({ selector: 'app-qr-host', imports: [NgIcon], template: `<ng-icon [svg]="svg()" [size]="240" />` })
class QrHost {
  readonly svg = input.required<string>();
}

describe('qrSvg', () => {
  it('encodes a voucher code as a version-1 QR (21 cells) with a 4-cell quiet zone', () => {
    const { svg, modules } = qrSvg('LAB-389N-XL52');
    expect(modules).toBe(21);
    expect(svg).toContain('viewBox="0 0 29 29"');
    expect(svg.match(/<path /g)).toHaveLength(1);
  });

  it('draws the three finder patterns: their top rows are 7-cell runs', () => {
    const { svg } = qrSvg('LAB-389N-XL52');
    // Top-left at x=4 and top-right at x=4+21-7=18, both on the first row (y=4).
    expect(svg).toContain('M4 4h7v1h-7z');
    expect(svg).toContain('M18 4h7v1h-7z');
    // Bottom-left starts at row 4+21-7=18.
    expect(svg).toContain('M4 18h7v1h-7z');
  });

  it('is deterministic, and different codes give different drawings', () => {
    expect(qrSvg('LAB-389N-XL52').svg).toBe(qrSvg('LAB-389N-XL52').svg);
    expect(qrSvg('LAB-W7UD-A389').svg).not.toBe(qrSvg('LAB-389N-XL52').svg);
  });

  it('renders through <ng-icon [svg]> as native react-native-svg shapes', async () => {
    const { fabric } = await render(QrHost, { inputs: { svg: qrSvg('LAB-389N-XL52').svg } });
    const tree = fabric.committed as unknown as Node[];
    expect(find(tree, 'RNSVGSvgView')).toHaveLength(1);
    expect(find(tree, 'RNSVGRect')).toHaveLength(1);
    expect(find(tree, 'RNSVGPath')).toHaveLength(1);
  });
});
