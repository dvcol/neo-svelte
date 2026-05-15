import { describe, expect, it } from 'vitest';

import { Colors, ColorVariables, getColorVariable } from './colors.utils.js';

describe('getColorVariable', { tags: ['jsdom'] }, () => {
  it('returns undefined for falsy color', () => {
    expect(getColorVariable()).toBeUndefined();
    expect(getColorVariable('')).toBe('');
  });

  it.each(Object.values(Colors))('maps known color "%s" to its var() expression', (name) => {
    expect(getColorVariable(name)).toBe(`var(${ColorVariables[name]})`);
  });

  it('passes unknown color strings through verbatim', () => {
    expect(getColorVariable('rebeccapurple')).toBe('rebeccapurple');
    expect(getColorVariable('#ff00aa')).toBe('#ff00aa');
  });
});
