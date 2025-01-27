import { circOut } from 'svelte/easing';
import { fade, type FadeParams, scale, type ScaleParams } from 'svelte/transition';

import type { TransitionProps } from '@dvcol/svelte-utils/transition';
import type { TransitionWithProps } from '~/utils/action.utils.js';

export const defaultTransitionDuration = 300;

export const enterFreezeTransition: TransitionProps = {
  duration: defaultTransitionDuration,
  freeze: true,
  css: `overflow: hidden; white-space: nowrap`,
};

export const enterTransitionProps: TransitionProps = { duration: 200 };
export const leaveTransitionProps: TransitionProps = { delay: 200, duration: 100 };

export const enterDefaultFadeTransition: TransitionWithProps<FadeParams> = {
  use: fade,
  props: enterTransitionProps,
};

export const leaveDefaultFadeTransition: TransitionWithProps<FadeParams> = {
  use: fade,
  props: leaveTransitionProps,
};

export const scaleTransitionProps: TransitionProps = { duration: defaultTransitionDuration, start: 0.95 };

export const scaleTransition: TransitionWithProps<ScaleParams> = {
  use: scale,
  props: scaleTransitionProps,
};

export const flipTransitionProps: TransitionProps = { duration: 200, ease: circOut, delay: 100 };
