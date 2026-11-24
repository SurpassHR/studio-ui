// @vitest-environment node

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function luminance(hex: string) {
  const channels = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const linear = channels.map((channel) => (
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  ));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrast(foreground: string, background: string) {
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

describe('design token contrast', () => {
  const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');

  it.each([
    ['dark surface', '#131417', ['#f5f5f2', '#c6c6c0', '#929399', '#83848a']],
    ['light surface', '#fbfbf8', ['#1b1c1e', '#4d4f54', '#686a70', '#6f7177']],
  ])('keeps semantic text above 4.5:1 on %s', (_surface, background, colors) => {
    expect(css).toContain(background);
    for (const color of colors) expect(contrast(color, background)).toBeGreaterThanOrEqual(4.5);
  });
});
