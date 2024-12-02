// TODO: movie this to dedicate input like Password, FilePicker, DatePicker & Number
// &::-webkit-calendar-picker-indicator {
//   display: none;
// }

import type { Snippet } from 'svelte';
import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';
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
  /**
   * The input/textarea value.
   */
  value?: string;
  /**
   * The initial input/textarea value.
   */
  initial?: string;
};

export type NeoInputStyles = {
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
   * If true, negative elevation (< 0) will be displayed as pressed instead of inset.
   */
  pressed?: boolean;
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
  /**
   * If true, the input will be disabled.
   */
  disabled?: boolean;
  /**
   * If true, the input will be readonly.
   */
  readonly?: boolean;
};

export type NeoInputMethods = {
  /**
   * Change the input state. If no value is provided, the state attributes will be unchanged.
   * @param state
   */
  mark: (state: NeoInputState) => unknown;
  /**
   * Clear the input. If a state is provided, the input state will be updated accordingly.
   * If a partial state is provided, the input state will be reinitialized and the provided state will be merged.
   * @param state
   * @param event
   */
  clear: (state?: NeoInputState, event?: InputEvent) => unknown;
  /**
   * Change the input value.
   * @param value
   * @param event
   */
  change: (value: HTMLInputElement['value'], event?: InputEvent) => NeoInputState;
  /**
   * Check the input validity.
   * @param update whether to check the input dirty and/or valid state.
   */
  validate: (update?: { dirty?: boolean; valid?: boolean }) => NeoInputState;
};

export type NeoInputElevation = ShadowElevation;
export type NeoInputContext<T extends HTMLElement = HTMLElement> = HTMLRefProps<T> & NeoInputState & NeoInputStyles & NeoInputMethods;

export const NeoInputLabelPosition = {
  Inside: 'inside' as const,
  Top: 'top' as const,
  Left: 'left' as const,
  Right: 'right' as const,
} as const;

export type NeoInputLabelPositions = (typeof NeoInputLabelPosition)[keyof typeof NeoInputLabelPosition];

export type NeoCommonInputProps<T extends HTMLElement> = {
  // Snippets

  /**
   * A snippet or a string to display as the input label.
   */
  label?: Snippet<[NeoInputContext<T>]> | string;
  /**
   * A snippet or a string to display as the input info message.
   */
  message?: Snippet<[NeoInputContext<T>]> | string;
  /**
   * A snippet or a string to display as the input error message.
   */
  error?: Snippet<[NeoInputContext<T>]> | string;
  /**
   * A snippet to display as the input suffix.
   */
  after?: Snippet<[NeoInputContext<T>]>;

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
   * @default false
   */
  clearable?: boolean;
  /**
   * If `true`, the input will display validation states.
   * @default false
   */
  validation?: boolean;

  // Styles

  /**
   * Display the label as a placeholder inside the input when empty
   * @default true
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
   * @param event
   */
  onclear?: (state: NeoInputState, event?: InputEvent) => unknown;

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
   * The HTML tag to use for the message and error components.
   */
  messageTag?: keyof HTMLElementTagNameMap;
  /**
   * The props to pass to the message and error components.
   */
  messageProps?: HTMLNeoBaseElement;

  /*
   * The HTML tag to use for the suffix.
   * @default div
   */
  afterTag?: keyof HTMLElementTagNameMap;
  /**
   * The props to pass to the suffix.
   */
  afterProps?: HTMLNeoBaseElement;

  /**
   * The props to pass to the label.
   */
  labelProps?: HTMLNeoBaseElement<HTMLLabelElement>;

  /**
   * The ref to bind to the label.
   */
  labelRef?: HTMLLabelElement;
} & HTMLRefProps<T> &
  NeoInputState &
  NeoInputStyles &
  HTMLActionProps;

export type NeoInputProps<T extends HTMLInputElement = NeoInputHTMLElement> = {
  // Snippets

  /**
   * A snippet to display as the input prefix.
   */
  before?: Snippet<[NeoInputContext<T>]>;

  // Other props

  /**
   * The HTML tag to use for the prefix.
   * @default div
   */
  beforeTag?: keyof HTMLElementTagNameMap;
  /**
   * The props to pass to the prefix.
   */
  beforeProps?: HTMLNeoBaseElement;

  /**
   * The ref to bind to the prefix.
   */
  beforeRef?: HTMLElement;
} & NeoCommonInputProps<T> &
  HTMLInputAttributes;

export type NeoTextAreaResize = {
  /**
   * The minimum number of rows the textarea can have.
   * @default 1
   */
  min?: number;
  /**
   * The maximum number of rows the textarea can have.
   */
  max?: number;
};

export type NeoTextareaProps<T extends HTMLTextAreaElement = NeoTextareaHTMLElement> = {
  /**
   * Automatically increments/decrements the textarea rows to fit the content.
   *
   * If `true`, the textarea will increment indefinitely and will not decrement.
   * If an object is provided, the textarea will increment up to `max` rows and decrement to `min` rows.
   *
   * @default true
   */
  autoResize?: boolean | NeoTextAreaResize;
} & NeoCommonInputProps<T> &
  HTMLTextareaAttributes;

export type NeoInputHTMLElement = HTMLInputElement & Partial<NeoInputMethods>;
export type NeoTextareaHTMLElement = HTMLTextAreaElement & Partial<NeoInputMethods>;
