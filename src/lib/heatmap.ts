/** Olive → brass sequential map with a magenta bias in the far field. */
export function heatmap(v: number, nx = 0.5, ny = 0.5): [number, number, number] {
  const t = clamp(v);
  const spatial = clamp(nx * 0.35 + ny * 0.55);
  let hue = 78 - t * 30 - spatial * 110 * Math.pow(t, 1.15);
  hue = ((hue % 360) + 360) % 360;
  const s = 0.44 + t * 0.28;
  const val = 0.42 + t * 0.5;
  return hsv2rgb(hue, Math.min(0.58, s), Math.min(0.9, val));
}

export function rgbCss(rgb: [number, number, number], a = 1) {
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
}

function clamp(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

function hsv2rgb(h: number, s: number, v: number): [number, number, number] {
  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}
