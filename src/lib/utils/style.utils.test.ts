import { describe, expect, it } from 'vitest';

import { isSizeOption, toPixel, toSize } from './style.utils.js';

describe('toPixel', () => {
  it('returns undefined for nullish, 0, or empty input (truthy gate)', () => {
    expect(toPixel()).toBeUndefined();
    expect(toPixel(0)).toBeUndefined();
    expect(toPixel('')).toBeUndefined();
  });

  it('appends "px" to a positive number', () => {
    expect(toPixel(120)).toBe('120px');
  });

  it('passes through a string verbatim', () => {
    expect(toPixel('50%')).toBe('50%');
    expect(toPixel('10rem')).toBe('10rem');
  });
});

describe('isSizeOption', () => {
  it('returns true for objects', () => {
    expect(isSizeOption({ absolute: '100px' })).toBe(true);
    expect(isSizeOption({})).toBe(true);
  });

  it('returns false for numbers and strings', () => {
    expect(isSizeOption(100)).toBe(false);
    expect(isSizeOption('100px')).toBe(false);
  });
});

describe('toSize', () => {
  it('returns undefined for nullish input', () => {
    expect(toSize()).toBeUndefined();
    expect(toSize(0)).toBeUndefined();
  });

  it('wraps a number in { absolute: <px-string> }', () => {
    expect(toSize(120)).toEqual({ absolute: '120px' });
  });

  it('wraps a string in { absolute: <string> } verbatim', () => {
    expect(toSize('50%')).toEqual({ absolute: '50%' });
  });

  it('normalizes object inputs by running each value through toPixel', () => {
    expect(toSize({ min: 100, max: 500, absolute: 300 })).toEqual({
      min: '100px',
      max: '500px',
      absolute: '300px',
    });
  });

  it('preserves string values inside an object input', () => {
    expect(toSize({ min: '10rem', max: '50%' })).toEqual({
      min: '10rem',
      max: '50%',
    });
  });
});
