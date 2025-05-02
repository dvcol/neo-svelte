import type { SwipeOptions } from '@dvcol/svelte-utils/swipe';
import type { TransitionProps } from '@dvcol/svelte-utils/transition';
import type { NeoArrowButtonProps } from 'src/lib/index.js';
import type { Snippet } from 'svelte';

import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoIconButtonProps } from '~/buttons/neo-icon-button.model.js';
import type { NeoProgressBarProps } from '~/progress/neo-progress-bar.model.js';
import type { NeoProgressMarkProps } from '~/progress/neo-progress-mark.model.js';
import type { HTMLTransitionProps } from '~/utils/action.utils.js';
import type { BorderRadiusInput } from '~/utils/border.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps, HTMLTagProps } from '~/utils/html-element.utils.js';
import type { ShadowShallowElevation, ShadowShallowElevationString } from '~/utils/shadow.utils.js';
import type { SizeInput } from '~/utils/style.utils.js';

export const NeoStepperPlacement = {
  Start: 'start' as const,
  End: 'end' as const,
} as const;

export type NeoStepperPlacements = (typeof NeoStepperPlacement)[keyof typeof NeoStepperPlacement];

export const NeoStepperNavigation = {
  Navigate: 'navigate' as const,
  Previous: 'previous' as const,
  Cancel: 'cancel' as const,
  Next: 'next' as const,
} as const;

export type NeoStepperNavigations = (typeof NeoStepperNavigation)[keyof typeof NeoStepperNavigation];
export type NeoStepperLoadingState = Record<NeoStepperNavigations, boolean>;

export interface NeoStepperContext<Value = unknown> {
  /**
   * Step cursor containing the current, next and previous steps.
   */
  step: {
    /**
     * The active step.
     */
    current: NeoStepperStep<Value>;
    /**
     * The next step (active + 1).
     */
    next?: NeoStepperStep<Value>;
    /**
     * The previous step (active - 1).
     */
    previous?: NeoStepperStep<Value>;
  };
  /**
   * Index of the active step.
   */
  active?: number;
  /**
   * Index of the n-1 step (non necessarily an adjacent step).
   */
  last?: number;

  /**
   * Method to navigate to a specific step.
   *
   * This is imperative navigation, it will not check if next or previous constraints are met.
   * But, it will check if the target step is disabled.
   *
   * @param step - index of the step to navigate to.
   * @param target - Optional step instance (extracted from the steps array if not provided).
   * @param reason - Optional reason for the navigation.
   */
  goToStep: (step: number, reason?: NeoStepperNavigations, target?: NeoStepperStep<Value>) => Promise<undefined | NeoStepperEvent<Value>>;
  /**
   * Method to navigate to the next step if possible.
   * This will check if the next step is disabled, if the current step allows forward navigation and if loop navigation is enabled.
   */
  goPrevious: () => Promise<undefined | NeoStepperEvent<Value>>;
  /**
   * Method to navigate to the previous step if possible.
   * This will check if the previous step is disabled, if the current step allows backward navigation and if loop navigation is enabled.
   */
  goNext: () => Promise<undefined | NeoStepperEvent<Value>>;
}

export interface NeoStepperEvent<Value = unknown> {
  previous: number;
  current: number;
  step: NeoStepperStep<Value>;
}
export interface NeoStepperBeforeEvent<Value = unknown> {
  current: number;
  next: number;
  step: NeoStepperStep<Value>;
}

export interface NeoStepperStep<Value = unknown> {
  /**
   * Unique identifier for the step.
   */
  id?: string;
  /**
   * Optional snippet to render in place of the step content.
   */
  render?: Snippet<[NeoStepperContext<Value>]>;

  /**
   * Disable all navigation to this step.
   */
  disabled?: boolean;
  /**
   * Disable backward navigation from this step.
   * If set to true, the previous button will be disabled.
   * If set to a number, the previous button will be disabled until the number of steps (from this one) is reached.
   *
   * Will take precedence over the stepper's previous prop.
   * @see NeoStepperProps.previous
   */
  previous?: boolean | number;
  /**
   * Disable cancel button for this step.
   *
   * Will take precedence over the stepper's cancel prop.
   * @see NeoStepperProps.cancel
   */
  cancel?: boolean;
  /**
   * Disable forward navigation from this step.
   * If set to true, the next button will be disabled.
   * If set to a number, the next button will be disabled until the number of steps (from this one) is reached.
   *
   * Will take precedence over the stepper's next prop.
   * @see NeoStepperProps.next
   */
  next?: boolean | number;

  /**
   * Optional hook to run when the step is activated.
   * @param event
   * @param reason
   */
  onStep?: (event: NeoStepperEvent<Value>, reason?: NeoStepperNavigations) => void | Promise<void>;
  /**
   * Optional hook to run before leaving the step.
   * @param event
   * @param reason
   */
  onBeforeStep?: (event: NeoStepperBeforeEvent<Value>, reason?: NeoStepperNavigations) => void | Promise<void>;

  /**
   * Optional props to pass to the previous button when this step is active.
   *
   * Will take precedence over the stepper's previousProps prop.
   * @see NeoStepperProps.previousProps
   */
  previousProps?: NeoButtonProps;
  /**
   * Optional props to pass to the cancel button when this step is active.
   *
   * Will take precedence over the stepper's cancelProps prop.
   * @see NeoStepperProps.cancelProps
   */
  cancelProps?: NeoButtonProps;
  /**
   * Optional props to pass to the next button when this step is active.
   *
   * Will take precedence over the stepper's nextProps prop.
   * @see NeoStepperProps.nextProps
   */
  nextProps?: NeoButtonProps;
  /**
   * Optional props to pass to the progress bar mark when this step is active.
   *
   * Will take precedence over the stepper's markProps prop.
   * @see NeoStepperProps.markProps
   */
  markProps?: NeoProgressMarkProps;
  /**
   * Optional value to store in the step.
   */
  value?: Value;
}

export type NeoStepperElevation = ShadowShallowElevation | ShadowShallowElevationString;

export type NeoStepperProps<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'div'> = {
  // Snippets
  /**
   * Snippet to render in place of the stepper content.
   */
  children?: Snippet<[NeoStepperContext<Value>]>;
  /**
   * Snippet to render before the progress bar.
   */
  before?: Snippet<[NeoStepperContext<Value>]>;
  /**
   * Snippet to render in between the stepper progress and content.
   */
  between?: Snippet<[NeoStepperContext<Value>]>;
  /**
   * Snippet to render inside the stepper content.
   */
  inside?: Snippet<[NeoStepperContext<Value>]>;
  /**
   * Snippet to render after the stepper content.
   */
  after?: Snippet<[NeoStepperContext<Value>]>;

  // States
  /**
   * HTML tag to render the stepper as.
   * @default div
   */
  tag?: Tag;
  /**
   * Array of steps to render in the stepper.
   */
  steps: NeoStepperStep<Value>[];
  /**
   * Index of the currently active step.
   */
  active?: number;
  /**
   * Whether to show the buttons as loading.
   */
  loading?: NeoStepperLoadingState;

  /**
   * Whether to show the progress bar.
   */
  progress?: boolean;
  /**
   * Whether to show the progress bar's marks.
   */
  marks?: boolean;

  /**
   * Whether to show the controls.
   */
  controls?: boolean;
  /**
   * Whether to enable previous navigation.
   * If set to a boolean, it will enable/disable the previous button.
   * If set to a number, it will enable the previous button after the number of steps (from the active one) is reached.
   *
   * Step navigation constraints will take precedence over this prop.
   * @see NeoStepperStep.previous
   */
  previous?: boolean | number;
  /**
   * Whether to show the cancel button.
   * If set to true, it will show the cancel button.
   */
  cancel?: boolean;
  /**
   * Whether to enable next navigation.
   * If set to a boolean, it will enable/disable the next button.
   * If set to a number, it will enable the next button after the number of steps (from the active one) is reached.
   *
   * Step navigation constraints will take precedence over this prop.
   * @see NeoStepperStep.next
   */
  next?: boolean | number;
  /**
   * Whether to loop the stepper navigation when boundaries are reached.
   * If set to true, pressing next on the last step will navigate to the first step, and pressing previous on the first step will navigate to the last step.
   *
   * @default false
   */
  loop?: boolean;
  /**
   * Whether to enable swipe navigation.
   *
   * @default true
   */
  swipe?: boolean;

  /**
   * Disable all stepper navigation.
   */
  disabled?: boolean;

  // Styles
  /**
   * Whether to render the stepper vertically.
   */
  vertical?: boolean;
  /**
   * Where to place the progress bar relative to the stepper content.
   */
  placement?: NeoStepperPlacements;
  /**
   * Elevation style for the stepper.
   */
  elevation?: NeoStepperElevation;
  /**
   * Whether to render the stepper without borders (progress & buttons).
   */
  borderless?: boolean;
  /**
   * Whether to render the stepper's buttons with rounded borders.
   */
  rounded?: BorderRadiusInput;

  // Sizing
  /**
   * Overrides the default flex value.
   */
  flex?: CSSStyleDeclaration['flex'];
  /**
   * Optional width constraints.
   */
  width?: SizeInput<'width'>;
  /**
   * Optional height constraints.
   */
  height?: SizeInput<'height'>;

  // Methods
  /**
   * Optional hook to run when a step is activated.
   * @param event
   * @param reason
   */
  onStep?: (event: NeoStepperEvent<Value>, reason?: NeoStepperNavigations) => void | Promise<void>;
  /**
   * Optional hook to before leaving a step.
   * @param event
   * @param reason
   */
  onBeforeStep?: (event: NeoStepperBeforeEvent<Value>, reason?: NeoStepperNavigations) => void | Promise<void>;

  // OtherProps
  /**
   * Optional props to pass to the swipe action.
   *
   * Tolerances defaults to 50% of the stepper's width for horizontal swipes and 50% of the stepper's height for vertical swipes.
   */
  swipeProps?: SwipeOptions;
  /**
   * Optional props to pass to the transition container.
   */
  transitionProps?: TransitionProps;
  /**
   * Optional props to pass to the stepper controls.
   */
  controlsProps?: HTMLNeoBaseElement & HTMLTagProps;
  /**
   * Optional props to pass to the previous button.
   *
   * Step options will take precedence over these props.
   * @see NeoStepperStep.previousProps
   */
  previousProps?: NeoArrowButtonProps;
  /**
   * Optional props to pass to the cancel button.
   *
   * Step options will take precedence over these props.
   * @see NeoStepperStep.cancelProps
   */
  cancelProps?: NeoIconButtonProps;
  /**
   * Optional props to pass to the next button.
   *
   * Step options will take precedence over these props.
   * @see NeoStepperStep.nextProps
   */
  nextProps?: NeoArrowButtonProps;
  /**
   * Optional props to pass to the progress bar.
   */
  progressProps?: Omit<NeoProgressBarProps, 'refs'>;
  /**
   * Optional props to pass to the progress bar marks.
   *
   * Step options will take precedence over these props.
   * @see NeoStepperStep.markProps
   */
  markProps?: Partial<NeoProgressMarkProps>;
  /**
   * Optional props to pass to all buttons.
   */
  buttonProps?: NeoButtonProps;
} & Omit<HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>, 'children'> &
HTMLTransitionProps &
HTMLRefProps;
