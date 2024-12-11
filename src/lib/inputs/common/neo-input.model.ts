// TODO: movie this to dedicate input like Password, FilePicker, DatePicker & Number
// &::-webkit-calendar-picker-indicator {
//   display: none;
// }

import type { Snippet } from 'svelte';
import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';
import type { NeoValidationFieldContext, NeoValidationState } from '~/inputs/common/neo-validation.model.js';
import type { HTMLTransitionProps, HTMLUseProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps, SvelteEvent } from '~/utils/html-element.utils.js';
import type { ShadowElevation } from '~/utils/shadow.utils.js';

export type NeoInputValue<T extends HTMLInputElement | HTMLTextAreaElement> = T extends HTMLTextAreaElement
  ? HTMLTextareaAttributes['value']
  : HTMLInputAttributes['value'];

type NeoInputHTMLAttributes<T extends HTMLInputElement | HTMLTextAreaElement> = T extends HTMLTextAreaElement
  ? HTMLTextareaAttributes
  : HTMLInputAttributes & {
      files?: HTMLInputAttributes['bind:files'];
      group?: HTMLInputAttributes['bind:group'];
    };

export type NeoInputState<T extends HTMLInputElement | HTMLTextAreaElement> = NeoValidationState<NeoInputValue<T>>;

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

export type NeoInputMethods<T extends HTMLInputElement | HTMLTextAreaElement> = {
  /**
   * Change the input state. If no value is provided, the state attributes will be unchanged.
   * @param state
   */
  mark: (state: NeoInputState<T>) => unknown;
  /**
   * Clear the input. If a state is provided, the input state will be updated accordingly.
   * If a partial state is provided, the input state will be reinitialized and the provided state will be merged.
   *
   * Note: Clearing the input will trigger `onclear` and `oninput` events, but not `onchange`.
   * @param state
   * @param event
   */
  clear: (state?: NeoInputState<T>, event?: InputEvent | SvelteEvent<InputEvent>) => Promise<unknown>;
  /**
   * Change the input value.
   * @param value
   * @param event
   */
  change: (value: HTMLInputElement['value'], event?: InputEvent | SvelteEvent<InputEvent>) => NeoInputState<T>;
  /**
   * Check the input validity.
   * @param update whether to check the input dirty and/or valid state.
   */
  validate: (update?: { dirty?: boolean; valid?: boolean }) => NeoInputState<T>;
};

export type NeoInputElevation = ShadowElevation;
export type NeoInputContext<T extends HTMLInputElement | HTMLTextAreaElement> = NeoValidationFieldContext<T, NeoInputValue<T>> &
  Partial<NeoInputStyles & NeoInputMethods<T>>;

export const NeoInputLabelPosition = {
  Inside: 'inside' as const,
  Top: 'top' as const,
  Left: 'left' as const,
  Right: 'right' as const,
} as const;

export type NeoInputLabelPositions = (typeof NeoInputLabelPosition)[keyof typeof NeoInputLabelPosition];

export type NeoBaseInputProps<T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement> = {
  // Styles
  /**
   * If `true`, the input will have no left padding/border radius.
   */
  after?: boolean;
  /**
   * If `true`, the input will have no right padding/border radius.
   */
  before?: boolean;

  // States
  /**
   * If the input is currently focused.
   */
  focused?: boolean;
  /**
   * Fall back value when the input value is cleared.
   */
  defaultValue: HTMLInputAttributes['value'];

  // Validation
  /**
   * If `true`, the input dirty state will update on input events.
   * If `false`, the input dirty state will only update on change events.
   * @default false
   */
  dirtyOnInput?: boolean;
  /**
   * If `true`, the input dirty state will update on blur events.
   * @default false
   */
  dirtyOnBlur?: boolean;
  /**
   * If `true`, the input will check for validity on input events.
   * If `false`, the input will only check for validity on change events.
   * @default false
   */
  validateOnInput?: boolean;
  /**
   * If `true`, the input will check for validity on blur events.
   * @default false
   */
  validateOnBlur?: boolean;
  /**
   * Reflect the input validation message.
   */
  validationMessage?: T['validationMessage'];

  // Events
  /**
   * Callback when the input state is manually changed.
   * @param state
   */
  onmark?: (state: NeoInputState<T>) => unknown;
  /**
   * Callback when the input is cleared.
   * @param state
   * @param event
   */
  onclear?: (state: NeoInputState<T>, event?: InputEvent) => unknown;
} & HTMLUseProps &
  HTMLRefProps<T> &
  NeoInputState<T> &
  NeoInputHTMLAttributes<T>;

export type NeoInputGroupProps<T extends HTMLInputElement | HTMLTextAreaElement> = {
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
   * Display a loading spinner inside the input.
   * If defined, some space will be reserved for the spinner.
   * Set to `undefined` when not loading to regain the space.
   */
  loading?: boolean;
  /**
   * If the input is currently hovered.
   */
  hovered?: boolean;
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
} & Omit<NeoBaseInputProps<T>, 'after' | 'before'> &
  NeoInputStyles &
  HTMLTransitionProps;

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
} & NeoInputGroupProps<T> &
  HTMLInputAttributes & {
    files?: HTMLInputAttributes['bind:files'];
    group?: HTMLInputAttributes['bind:group'];
  };

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
   * Fall back value when the textarea value is cleared.
   */
  defaultValue: HTMLTextareaAttributes['value'];
  /**
   * Automatically increments/decrements the textarea rows to fit the content.
   *
   * If `true`, the textarea will increment indefinitely and will not decrement.
   * If an object is provided, the textarea will increment up to `max` rows and decrement to `min` rows.
   *
   * @default true
   */
  autoResize?: boolean | NeoTextAreaResize;
} & NeoInputGroupProps<T> &
  HTMLTextareaAttributes;

export type NeoInputHTMLElement<T extends HTMLInputElement = HTMLInputElement> = T & Partial<NeoInputMethods<T>>;
export type NeoTextareaHTMLElement<T extends HTMLTextAreaElement = HTMLTextAreaElement> = T & Partial<NeoInputMethods<T>>;
