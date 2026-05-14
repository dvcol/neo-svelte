import { describe, expect, it } from 'vitest';

import { NeoTextButton } from '~/buttons/neo-button.model.js';

import {
  coerce,
  computeButtonTemplate,
  computeElevation,
  computeGlassFilter,
  computeHoverShadowElevation,
  computeShadowElevation,
  DefaultShadowActiveElevation,
  DefaultShadowElevation,
  DefaultShadowHoverElevation,
  DefaultShadowHoverPressedElevation,
  DefaultShadowPressedElevation,
  getDefaultElevation,
  getDefaultHoverElevation,
  getDefaultSlideElevation,
  isShadowFlat,
  MaxShadowElevation,
  MinShadowElevation,
  parseBlur,
} from './shadow.utils.js';

describe('coerce', () => {
  it('returns the elevation untouched when within bounds', () => {
    expect(coerce<number>(2, { min: -5, max: 5 })).toBe(2);
  });

  it('clamps to the min bound', () => {
    expect(coerce<number>(-10, { min: -5, max: 5 })).toBe(-5);
  });

  it('clamps to the max bound', () => {
    expect(coerce<number>(99, { min: -5, max: 5 })).toBe(5);
  });

  it('coerces numeric strings to numbers', () => {
    expect(coerce<number>('3', { min: -5, max: 5 })).toBe(3);
  });

  it('returns nullish input unchanged', () => {
    expect(coerce<number>(undefined as unknown as number)).toBeUndefined();
    expect(coerce<number>(null as unknown as number)).toBeNull();
  });

  it('omits min/max when not provided', () => {
    expect(coerce<number>(100)).toBe(100);
    expect(coerce<number>(-100)).toBe(-100);
  });
});

describe('parseBlur', () => {
  it('returns the min default (1) when no blur is provided', () => {
    expect(parseBlur(undefined, 3)).toBe(1);
  });

  it('returns the min default when no elevation is provided', () => {
    expect(parseBlur(2, undefined)).toBe(1);
  });

  it('respects an explicit min override when blur is missing', () => {
    expect(parseBlur(undefined, 3, { min: 2, max: 5 })).toBe(2);
  });

  it('returns the blur value clamped to min/max when both blur and elevation are present', () => {
    expect(parseBlur(3, 4)).toBe(3);
    expect(parseBlur(10 as unknown as 5, 4)).toBe(5);
    expect(parseBlur(-1 as unknown as 0, 4, { min: 1, max: 5 })).toBe(1);
  });
});

describe('isShadowFlat', () => {
  it('matches flat shadow expressions', () => {
    expect(isShadowFlat('var(--neo-box-shadow-flat)')).toBe(true);
    expect(isShadowFlat('something flat;')).toBe(true);
  });

  it('does not match non-flat shadows', () => {
    expect(isShadowFlat('var(--neo-box-shadow-raised-2)')).toBe(false);
    expect(isShadowFlat('var(--neo-box-shadow-inset-1)')).toBe(false);
  });
});

describe('computeElevation', () => {
  it('returns the elevation when within range', () => {
    expect(computeElevation(2)).toBe(2);
  });

  it('clamps to MinShadowElevation by default', () => {
    expect(computeElevation(-99)).toBe(MinShadowElevation);
  });

  it('clamps to MaxShadowElevation by default', () => {
    expect(computeElevation(99)).toBe(MaxShadowElevation);
  });

  it('honors custom min/max bounds', () => {
    expect(computeElevation(99, { max: 3 })).toBe(3);
    expect(computeElevation(-99, { min: -3 })).toBe(-3);
  });
});

describe('computeShadowElevation', () => {
  it('returns the flat token at level 0', () => {
    expect(computeShadowElevation(0)).toBe('var(--neo-box-shadow-flat)');
  });

  it('returns raised for positive elevation', () => {
    expect(computeShadowElevation(2)).toBe('var(--neo-box-shadow-raised-2)');
  });

  it('returns convex for positive elevation when convex=true', () => {
    expect(computeShadowElevation(2, { convex: true })).toBe('var(--neo-box-shadow-convex-2)');
  });

  it('returns inset for negative elevation', () => {
    expect(computeShadowElevation(-2)).toBe('var(--neo-box-shadow-inset-2)');
  });

  it('returns pressed when pressed flag is set on negative elevation', () => {
    expect(computeShadowElevation(-2, { pressed: true })).toBe('var(--neo-box-shadow-pressed-2)');
  });

  it('returns active when active flag is set on negative elevation', () => {
    expect(computeShadowElevation(-2, { active: true })).toBe('var(--neo-box-shadow-active-2)');
  });

  it('active overrides pressed when both are set', () => {
    expect(computeShadowElevation(-2, { pressed: true, active: true })).toBe('var(--neo-box-shadow-active-2)');
  });

  it('uses the glass shadow scale when glass=true', () => {
    expect(computeShadowElevation(2, { glass: true })).toBe('var(--neo-glass-box-shadow-raised-2)');
    expect(computeShadowElevation(0, { glass: true })).toBe('var(--neo-glass-box-shadow-flat)');
    expect(computeShadowElevation(-2, { glass: true, pressed: true })).toBe('var(--neo-glass-box-shadow-pressed-2)');
  });

  it('clamps elevation past min/max before producing the token', () => {
    expect(computeShadowElevation(99)).toBe('var(--neo-box-shadow-raised-5)');
    expect(computeShadowElevation(-99)).toBe('var(--neo-box-shadow-inset-5)');
    expect(computeShadowElevation(99, {}, { max: 3 })).toBe('var(--neo-box-shadow-raised-3)');
  });

  it('truncates fractional elevations', () => {
    expect(computeShadowElevation(2.7)).toBe('var(--neo-box-shadow-raised-2)');
    expect(computeShadowElevation(-2.7)).toBe('var(--neo-box-shadow-inset-2)');
  });
});

describe('computeHoverShadowElevation', () => {
  it('returns undefined when hover is missing or zero', () => {
    expect(computeHoverShadowElevation(2, undefined)).toBeUndefined();
    expect(computeHoverShadowElevation(2, 0)).toBeUndefined();
  });

  it('adds hover delta to the base elevation before computing the token', () => {
    expect(computeHoverShadowElevation(2, 1)).toBe('var(--neo-box-shadow-raised-3)');
    expect(computeHoverShadowElevation(2, -3)).toBe('var(--neo-box-shadow-inset-1)');
    expect(computeHoverShadowElevation(2, -2)).toBe('var(--neo-box-shadow-flat)');
  });

  it('threads modifiers through to computeShadowElevation', () => {
    expect(computeHoverShadowElevation(2, -3, { pressed: true })).toBe('var(--neo-box-shadow-pressed-1)');
    expect(computeHoverShadowElevation(2, 1, { glass: true, convex: true })).toBe('var(--neo-glass-box-shadow-convex-3)');
  });
});

describe('computeGlassFilter', () => {
  it('returns undefined when glass is not enabled', () => {
    expect(computeGlassFilter(2)).toBeUndefined();
    expect(computeGlassFilter(2, false)).toBeUndefined();
  });

  it('produces a blur+saturate filter when glass=true', () => {
    expect(computeGlassFilter(2, true)).toBe('var(--neo-blur-2) var(--neo-saturate-3)');
  });

  it('uses absolute elevation so negative values still pick a positive blur', () => {
    expect(computeGlassFilter(-3, true)).toBe('var(--neo-blur-3) var(--neo-saturate-3)');
  });

  it('clamps blur via min and max', () => {
    expect(computeGlassFilter(0, true)).toBe('var(--neo-blur-1) var(--neo-saturate-3)');
    expect(computeGlassFilter(99, true)).toBe('var(--neo-blur-5) var(--neo-saturate-3)');
  });

  it('respects a custom saturation override', () => {
    expect(computeGlassFilter(2, true, { saturation: 5 })).toBe('var(--neo-blur-2) var(--neo-saturate-5)');
  });
});

describe('computeButtonTemplate', () => {
  it('returns NeoTextButton for non-negative elevation', () => {
    expect(computeButtonTemplate(0)).toBe(NeoTextButton);
    expect(computeButtonTemplate(3)).toBe(NeoTextButton);
  });

  it('returns NeoTextButton when text=true regardless of elevation', () => {
    expect(computeButtonTemplate(-3, false, true)).toBe(NeoTextButton);
  });

  it('builds a depressed template for negative elevation', () => {
    expect(computeButtonTemplate(-2)).toEqual({
      elevation: 2,
      hover: 0,
      active: -2,
      pressed: true,
      borderless: true,
    });
  });

  it('clamps the depressed template elevation to 3', () => {
    expect(computeButtonTemplate(-5)).toEqual(expect.objectContaining({ elevation: 3 }));
  });
});

describe('default elevation helpers', () => {
  it('getDefaultElevation falls back to DefaultShadowElevation by default', () => {
    expect(getDefaultElevation()).toBe(DefaultShadowElevation);
    expect(getDefaultElevation(false)).toBe(DefaultShadowElevation);
  });

  it('getDefaultElevation returns the pressed default when pressed=true', () => {
    expect(getDefaultElevation(true)).toBe(DefaultShadowPressedElevation);
  });

  it('getDefaultElevation honors a custom fallback when not pressed', () => {
    expect(getDefaultElevation(false, 4)).toBe(4);
    expect(getDefaultElevation(true, 4)).toBe(DefaultShadowPressedElevation);
  });

  it('getDefaultHoverElevation defaults to the hover constant', () => {
    expect(getDefaultHoverElevation()).toBe(DefaultShadowHoverElevation);
  });

  it('getDefaultHoverElevation returns the hover-pressed default when pressed=true', () => {
    expect(getDefaultHoverElevation(true)).toBe(DefaultShadowHoverPressedElevation);
  });

  it('getDefaultSlideElevation flips negative elevations to their absolute value', () => {
    expect(getDefaultSlideElevation(-3)).toBe(3);
    expect(getDefaultSlideElevation(-1)).toBe(1);
  });

  it('getDefaultSlideElevation falls back to the pressed default when elevation is non-negative', () => {
    expect(getDefaultSlideElevation(0)).toBe(DefaultShadowPressedElevation);
    expect(getDefaultSlideElevation(2)).toBe(DefaultShadowPressedElevation);
  });

  it('getDefaultSlideElevation honors a custom non-negative fallback', () => {
    expect(getDefaultSlideElevation(0, 4)).toBe(4);
    expect(getDefaultSlideElevation(-2, 4)).toBe(2);
  });
});

describe('exposed constants', () => {
  it('keep the documented default values', () => {
    expect(DefaultShadowActiveElevation).toBe(-2);
    expect(DefaultShadowPressedElevation).toBe(-2);
    expect(DefaultShadowElevation).toBe(3);
  });
});
