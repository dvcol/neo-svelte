import { describe, expect, it } from 'vitest';

import { ArrowPrefix, HexColorRegex, HexColorRegexString } from './regex.utils.js';

describe('hexColorRegex', { tags: ['jsdom'] }, () => {
  it('matches 6-digit hex colors (case-insensitive)', () => {
    expect(HexColorRegex.test('#ff00aa')).toBe(true);
    expect(HexColorRegex.test('#FF00AA')).toBe(true);
  });

  it('matches 3-digit hex shorthand', () => {
    expect(HexColorRegex.test('#abc')).toBe(true);
    expect(HexColorRegex.test('#ABC')).toBe(true);
  });

  it('rejects strings missing the leading "#"', () => {
    expect(HexColorRegex.test('ffaabb')).toBe(false);
  });

  it('rejects 4/5/7/8-digit lengths', () => {
    expect(HexColorRegex.test('#fff0')).toBe(false);
    expect(HexColorRegex.test('#fffff')).toBe(false);
    expect(HexColorRegex.test('#ffaabb1')).toBe(false);
    expect(HexColorRegex.test('#ffaabbcc')).toBe(false);
  });

  it('rejects non-hex characters', () => {
    expect(HexColorRegex.test('#zzzzzz')).toBe(false);
  });
});

describe('hexColorRegexString', { tags: ['jsdom'] }, () => {
  it('encodes the same alternation as HexColorRegex (case-sensitive)', () => {
    const re = new RegExp(HexColorRegexString);
    expect(re.test('#ff00aa')).toBe(true);
    expect(re.test('#FF00AA')).toBe(true);
    expect(re.test('#abcd')).toBe(false);
  });
});

describe('arrowPrefix', { tags: ['jsdom'] }, () => {
  it('matches arrow keyboard event names like ArrowUp/ArrowDown', () => {
    expect(ArrowPrefix.test('ArrowUp')).toBe(true);
    expect(ArrowPrefix.test('ArrowDown')).toBe(true);
    expect(ArrowPrefix.test('ArrowLeft')).toBe(true);
    expect(ArrowPrefix.test('ArrowRight')).toBe(true);
  });

  it('does not match other keyboard event names', () => {
    expect(ArrowPrefix.test('Enter')).toBe(false);
    expect(ArrowPrefix.test('arrowUp')).toBe(false);
  });
});
