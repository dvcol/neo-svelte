import { circOut } from 'svelte/easing';

import type { TransitionProps } from '@dvcol/svelte-utils/transition';

export const defaultDuration = 400;
export const shortDuration = 300;
export const quickDuration = 200;

export const shortFreezeTransition: TransitionProps = {
  duration: shortDuration,
  freeze: true,
  css: `white-space: nowrap`,
};

export const quickDurationProps: TransitionProps = { duration: quickDuration };
export const quickDelayProps: TransitionProps = { delay: quickDuration, duration: quickDuration / 2 };

export const quickScaleProps: TransitionProps = { duration: quickDuration, start: 0.95 };
export const quickScaleDelayProps: TransitionProps = { duration: quickDuration, start: 0.95, delay: quickDuration / 2 };

export const quickCircOutProps: TransitionProps = { duration: quickDuration, ease: circOut, delay: quickDuration / 2 };
