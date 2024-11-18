// validation : https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/setCustomValidity
// arvia valid/invalid, etc;
// aria-describedby for id (use rest.id && rest.label)

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

export type NeoInputElevation = ShadowElevation;
export type NeoInputProps = {
  // Snippets

  label?: Snippet | string;
  prefix?: Snippet;
  prefixTag?: keyof HTMLElementTagNameMap;
  prefixProps?: HTMLNeoBaseElement;
  suffix?: Snippet;
  suffixTag?: keyof HTMLElementTagNameMap;
  suffixProps?: HTMLNeoBaseElement;

  // States
  /**
   * The HTML tag to use for the tabs.
   * @default 'div'
   */
  tag?: keyof HTMLElementTagNameMap;
  /**
   * If `true`, the input dirty state will persist regardless of the input content.
   */
  dirtyOnChange?: boolean;

  // Styles
  elevation?: NeoInputElevation;
  hover?: NeoInputElevation;
  rounded?: boolean;
  glass?: boolean;

  // Events
  onmark?: (state: NeoInputState) => unknown;
  onclear?: (state: NeoInputState) => unknown;

  // Other props
  containerProps?: HTMLNeoBaseElement;
} & NeoInputState &
  HTMLNeoBaseElement<HTMLInputElement> &
  HTMLActionProps &
  HTMLRefProps;
