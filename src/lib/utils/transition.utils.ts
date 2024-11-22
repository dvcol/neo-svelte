import type { TransitionProps } from '@dvcol/svelte-utils/transition';

export const defaultTransitionDuration = 300;

export const enterFreezeTransition: TransitionProps = {
  duration: defaultTransitionDuration,
  freeze: true,
  css: `overflow: hidden; white-space: nowrap`,
};

export const enterDefaultTransition: TransitionProps = { duration: 200 };
export const leaveDefaultTransition: TransitionProps = { delay: 200, duration: 200 };
