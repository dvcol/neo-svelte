import { describe, expect, it } from 'vitest';

import * as PublicAPI from './index.js';

describe('public barrel (src/lib/index.ts)', { tags: ['jsdom'] }, () => {
  it('re-exports a substantive number of named entries (smoke check)', () => {
    expect(Object.keys(PublicAPI).length).toBeGreaterThan(50);
  });

  it('re-exports headline button components', () => {
    for (const name of [
      'NeoButton',
      'NeoButtonGroup',
      'NeoButtonRow',
      'NeoArrowButton',
      'NeoCancelButton',
      'NeoCheckboxButton',
      'NeoCloseButton',
      'NeoRadioButton',
      'NeoSwitchButton',
    ]) {
      expect(PublicAPI, `expected ${name} on PublicAPI`).toHaveProperty(name);
    }
  });

  it('re-exports headline form & input components', () => {
    for (const name of ['NeoForm', 'NeoFieldset', 'NeoInput', 'NeoSelect', 'NeoNativeSelect', 'NeoRange', 'NeoCheckbox', 'NeoRadio', 'NeoSwitch']) {
      expect(PublicAPI, `expected ${name} on PublicAPI`).toHaveProperty(name);
    }
  });

  it('re-exports floating components (tooltip/menu/dialog/drawer/portal)', () => {
    for (const name of ['NeoTooltip', 'NeoMenu', 'NeoDialog', 'NeoDrawer', 'NeoPortal']) {
      expect(PublicAPI, `expected ${name} on PublicAPI`).toHaveProperty(name);
    }
  });

  it('re-exports leaf primitives (card/badge/pill/divider/cursor)', () => {
    for (const name of ['NeoCard', 'NeoBadge', 'NeoPill', 'NeoDivider', 'NeoCursor']) {
      expect(PublicAPI, `expected ${name} on PublicAPI`).toHaveProperty(name);
    }
  });

  it('re-exports utils/index.ts (color helpers)', () => {
    expect(PublicAPI).toHaveProperty('getColorVariable');
    expect(PublicAPI).toHaveProperty('Colors');
    expect(PublicAPI).toHaveProperty('ColorVariables');
  });

  it('does NOT promote internal-only utils (style/border/shadow/error/regex/action) to the public surface', () => {
    // utils/index.ts is the single source of truth for the public utility
    // surface. If any of these become public, update both utils/index.ts AND
    // this assertion deliberately so the contract stays explicit.
    expect(PublicAPI).not.toHaveProperty('toPixel');
    expect(PublicAPI).not.toHaveProperty('computeBorderRadius');
    expect(PublicAPI).not.toHaveProperty('computeShadowElevation');
    expect(PublicAPI).not.toHaveProperty('NeoError');
    expect(PublicAPI).not.toHaveProperty('HexColorRegex');
    expect(PublicAPI).not.toHaveProperty('toAction');
  });
});
