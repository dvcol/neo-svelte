import { describe, expect, it } from 'vitest';

import { BorderRadiusSize, computeBorderRadius } from './border.utils.js';

describe('computeBorderRadius', { tags: ['jsdom'] }, () => {
  it('returns undefined for boolean or undefined input (variant flags handled by caller)', () => {
    expect(computeBorderRadius()).toBeUndefined();
    expect(computeBorderRadius(true)).toBeUndefined();
    expect(computeBorderRadius(false)).toBeUndefined();
  });

  it.each(Object.entries(BorderRadiusSize))('size token "%s" maps to its CSS variable', (key, expected) => {
    expect(computeBorderRadius(key as keyof typeof BorderRadiusSize)).toBe(expected);
  });

  it('passes through arbitrary CSS strings unchanged', () => {
    expect(computeBorderRadius('1.25rem')).toBe('1.25rem');
    expect(computeBorderRadius('50%')).toBe('50%');
  });
});
