import type { UseFloatingOptions } from '@skeletonlabs/floating-ui-svelte';
import type { Snippet } from 'svelte';
import type { NeoInputValidationProps } from '~/inputs/common/neo-input-validation.model.js';
import type { NeoLabelProps } from '~/inputs/common/neo-label.model.js';
import type { NeoValidationFieldContext, NeoValidationState } from '~/inputs/common/neo-validation.model.js';
import type { HTMLActionProps } from '~/utils/action.utils.js';
import type { Color } from '~/utils/colors.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps, HTMLTagProps } from '~/utils/html-element.utils.js';
import type { ShadowShallowElevation, ShadowShallowElevationString } from '~/utils/shadow.utils.js';

export type NeoRangeValue = number | [number, number];
export type NeoRangeElevation = ShadowShallowElevation | ShadowShallowElevationString;

export type NeoRangeStates = {
  /**
   * If the input is currently focused.
   */
  focused?: boolean;
  /**
   * If the input is currently hovered.
   */
  hovered?: boolean;
  /**
   * If true, the input will be disabled.
   */
  disabled?: boolean;
  /**
   * If true, the input will be readonly.
   */
  readonly?: boolean;
  /**
   * Display a loading spinner inside the input.
   */
  loading?: boolean;
  /**
   * Minimum value of the range.
   *
   * @default 0
   */
  min?: number;
  /**
   * Maximum value of the range.
   *
   * @default 100
   */
  max?: number;
  /**
   * Step value of the range.
   *
   * @default 1
   */
  step?: number;
};

export type NeoRangeStyles = {
  /**
   * If true, the input will show step markers.
   * If an array is provided, the input will show the markers at the given values.
   *
   * @see step
   */
  ticks?: boolean | number[];
  /**
   * If true, the input value will be displayed as tooltip on hover/focus.
   *
   * @default true
   */
  tooltips?: boolean;
  /**
   * If true, the input will have a rounded border.
   */
  rounded?: boolean;
  /**
   * If true, the input will be displayed with a glass effect.
   */
  glass?: boolean;
  /**
   * Tints the input with the current color.
   */
  tinted?: boolean;
  /**
   * Text color to use for the input.
   */
  color?: Color | CSSStyleDeclaration['color'];
  /**
   * If true, the input input start as flat on first render.
   * @see [@starting-style](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style) for browser support
   */
  start?: boolean;
  /**
   * If true, the input will be disabled and a loading skeleton will be displayed instead of the text.
   */
  skeleton?: boolean;
  /**
   * Input elevation.
   * @default 2
   */
  elevation?: NeoRangeElevation;
};

export type NeoRangeTooltipContext = {
  lower?: boolean;
  upper?: boolean;
  value?: number;
};

export type NeoRangeTickContext = {
  index: number;
  filled?: boolean;
};

export type NeoRangeProps = Pick<NeoInputValidationProps, 'valid' | 'validation' | 'error' | 'context' | 'message' | 'messageProps'> &
  NeoValidationState<NeoRangeValue> & {
    // Snippets
    /**
     * A snippet or a string to display as the input label.
     */
    label?: NeoLabelProps['label'];
    /**
     * A snippet to display as value labels.
     */
    tooltip?: Snippet<[NeoRangeTooltipContext, NeoValidationFieldContext]>;
    /**
     * A snippet to display as a tick mark.
     */
    mark?: Snippet<[NeoRangeTickContext, NeoValidationFieldContext]>;
    /**
     * A snippet to display as the input prefix.
     */
    before?: Snippet<[NeoValidationFieldContext]>;
    /**
     * A snippet to display as the input suffix.
     */
    after?: Snippet<[NeoValidationFieldContext]>;

    // States
    /**
     * Unique identifier of the input.
     * @default neo-range-{uuid}
     */
    id?: HTMLElement['id'];

    // Other props
    /**
     * The HTML tag to use for the validation container.
     */
    wrapperRef?: HTMLRefProps['ref'];
    /**
     * The props to pass to the wrapper component.
     */
    wrapperProps?: NeoInputValidationProps;

    /**
     * The props to pass to the input container.
     */
    containerProps?: HTMLNeoBaseElement & HTMLTagProps;

    /**
     * The props to pass to the label.
     */
    labelProps?: NeoLabelProps;
    /**
     * The ref to bind to the label.
     */
    labelRef?: HTMLLabelElement;

    /**
     * The props to pass to the floating label.
     */
    floatingProps?: HTMLNeoBaseElement<HTMLSpanElement>;
    /**
     * Options to pass to the floating label.
     */
    floatingOptions?: UseFloatingOptions;
  } & NeoRangeStates &
  NeoRangeStyles &
  HTMLActionProps &
  HTMLRefProps &
  HTMLNeoBaseElement<HTMLSpanElement>;

export type NeoRangeValidationState = NeoValidationState<NeoRangeValue>;

export type NeoRangeMethods<T extends NeoRangeValue = NeoRangeValue> = {
  /**
   * Increment the input value.
   * @param index
   */
  stepUp: (index?: 0 | 1) => T;
  /**
   * Decrement the input value.
   * @param index
   */
  stepDown: (index?: 0 | 1) => T;
};

export type NeoRangeContext<T extends NeoRangeValue = NeoRangeValue> = NeoValidationFieldContext &
  NeoRangeStates &
  NeoRangeStyles &
  NeoRangeMethods<T>;

export type NeoRangeHTMLElement<T extends NeoRangeValue = NeoRangeValue> = HTMLElement & NeoRangeMethods<T>;
