import qrcode from 'qrcode-generator';

export interface QrSvg {
  /** Square SVG markup for `<ng-icon [svg]>`: dark cells as one path on a white square. */
  readonly svg: string;
  /** Cells per side, without the quiet zone. */
  readonly modules: number;
}

/**
 * A QR code as SVG, for `@ng-native/icons` to draw as native shapes - no QR library for React
 * Native involved. Each row's run of dark cells is one rectangle in a single path, so a code of
 * a few hundred dark cells is a few dozen path segments rather than hundreds of nodes.
 *
 * `quiet` is the blank margin scanners need around the code, in cells (the spec asks for 4).
 */
export function qrSvg(text: string, quiet = 4): QrSvg {
  const qr = qrcode(0, 'M');
  qr.addData(text);
  qr.make();
  const modules = qr.getModuleCount();

  let d = '';
  for (let row = 0; row < modules; row++) {
    let col = 0;
    while (col < modules) {
      if (!qr.isDark(row, col)) {
        col++;
        continue;
      }
      const start = col;
      while (col < modules && qr.isDark(row, col)) col++;
      d += `M${start + quiet} ${row + quiet}h${col - start}v1h-${col - start}z`;
    }
  }

  const size = modules + quiet * 2;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">` +
    `<rect width="${size}" height="${size}" fill="#ffffff"/>` +
    `<path d="${d}" fill="#000000"/>` +
    `</svg>`;
  return { svg, modules };
}
