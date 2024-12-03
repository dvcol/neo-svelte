import type { Snippet } from 'svelte';
import type { HTMLTransitionProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';

export type NeoValidationValue = string | number | boolean;
export type NeoValidationState<T extends NeoValidationValue = NeoValidationValue> = {
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
  value?: T;
  /**
   * The initial input/textarea value.
   */
  initial?: T;
};

export type NeoValidationContext<
  T extends HTMLElement = HTMLElement,
  V extends NeoValidationValue = NeoValidationValue,
  C extends NeoValidationFieldContext<T, V> = NeoValidationFieldContext<T, V>,
> = {
  /**
   * The message's element id.
   */
  messageId?: string;
  /**
   * A snippet or a string to display as the input info message.
   */
  message?: Snippet<[C]> | string;
  /**
   * A snippet or a string to display as the input error message.
   */
  error?: Snippet<[C]> | string;
};

export type NeoValidationFieldContext<T extends HTMLElement = HTMLElement, V extends NeoValidationValue = NeoValidationValue> = HTMLRefProps<T> &
  NeoValidationState<V>;

export type NeoValidationProps<
  T extends HTMLElement = HTMLElement,
  V extends NeoValidationValue = NeoValidationValue,
  C extends NeoValidationFieldContext<T, V> = NeoValidationFieldContext<T, V>,
> = {
  // Snippets
  /**
   * The component to wrap with the validation context.
   */
  children?: Snippet<[NeoValidationContext<T, V, C>]>;

  // State

  /**
   * The HTML tag to use for the wrapper component (when message or error are shown).
   */
  tag?: keyof HTMLElementTagNameMap;
  /**
   * The context to pass to the snippets.
   */
  context: C;

  // Styles
  /**
   * If true, the wrapper will adjust spacing to match rounded styles.
   */
  rounded?: boolean;

  // Other props

  /**
   * The HTML tag to use for the message and error components.
   */
  messageTag?: keyof HTMLElementTagNameMap;
  /**
   * The props to pass to the message and error components.
   */
  messageProps?: HTMLNeoBaseElement;
} & HTMLTransitionProps &
  NeoValidationContext<T, V, C> &
  HTMLNeoBaseElement;
