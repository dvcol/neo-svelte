// validation : https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/setCustomValidity
// aria valid/invalid, etc;
// :user-invalid :user-valid
//
//
// TODO: movie this to dedicate input like Password, FilePicker, DatePicker & Number
// &::-webkit-calendar-picker-indicator {
//   display: none;
// }

import type { Snippet } from 'svelte';
import type { HTMLActionProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';
import type { ShadowElevation } from '~/utils/shadow.utils.js';

export type NeoInputState = {
  /**
   * `true` if the input has been focused.
   */
  touched?: boolean;
  /**
   * `true` if the input content has been modified and defers from the initial state.
   * If `dirtyOnChange` is `true`, the input will always be considered dirty once it has been modified.
   *
   * @see dirtyOnChange
   */
  dirty?: boolean;
  /**
   * `true` if the input passes validation.
   */
  valid?: boolean;
};

export type NeoInputMethods = HTMLRefProps<HTMLInputElement> & {
  /**
   * Change the input state. If no value is provided, the state attributes will be unchanged.
   * @param state
   */
  mark: (state: NeoInputState) => unknown;
  /**
   * Clear the input. If a state is provided, the input state will be updated accordingly.
   * If a partial state is provided, the input state will be reinitialized and the provided state will be merged.
   * @param state
   */
  clear: (state?: NeoInputState) => unknown;
};

export type NeoInputElevation = ShadowElevation;
export type NeoInputContext = NeoInputState &
  NeoInputMethods & {
    // Styles

    /**
     * Input elevation.
     * @default 3
     */
    elevation?: NeoInputElevation;
    /**
     * Weather to increase/decrease the elevation when hovered/focused.
     * @default 0
     */
    hover?: number;
    /**
     * By default, inputs with no elevation will display a border.
     * If this is `true`, the input will never display a border.
     */
    borderless?: boolean;
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
  };

export const NeoInputLabelPosition = {
  Inside: 'inside' as const,
  Top: 'top' as const,
  Left: 'left' as const,
  Right: 'right' as const,
} as const;

export type NeoInputLabelPositions = (typeof NeoInputLabelPosition)[keyof typeof NeoInputLabelPosition];

export type NeoInputProps = {
  // Snippets

  label?: Snippet<[NeoInputContext]> | string; // Todo
  prefix?: Snippet<[NeoInputContext]>;
  suffix?: Snippet<[NeoInputContext]>;
  message?: Snippet<[NeoInputContext]> | string; // Todo

  // States
  /**
   * If `true`, the input dirty state will update on input events.
   * If `false`, the input dirty state will only update on change events.
   * @default false
   */
  dirtyOnInput?: boolean;
  /**
   * If `true`, the input will check for validity on input events.
   * If `false`, the input will only check for validity on change events.
   * @default false
   */
  validateOnInput?: boolean;
  /**
   * Display a loading spinner inside the input.
   * If defined, some space will be reserved for the spinner.
   * Set to `undefined` when not loading to regain the space.
   */
  loading?: boolean;
  /**
   * Display a clear button to reset the input value.
   * If used in combination with `loading`, the clear button will be hidden while loading.
   */
  clearable?: boolean;

  // Styles

  /**
   * Display the label as a placeholder inside the input when empty
   */
  floating?: boolean;
  /**
   * Label position.
   * When set to outside (`top`, `left`, `right`), the label will be displayed within the input container's margin.
   * Make sure to set the container's margin appropriately to avoid collision or content shift.
   *
   * @default 'inside'
   */
  position?: NeoInputLabelPositions;

  // Events
  /**
   * Callback when the input state is manually changed.
   * @param state
   */
  onmark?: (state: NeoInputState) => unknown;
  /**
   * Callback when the input is cleared.
   * @param state
   */
  onclear?: (state: NeoInputState) => unknown;

  // Other props

  /**
   * The HTML tag to use for the container.
   * @default 'div'
   */
  containerTag?: keyof HTMLElementTagNameMap;
  /**
   * The HTML tag to use for the prefix.
   * @default 'div'
   */
  prefixTag?: keyof HTMLElementTagNameMap;
  /*
   * The HTML tag to use for the suffix.
   * @default 'div'
   */
  suffixTag?: keyof HTMLElementTagNameMap;

  /**
   * The props to pass to the container.
   */
  containerProps?: HTMLNeoBaseElement;
  /**
   * The props to pass to the prefix.
   */
  prefixProps?: HTMLNeoBaseElement;
  /**
   * The props to pass to the suffix.
   */
  suffixProps?: HTMLNeoBaseElement;
} & NeoInputState &
  HTMLNeoBaseElement<HTMLInputElement> &
  HTMLActionProps;
