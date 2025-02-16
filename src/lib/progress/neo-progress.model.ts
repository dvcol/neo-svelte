import type { Snippet } from 'svelte';
import type { Color } from '~/utils/colors.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';

export const NeoProgressState = {
  Active: 'active' as const,
  Idle: 'idle' as const,
  Paused: 'paused' as const,
  Completed: 'completed' as const,
  Indeterminate: 'indeterminate' as const,
} as const;

export type NeoProgressStates = (typeof NeoProgressState)[keyof typeof NeoProgressState];

export const NeoProgressDirection = {
  Right: 'right' as const,
  Left: 'left' as const,
  Top: 'top' as const,
  Bottom: 'bottom' as const,
} as const;

export type NeoProgressDirections = (typeof NeoProgressDirection)[keyof typeof NeoProgressDirection];

export type NeoProgressContext = {
  /**
   * The current state of the progress if controlled.
   */
  state?: NeoProgressStates;

  /**
   * The current value of the progress.
   */
  value?: number;
  /**
   * Optional buffered value of the progress.
   */
  buffer?: number;
  /**
   * Minimum value (If value is less than min, the progress will display as the min value).
   *
   * @default 0
   */
  min?: number;
  /**
   * Maximum value (If value is more than max, the progress will display as the max value).
   *
   * @default 100
   */
  max?: number;
  /**
   * Whether the progress is indeterminate.
   * If true, the value will be ignored.
   */
  indeterminate?: boolean;

  /**
   * The step size of each tick in controlled mode.
   *
   * @default 1
   */
  step?: number;
  /**
   * The tick interval in controlled mode (in milliseconds).
   *
   * @default 500
   */
  tick?: number;
  /**
   * Optional timeout in milliseconds to complete the progress, regardless of value, buffer, tick rate or step size.
   */
  timeout?: number;
};

export type NeoProgressProps<Tag extends keyof HTMLElementTagNameMap = 'div'> = NeoProgressContext & {
  // Snippets
  /**
   * Optional content to display inside the progress.
   */
  children?: Snippet;
  /**
   * Optional label to display above the progress.
   */
  label?: Snippet | string;
  /**
   * Optional tooltip to display on progress state.
   */
  tooltip?: Snippet | string;

  // State
  /**
   * The tag to render the progress as.
   */
  tag?: Tag;

  // Styles
  /**
   * The lower threshold below which the progress will be coloured as low.
   * Requires color to be set as well.
   *
   * @see color
   */
  low?: number;
  /**
   * The upper threshold above which the progress will be coloured as high.
   * Requires color to be set as well.
   *
   * @see color
   */
  high?: number;
  /**
   * Width of the progress bar.
   *
   * @default 100% (right, left), 0.375rem (top, bottom)
   */
  width?: CSSStyleDeclaration['width'];
  /**
   * Height of the progress bar.
   *
   * @default 0.375rem (right, left), 100% (top, bottom)
   */
  height?: CSSStyleDeclaration['height'];
  /**
   * The color or background to use for the progress.
   * If color is an array, the first color will be used for the low threshold, the second for the middle and the third for the high threshold.
   *
   * @see low
   * @see high
   */
  color?: Color | CSSStyleDeclaration['background'];
  /**
   * The direction to display the progress.
   *
   * @default right
   */
  direction?: NeoProgressDirections;
} & HTMLRefProps<HTMLElementTagNameMap[Tag]> &
  HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>;

export type NeoProgressMethods = {
  /**
   * Starts a controlled progress and sets the state to {@link NeoProgressState.Active}.
   *
   * Once the progress reaches the max value, it will either switch to a {@link NeoProgressState.Completed} state or a {@link NeoProgressState.Indeterminate} state.
   *
   * @param pending Whether to switch to a pending indeterminate state when max is reached. (defaults to {@link NeoProgressProps.indeterminate})
   * @param expire Whether to switch to a completed state when timeout is reached. (defaults to {@link NeoProgressProps.timeout})
   */
  start: (pending?: boolean, expire?: boolean) => void;
  /**
   * Stops the progress and sets the state to {@link NeoProgressState.Idle}.
   */
  stop: () => void;
  /**
   * Resets the progress to the minimum value.
   * If restart is true, the progress will start again and the state will be set to {@link NeoProgressState.Active}.
   * If restart is false, the state will be set to {@link NeoProgressState.Idle}.
   * @param restart Whether to restart the progress. (defaults to true if state is {@link NeoProgressState.Active}, false otherwise)
   */
  reset: (restart?: boolean) => void;
  /**
   * Sets the progress to the maximum value.
   * If pending is true, the state will be set to {@link NeoProgressState.Indeterminate}.
   * If pending is false, the state will be set to {@link NeoProgressState.Completed}.
   * @param pending whether to set the state to pending. (defaults to {@link NeoProgressProps.indeterminate})
   */
  complete: (pending?: boolean) => void;
  /**
   * Reset the progress and sets the state to {@link NeoProgressState.Paused}.
   */
  cancel: () => void;
};

export type NeoProgressHTMLElement<Tag extends keyof HTMLElementTagNameMap = 'div'> = HTMLElementTagNameMap[Tag] & NeoProgressMethods;
