import { describe, expect, it } from 'vitest';

import { invertPlacement, reversePlacement } from './neo-placement.model.js';

describe('reversePlacement', { tags: ['jsdom'] }, () => {
  it.each([
    ['right', 'left'],
    ['right-start', 'left-start'],
    ['right-end', 'left-end'],
    ['left', 'right'],
    ['left-start', 'right-start'],
    ['left-end', 'right-end'],
  ] as const)('reverses %s -> %s', (input, expected) => {
    expect(reversePlacement(input)).toBe(expected);
  });

  it.each(['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'auto'] as const)(
    'leaves vertical / auto placement %s unchanged',
    (input) => {
      expect(reversePlacement(input)).toBe(input);
    },
  );

  it('returns undefined for undefined input', () => {
    expect(reversePlacement(undefined)).toBeUndefined();
  });
});

describe('invertPlacement', { tags: ['jsdom'] }, () => {
  it.each([
    ['top', 'bottom'],
    ['top-start', 'bottom-start'],
    ['top-end', 'bottom-end'],
    ['bottom', 'top'],
    ['bottom-start', 'top-start'],
    ['bottom-end', 'top-end'],
  ] as const)('inverts %s -> %s', (input, expected) => {
    expect(invertPlacement(input)).toBe(expected);
  });

  it.each(['left', 'left-start', 'left-end', 'right', 'right-start', 'right-end', 'auto'] as const)(
    'leaves horizontal / auto placement %s unchanged',
    (input) => {
      expect(invertPlacement(input)).toBe(input);
    },
  );

  it('returns undefined for undefined input', () => {
    expect(invertPlacement(undefined)).toBeUndefined();
  });
});
