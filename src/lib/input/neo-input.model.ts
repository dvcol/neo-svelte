// validation : https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/setCustomValidity
// aria valid/invalid, etc;
// aria-describedby for id (use rest.id && rest.label)
// :user-invalid :user-valid
//
//
// TODO: movie this to dedicate input like Password, FilePicker, DatePicker & Number
// &::-webkit-calendar-picker-indicator {
//   display: none;
// }

import type { Snippet } from 'svelte';
import type { NeoCardElevation } from '~/cards/neo-card.model.js';
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
  mark: (state: NeoInputState) => unknown;
  clear: (state?: NeoInputState) => unknown;
};

export type NeoInputContext = NeoInputState &
  NeoInputMethods & {
    // Styles

    /**
     * Input elevation.
     * @default 3
     */
    elevation?: NeoCardElevation;
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

export type NeoInputElevation = ShadowElevation;
export type NeoInputProps = {
  // Snippets

  label?: Snippet<[NeoInputContext]> | string; // Todo
  prefix?: Snippet<[NeoInputContext]>;
  suffix?: Snippet<[NeoInputContext]>;

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
  floating?: boolean; // Todo

  // Events
  onmark?: (state: NeoInputState) => unknown;
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
