import type { TransitionProps } from '@dvcol/svelte-utils/transition';

export const defaultTransitionDuration = 300;

export const enterTransition: TransitionProps = {
  duration: defaultTransitionDuration,
  freeze: true,
  css: `overflow: hidden; white-space: nowrap`,
};
