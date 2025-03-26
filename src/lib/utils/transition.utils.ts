import { circOut } from 'svelte/easing';

import type { HeightParams, WidthParams } from '@dvcol/svelte-utils/transition';
import type { EasingFunction, ScaleParams } from 'svelte/transition';

type BaseParams = {
  /**
   * Delay before the transition starts in milliseconds.
   */
  delay?: number;
  /**
   * Duration of the transition in milliseconds.
   */
  duration?: number;
  /**
   * Easing function to apply to the transition.
   */
  easing?: EasingFunction;
};

export const defaultDuration = 400;
export const shortDuration = 300;
export const quickDuration = 200;

export const shortFreezeTransition: WidthParams | HeightParams = {
  duration: shortDuration,
  freeze: true,
  css: `white-space: nowrap`,
};
export const quickDurationProps: BaseParams = { duration: quickDuration };
export const quickDelayProps: BaseParams = { delay: quickDuration, duration: quickDuration / 2 };

export const quickScaleProps: ScaleParams = { duration: quickDuration, start: 0.95 };
export const quickScaleOpacityProps: ScaleParams = { duration: quickDuration, start: 0.95, opacity: 1 };
export const quickScaleDelayProps: ScaleParams = { duration: quickDuration, start: 0.95, delay: quickDuration / 2 };

export const quickCircOutProps: BaseParams = { duration: quickDuration, easing: circOut, delay: quickDuration / 2 };
