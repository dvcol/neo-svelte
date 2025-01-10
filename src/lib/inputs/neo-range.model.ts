import type { NeoInputValidationProps } from '~/inputs/common/neo-input-validation.model.js';
import type { NeoLabelProps } from '~/inputs/common/neo-label.model.js';
import type { NeoValidationState } from '~/inputs/common/neo-validation.model.js';
import type { HTMLActionProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';

export type NeoRangeValue = number | [number, number];
export type NeoRangeElevation = -2 | -1 | 0 | 1 | 2;

export type NeoRangeProps = Pick<NeoInputValidationProps, 'valid' | 'validation' | 'error' | 'context' | 'message' | 'messageTag' | 'messageProps'> &
  NeoValidationState<NeoRangeValue> & {
    // Snippets
    label?: NeoLabelProps['label'];

    // States
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

    // Styles
    /**
     * If true, the input will have a rounded border.
     */
    rounded?: boolean;
    /**
     * If true, the input will be displayed with a glass effect.
     */
    glass?: boolean;
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

    // Other props
    /**
     * The HTML tag to use for the wrapper component (when message or error are shown).
     */
    wrapperTag?: keyof HTMLElementTagNameMap;
    /**
     * The props to pass to the wrapper component.
     */
    wrapperProps?: HTMLNeoBaseElement;

    /**
     * The HTML tag to use for the container.
     * @default div
     */
    containerTag?: keyof HTMLElementTagNameMap;
    /**
     * The props to pass to the input container.
     */
    containerProps?: HTMLNeoBaseElement;

    /**
     * The props to pass to the label.
     */
    labelProps?: NeoLabelProps;
    /**
     * The ref to bind to the label.
     */
    labelRef?: HTMLLabelElement;
  } & HTMLActionProps &
  HTMLRefProps &
  HTMLNeoBaseElement;
