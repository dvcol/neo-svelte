import type { Snippet } from 'svelte';
import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoInputProps } from '~/inputs/neo-input.model.js';
import type { SvelteEvent } from '~/utils/html-element.utils.js';

export type NeoFilePickerContext<Multiple extends boolean = boolean> = {
  /**
   * If the file picker is in an expanded state.
   * @see expand
   * @see drop
   */
  expanded?: boolean;
  /**
   * If the file picker is in a dragging state.
   * @see drop
   */
  dragging?: boolean;
  /**
   * Whether the file picker should accept dropped files.
   */
  drop?: boolean;
  /**
   * Whether the file picker should accept multiple files.
   */
  multiple?: Multiple;
  /**
   * Whether the file picker should append to the current files.
   * If false, the current files will be replaced.
   *
   * Only applies when multiple is true.
   *
   * @see multiple
   */
  append?: boolean;
  /**
   * The current files in the file picker.
   */
  files?: FileList;
};

export type NeoFilePickerValue<Multiple extends boolean = boolean> =
  | (Multiple extends true ? FileList : Multiple extends false ? File : FileList | File)
  | null;

export type NeoFilePickerProps<Multiple extends boolean = boolean> = {
  // Snippet
  /**
   * The snippet to render when the file picker is in an expanded state (overrides default).
   */
  children?: Snippet<[NeoFilePickerContext]>;

  // Styles
  /**
   * The text to display on the drop area placeholder.
   */
  dropText?: string;

  // Events
  /**
   * On input event handler.
   * Mirrors the native oninput handler with the files as the second argument.
   * @param e - The original input event.
   * @param value - FileList if multiple is true, File if multiple is false.
   */
  oninput?: <Value extends Multiple = Multiple>(e: SvelteEvent<InputEvent, HTMLInputElement>, value: NeoFilePickerValue<Value>) => unknown;
  /**
   * On change event handler.
   * Mirrors the native onchange handler with the files as the second argument.
   * @param e - The original input event.
   * @param value - FileList if multiple is true, File if multiple is false.
   */
  onchange?: <Value extends Multiple = Multiple>(e: SvelteEvent<InputEvent, HTMLInputElement>, value: NeoFilePickerValue<Value>) => unknown;

  // Other props
  /**
   * Button properties to pass to the picker button.
   */
  buttonProps?: NeoButtonProps;
} & NeoFilePickerContext<Multiple> &
  Omit<NeoInputProps, 'multiple' | 'oninput' | 'onchange'>;
