import { circOut } from 'svelte/easing';
import { fade, type FadeParams, scale, type ScaleParams } from 'svelte/transition';

import type { TransitionProps } from '@dvcol/svelte-utils/transition';
import type { TransitionWithProps } from '~/utils/action.utils.js';

export const defaultFlyDuration = 400;
export const defaultTransitionDuration = 300;
export const defaultEnterDuration = 200;

export const enterFreezeTransition: TransitionProps = {
  duration: defaultTransitionDuration,
  freeze: true,
  css: `overflow: hidden; white-space: nowrap`,
};

export const enterTransitionProps: TransitionProps = { duration: defaultEnterDuration };
export const leaveTransitionProps: TransitionProps = { delay: defaultEnterDuration, duration: defaultEnterDuration / 2 };

export const enterDefaultFadeTransition: TransitionWithProps<FadeParams> = {
  use: fade,
  props: enterTransitionProps,
};

export const leaveDefaultFadeTransition: TransitionWithProps<FadeParams> = {
  use: fade,
  props: leaveTransitionProps,
};

export const scaleTransitionProps: TransitionProps = { duration: defaultEnterDuration, start: 0.95 };

export const scaleEnterProps: TransitionProps = { duration: defaultEnterDuration, start: 0.95 };
export const scaleLeaveProps: TransitionProps = { duration: defaultEnterDuration, start: 0.95, delay: defaultEnterDuration / 2 };

export const scaleTransition: TransitionWithProps<ScaleParams> = {
  use: scale,
  props: scaleTransitionProps,
};

export const flipTransitionProps: TransitionProps = { duration: defaultEnterDuration, ease: circOut, delay: defaultEnterDuration / 2 };
