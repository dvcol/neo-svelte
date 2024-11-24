import type { Snippet } from 'svelte';
import type { NeoInputContext } from '~/input/neo-input.model.js';
import type { HTMLTransitionProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

export type NeoValidationContext<T extends HTMLElement = HTMLElement> = {
  /**
   * The message's element id.
   */
  messageId?: string;
  /**
   * A snippet or a string to display as the input info message.
   */
  message?: Snippet<[NeoInputContext<T>]> | string;
  /**
   * A snippet or a string to display as the input error message.
   */
  error?: Snippet<[NeoInputContext<T>]> | string;
};

export type NeoValidationProps<T extends HTMLElement = HTMLElement> = {
  // Snippets
  /**
   * The component to wrap with the validation context.
   */
  children?: Snippet<[NeoValidationContext<T>]>;

  // State

  /**
   * The HTML tag to use for the wrapper component (when message or error are shown).
   */
  tag?: keyof HTMLElementTagNameMap;
  /**
   * The context to pass to the snippets.
   */
  context?: NeoInputContext<T>;

  // Other props

  /**
   * The HTML tag to use for the message and error components.
   */
  messageTag?: keyof HTMLElementTagNameMap;
  /**
   * The props to pass to the message and error components.
   */
  messageProps?: HTMLNeoBaseElement;
} & NeoValidationContext<T> &
  HTMLNeoBaseElement &
  HTMLTransitionProps;
