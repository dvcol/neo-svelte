import type { Snippet } from 'svelte';
import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoProgressBarProps } from '~/progress/neo-progress-bar.model.js';
import type { NeoProgressMarkProps } from '~/progress/neo-progress-mark.model.js';
import type { HTMLTransitionProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement, HTMLTagProps } from '~/utils/html-element.utils.js';
import type { ShadowShallowElevation, ShadowShallowElevationString } from '~/utils/shadow.utils.js';

export const NeoStepperPlacement = {
  Start: 'start' as const,
  End: 'end' as const,
} as const;

export type NeoStepperPlacements = (typeof NeoStepperPlacement)[keyof typeof NeoStepperPlacement];

export type NeoStepperContext = {
  /**
   * Step cursor containing the current, next and previous steps.
   */
  step: {
    /**
     * The active step.
     */
    current: NeoStepperStep;
    /**
     * The next step (active + 1).
     */
    next?: NeoStepperStep;
    /**
     * The previous step (active - 1).
     */
    previous?: NeoStepperStep;
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
   */
  goToStep: (step: number, target?: NeoStepperStep) => void;
  /**
   * Method to navigate to the next step if possible.
   * This will check if the next step is disabled, if the current step allows forward navigation and if loop navigation is enabled.
   */
  goPrevious: () => void;
  /**
   * Method to navigate to the previous step if possible.
   * This will check if the previous step is disabled, if the current step allows backward navigation and if loop navigation is enabled.
   */
  goNext: () => void;
};

export type NeoStepperEvent = { previous: number; current: number; step: NeoStepperStep };

export type NeoStepperStep = {
  /**
   * Unique identifier for the step.
   */
  id?: string;
  /**
   * Optional snippet to render in place of the step content.
   */
  render?: Snippet<[NeoStepperContext]>;

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
   */
  onStep?: (event: NeoStepperEvent) => void;

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
};

export type NeoStepperElevation = ShadowShallowElevation | ShadowShallowElevationString;

export type NeoStepperProps<Tag extends keyof HTMLElementTagNameMap = 'div'> = {
  // Snippets
  /**
   * Snippet to render in place of the stepper content.
   */
  children?: Snippet<[NeoStepperContext]>;

  // States
  /**
   * HTML tag to render the stepper as.
   * @default div
   */
  tag?: Tag;
  /**
   * Array of steps to render in the stepper.
   */
  steps: NeoStepperStep[];
  /**
   * Index of the currently active step.
   */
  active?: number;

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
   */
  loop?: boolean;

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

  // Methods
  /**
   * Optional hook to run when a step is activated.
   * @param event
   */
  onStep?: (event: NeoStepperEvent) => void;

  // OtherProps
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
  previousProps?: NeoButtonProps;
  /**
   * Optional props to pass to the cancel button.
   *
   * Step options will take precedence over these props.
   * @see NeoStepperStep.cancelProps
   */
  cancelProps?: NeoButtonProps;
  /**
   * Optional props to pass to the next button.
   *
   * Step options will take precedence over these props.
   * @see NeoStepperStep.nextProps
   */
  nextProps?: NeoButtonProps;
  /**
   * Optional props to pass to the progress bar.
   */
  progressProps?: NeoProgressBarProps;
  /**
   * Optional props to pass to the progress bar marks.
   *
   * Step options will take precedence over these props.
   * @see NeoStepperStep.markProps
   */
  markProps?: NeoProgressMarkProps;
} & HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]> &
  HTMLTransitionProps;
