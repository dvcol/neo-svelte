import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoIconAdd from './NeoIconAdd.svelte';
import NeoIconAlert from './NeoIconAlert.svelte';
import NeoIconAlignBottom from './NeoIconAlignBottom.svelte';
import NeoIconAlignMiddle from './NeoIconAlignMiddle.svelte';
import NeoIconAlignTop from './NeoIconAlignTop.svelte';
import NeoIconCalendar from './NeoIconCalendar.svelte';
import NeoIconCancel from './NeoIconCancel.svelte';
import NeoIconCircle from './NeoIconCircle.svelte';
import NeoIconClear from './NeoIconClear.svelte';
import NeoIconClose from './NeoIconClose.svelte';
import NeoIconCog from './NeoIconCog.svelte';
import NeoIconConfirm from './NeoIconConfirm.svelte';
import NeoIconCube from './NeoIconCube.svelte';
import NeoIconDoubleChevronLeft from './NeoIconDoubleChevronLeft.svelte';
import NeoIconDoubleChevronRight from './NeoIconDoubleChevronRight.svelte';
import NeoIconDownload from './NeoIconDownload.svelte';
import NeoIconEmpty from './NeoIconEmpty.svelte';
import NeoIconError from './NeoIconError.svelte';
import NeoIconFileUpload from './NeoIconFileUpload.svelte';
import NeoIconFire from './NeoIconFire.svelte';
import NeoIconGithub from './NeoIconGithub.svelte';
import NeoIconInfo from './NeoIconInfo.svelte';
import NeoIconList from './NeoIconList.svelte';
import NeoIconLoadingMatrix from './NeoIconLoadingMatrix.svelte';
import NeoIconMail from './NeoIconMail.svelte';
import NeoIconMinus from './NeoIconMinus.svelte';
import NeoIconPaint from './NeoIconPaint.svelte';
import NeoIconPencil from './NeoIconPencil.svelte';
import NeoIconQuestionMark from './NeoIconQuestionMark.svelte';
import NeoIconRefresh from './NeoIconRefresh.svelte';
import NeoIconRestore from './NeoIconRestore.svelte';
import NeoIconSave from './NeoIconSave.svelte';
import NeoIconSaveOff from './NeoIconSaveOff.svelte';
import NeoIconSearch from './NeoIconSearch.svelte';
import NeoIconSuccess from './NeoIconSuccess.svelte';
import NeoIconSun from './NeoIconSun.svelte';
import NeoIconTextHighlight from './NeoIconTextHighlight.svelte';
import NeoIconTrend from './NeoIconTrend.svelte';
import NeoIconVideo from './NeoIconVideo.svelte';
import NeoIconWarning from './NeoIconWarning.svelte';
import NeoIconWatch from './NeoIconWatch.svelte';
import NeoIconWatchOff from './NeoIconWatchOff.svelte';
import NeoIconWave from './NeoIconWave.svelte';

afterEach(() => {
  cleanup();
});

const basicIcons = [
  ['NeoIconAdd', NeoIconAdd],
  ['NeoIconAlert', NeoIconAlert],
  ['NeoIconAlignBottom', NeoIconAlignBottom],
  ['NeoIconAlignMiddle', NeoIconAlignMiddle],
  ['NeoIconAlignTop', NeoIconAlignTop],
  ['NeoIconCalendar', NeoIconCalendar],
  ['NeoIconCancel', NeoIconCancel],
  ['NeoIconCircle', NeoIconCircle],
  ['NeoIconClear', NeoIconClear],
  ['NeoIconClose', NeoIconClose],
  ['NeoIconCog', NeoIconCog],
  ['NeoIconConfirm', NeoIconConfirm],
  ['NeoIconCube', NeoIconCube],
  ['NeoIconDoubleChevronLeft', NeoIconDoubleChevronLeft],
  ['NeoIconDoubleChevronRight', NeoIconDoubleChevronRight],
  ['NeoIconDownload', NeoIconDownload],
  ['NeoIconEmpty', NeoIconEmpty],
  ['NeoIconError', NeoIconError],
  ['NeoIconFileUpload', NeoIconFileUpload],
  ['NeoIconFire', NeoIconFire],
  ['NeoIconGithub', NeoIconGithub],
  ['NeoIconInfo', NeoIconInfo],
  ['NeoIconList', NeoIconList],
  ['NeoIconLoadingMatrix', NeoIconLoadingMatrix],
  ['NeoIconMail', NeoIconMail],
  ['NeoIconMinus', NeoIconMinus],
  ['NeoIconPaint', NeoIconPaint],
  ['NeoIconPencil', NeoIconPencil],
  ['NeoIconQuestionMark', NeoIconQuestionMark],
  ['NeoIconRefresh', NeoIconRefresh],
  ['NeoIconRestore', NeoIconRestore],
  ['NeoIconSave', NeoIconSave],
  ['NeoIconSaveOff', NeoIconSaveOff],
  ['NeoIconSearch', NeoIconSearch],
  ['NeoIconSuccess', NeoIconSuccess],
  ['NeoIconSun', NeoIconSun],
  ['NeoIconTextHighlight', NeoIconTextHighlight],
  ['NeoIconTrend', NeoIconTrend],
  ['NeoIconVideo', NeoIconVideo],
  ['NeoIconWarning', NeoIconWarning],
  ['NeoIconWatch', NeoIconWatch],
  ['NeoIconWatchOff', NeoIconWatchOff],
  ['NeoIconWave', NeoIconWave],
] as const;

describe('basic neo icons — render an svg with the default 1em sizing', () => {
  for (const [name, Component] of basicIcons) {
    it(`${name} renders an svg with width=1em`, async () => {
      const { container } = render(Component, { props: {} as never });
      await tick();
      const svg = container.querySelector<SVGSVGElement>('svg')!;
      expect(svg).not.toBeNull();
      expect(svg.getAttribute('width')).toBe('1em');
      expect(svg.getAttribute('height')).toBe('1em');
      expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
    });
  }
});

describe('basic neo icons — size, scale, stroke pass-through', () => {
  for (const [name, Component] of basicIcons) {
    it(`${name} forwards size and scale to the svg`, async () => {
      const { container } = render(Component, {
        props: { size: '32px', scale: 2 } as never,
      });
      await tick();
      const svg = container.querySelector<SVGSVGElement>('svg')!;
      expect(svg.getAttribute('width')).toBe('32px');
      expect(svg.getAttribute('height')).toBe('32px');
      expect(svg.style.scale).toBe('2');
    });
  }
});

describe('basic neo icons — extra svg attributes pass through (data-*, aria-*)', () => {
  for (const [name, Component] of basicIcons) {
    it(`${name} forwards data-testid and aria-label`, async () => {
      const { container } = render(Component, {
        props: { 'data-testid': 'icon', 'aria-label': name } as never,
      });
      await tick();
      const svg = container.querySelector<SVGSVGElement>('svg')!;
      expect(svg.getAttribute('data-testid')).toBe('icon');
      expect(svg.getAttribute('aria-label')).toBe(name);
    });
  }
});
