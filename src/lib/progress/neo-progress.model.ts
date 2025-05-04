import type { Snippet } from 'svelte';

import type { Color } from '~/utils/colors.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';
import type { SizeInput } from '~/utils/style.utils.js';

export const NeoProgressStatus = Object.freeze({
  Indeterminate: 'indeterminate' as const,
  Active: 'active' as const,
  Idle: 'idle' as const,
  Paused: 'paused' as const,
  Cancelled: 'cancelled' as const,
  Timeout: 'timeout' as const,
  Completed: 'completed' as const,
  Error: 'error' as const,
  Success: 'success' as const,
  Warning: 'warning' as const,
});

export type NeoProgressStatuses = (typeof NeoProgressStatus)[keyof typeof NeoProgressStatus];

export const NeoProgressDirection = Object.freeze({
  Right: 'right' as const,
  Left: 'left' as const,
  Top: 'top' as const,
  Bottom: 'bottom' as const,
});

export type NeoProgressDirections = (typeof NeoProgressDirection)[keyof typeof NeoProgressDirection];

export interface NeoProgressContext {
  /**
   * The current state of the progress if controlled.
   */
  status?: NeoProgressStatuses;

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

  // Styles
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
}

export type NeoProgressProps<Tag extends keyof HTMLElementTagNameMap = 'div'> = NeoProgressContext & {
  // Snippets
  /**
   * Optional content to display inside the progress.
   */
  children?: Snippet<[NeoProgressContext]>;

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
   * Optional flex strategy for the container
   */
  flex?: CSSStyleDeclaration['flex'];
  /**
   * Width of the progress bar.
   *
   * @default 100% (right, left), 0.375rem (top, bottom)
   */
  width?: SizeInput<'width'>;
  /**
   * Height of the progress bar.
   *
   * @default 0.375rem (right, left), 100% (top, bottom)
   */
  height?: SizeInput<'height'>;
  /**
   * If false, the progress track will be hidden.
   * @default true
   */
  track?: boolean;
  /**
   * If true, the progress will change immediately without animation.
   * @default false
   */
  immediate?: boolean;
} & HTMLRefProps<HTMLElementTagNameMap[Tag]> &
HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>;

export interface NeoProgressChange {
  /** The new value of the progress. */
  value?: number;
  /** The new buffer value of the progress. */
  buffer?: number;
  /** State override. If omitted {@link NeoProgressStatus.Idle} will be set if value <= min, {@link NeoProgressStatus.Paused} otherwise. */
  state?: NeoProgressStatuses;
}

export interface NeoProgressStart {
  /** Whether to switch to a pending indeterminate state when max is reached. (end as {@link NeoProgressStatus.Indeterminate}) */
  pending?: boolean;
  /** Whether to switch to a completed state when timeout is reached. (ends as {@link NeoProgressStatus.Timeout}) */
  expire?: number;
  /** Whether to start the progress in an indeterminate state. (starts as {@link NeoProgressStatus.Indeterminate}) */
  indeterminate?: boolean;
  /** A beginning value for the progress. */
  value?: number;
  /** A beginning buffer value for the progress. */
  buffer?: number;
}

export interface NeoProgressComplete {
  /** Whether to set the state to pending. (ends as {@link NeoProgressStatus.Indeterminate}) */
  pending?: boolean;
  /** Whether to set the status on completion ({@link NeoProgressStatus}) */
  state?: NeoProgressStatuses;
  /** Whether to await indeterminate animation before completing. (defaults to true) */
  defer?: boolean;
}

export interface NeoProgressMethods {
  /**
   * Starts a controlled progress and sets the state to {@link NeoProgressStatus.Active}.
   *
   * Once the progress reaches the max value, it will either switch to a {@link NeoProgressStatus.Completed} state or a {@link NeoProgressStatus.Indeterminate} state.
   *
   * @param pending Whether to switch to a pending indeterminate state when max is reached. (end as {@link NeoProgressStatus.Indeterminate})
   * @param expire Whether to switch to a completed state when timeout is reached. (ends as {@link NeoProgressStatus.Timeout})
   * @param indeterminate Whether to start the progress in an indeterminate state. (starts as {@link NeoProgressStatus.Indeterminate})
   * @param value A beginning value for the progress.
   * @param buffer A beginning buffer value for the progress.
   */
  start: ({ pending, expire, indeterminate, value, buffer }?: NeoProgressStart) => undefined | NeoProgressStatuses;
  /**
   * Stops the progress and sets the state to {@link NeoProgressStatus.Paused}.
   */
  stop: () => undefined | NeoProgressStatuses;
  /**
   * Resets the progress to the minimum value.
   * If restart is true, the progress will start again and the state will be set to {@link NeoProgressStatus.Active}.
   * If restart is false, the state will be set to {@link NeoProgressStatus.Idle}.
   * @param restart Whether to restart the progress. (defaults to true if state is {@link NeoProgressStatus.Active}, false otherwise)
   * @param expire Whether to switch to a completed state when timeout is reached. (ends as {@link NeoProgressStatus.Timeout})
   * @param start Optional starting config for the progress if restart is true.
   */
  reset: (restart?: boolean, start?: NeoProgressStart) => undefined | NeoProgressStatuses;
  /**
   * Cancels timeout and interval and sets value and buffer;
   * Also sets the state to {@link NeoProgressStatus.Idle} if value is as or under the minimum, {@link NeoProgressStatus.Paused} otherwise.
   * @param value The new value of the progress.
   * @param buffer The new buffer value of the progress.
   */
  change: ({ value, buffer }?: NeoProgressChange) => undefined | NeoProgressStatuses;
  /**
   * Sets the progress to the maximum value.
   * If pending is true, the state will be set to {@link NeoProgressStatus.Indeterminate}.
   * If pending is false, the state will be set to {@link NeoProgressStatus.Completed}.
   * @param pending whether to set the state to pending. (ends as {@link NeoProgressProps.indeterminate})
   * @param state whether to set the status on completion ({@link NeoProgressStatus})
   * @param defer Whether to await indeterminate animation before completing. (defaults to true)
   */
  complete: ({ pending, state, defer }?: NeoProgressComplete) => undefined | NeoProgressStatuses | Promise<undefined | NeoProgressStatuses>;
  /**
   * Reset the progress and sets the state to {@link NeoProgressStatus.Cancelled}.
   * @param defer Whether to await indeterminate animation before cancelling. (defaults to true)
   */
  cancel: (defer?: boolean) => undefined | NeoProgressStatuses | Promise<undefined | NeoProgressStatuses>;
}

export type NeoProgressHTMLElement<Tag extends keyof HTMLElementTagNameMap = 'div'> = HTMLElementTagNameMap[Tag] & NeoProgressMethods & {
  /**
   * The current state of the progress.
   */
  readonly status: NeoProgressStatuses;
  /**
   * The current value of the progress.
   */
  readonly value: number;
  /**
   * The current buffered value of the progress.
   */
  readonly buffer: number;
};
