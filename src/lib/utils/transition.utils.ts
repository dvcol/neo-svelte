import { fade, type FadeParams } from 'svelte/transition';

import type { TransitionProps } from '@dvcol/svelte-utils/transition';
import type { TransitionWithProps } from '~/utils/action.utils.js';

export const defaultTransitionDuration = 300;

export const enterFreezeTransition: TransitionProps = {
  duration: defaultTransitionDuration,
  freeze: true,
  css: `overflow: hidden; white-space: nowrap`,
};

export const enterDefaultTransition: TransitionProps = { duration: 200 };
export const leaveDefaultTransition: TransitionProps = { delay: 200, duration: 100 };

export const enterDefaultFadeTransition: TransitionWithProps<FadeParams> = {
  use: fade,
  props: enterDefaultTransition,
};

export const leaveDefaultFadeTransition: TransitionWithProps<FadeParams> = {
  use: fade,
  props: leaveDefaultTransition,
};
