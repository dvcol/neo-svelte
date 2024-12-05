import type { Snippet } from 'svelte';
import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoInputProps } from '~/inputs/neo-input.model.js';

export type NeoFilePickerContext = {
  /**
   * The current state of the file picker.
   */
  state?: 'idle' | 'loading' | 'success' | 'error';
  /**
   * The current progress of the file picker.
   */
  progress?: number;
  /**
   * The current files in the file picker.
   */
  files?: FileList;
};

export type NeoFilePickerProps = {
  // Snippet
  /**
   * The snippet to render when the file picker is in an expanded state (overrides default).
   */
  dropzone?: Snippet<[NeoFilePickerContext]>;

  // States
  /**
   * If the file picker is in an expanded state.
   * @see expand
   * @see drop
   */
  expanded?: boolean;
  /**
   * Whether the file picker should expand when dragged over.
   */
  expand?: boolean;
  /**
   * Whether the file picker should accept dropped files.
   */
  drop?: boolean;

  // Other props
  /**
   * Button properties to pass to the picker button.
   */
  buttonProps?: NeoButtonProps;
} & NeoInputProps;
