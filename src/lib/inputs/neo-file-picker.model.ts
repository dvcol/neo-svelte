import type { Snippet } from 'svelte';
import type { MouseEventHandler } from 'svelte/elements';
import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoCardProps } from '~/cards/neo-card.model.js';
import type { NeoInputProps } from '~/inputs/common/neo-input.model.js';
import type { SvelteEvent } from '~/utils/html-element.utils.js';

export type NeoFilePickerContext<Multiple extends boolean = boolean> = {
  /**
   * If the file picker is in a dragging state.
   * @see drop
   */
  dragging?: boolean;
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
  /**
   * A snippet or a string to display as the input label.
   */
  label?: Snippet | string;
  /**
   * Custom icon for the download button.
   */
  iconDownload?: NeoButtonProps['icon'];
  /**
   * Custom icon for the upload button.
   */
  iconUpload?: NeoButtonProps['icon'];

  // States
  /**
   * If the file picker is in an expanded state.
   * @see expand
   * @see drop
   */
  expanded?: boolean;
  /**
   * Whether the file picker should accept dropped files.
   */
  drop?: boolean;

  // Styles
  /**
   * The text to display on the drop area placeholder.
   */
  dropText?: NeoInputProps['placeholder'];
  /**
   * The text to display on the expanded header.
   *
   * @default Number of files.
   */
  expandText?: string;
  /**
   * The maximum height of the file list in expanded state.
   *
   * @see expanded
   * @default 20rem
   */
  expandHeight?: string;

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
  /**
   * Card properties to pass to the card in expanded state.
   * @see expanded
   */
  cardProps?: Omit<NeoCardProps, 'children'> & Pick<NeoFilePickerCardProps, 'editButtonProps' | 'removeButtonProps'>;
  /**
   * Input Group properties to pass to the input group container.
   */
  groupProps?: NeoInputProps['containerProps'];
} & NeoFilePickerContext<Multiple> &
  Omit<NeoInputProps, 'multiple' | 'oninput' | 'onchange' | 'label'>;

export type NeoFilePickerCardProps = Omit<NeoCardProps, 'children'> & {
  /**
   * Custom icon for the download button.
   */
  iconDownload?: NeoButtonProps['icon'];
  /**
   * Custom icon for the upload button.
   */
  iconUpload?: NeoButtonProps['icon'];

  // States
  /**
   * If the is currently in a dragging state.
   */
  dragging?: boolean;
  /**
   * Header text to display in the card.
   */
  detailText?: string;

  // Styles
  /**
   * The maximum height of the file card list in expanded state.
   *
   * @see expanded
   * @default 20rem
   */
  maxHeight?: string;

  // Events
  /**
   * Callback when the affix close button is clicked.
   */
  onClear?: MouseEventHandler<HTMLButtonElement>;
  /**
   * Callback when the footer edit button is clicked.
   */
  onEdit?: MouseEventHandler<HTMLDivElement>;
  /**
   * Callback when the list remove item button is clicked.
   * @param index
   * @param e
   */
  onRemove?: (index: number, e: SvelteEvent<MouseEvent>) => void;

  // Other props
  /**
   * Button properties to pass to the add files button.
   */
  addButtonProps?: NeoButtonProps;
  /**
   * Button properties to pass to the edit files button.
   */
  editButtonProps?: NeoButtonProps;
  /**
   * Button properties to pass to the remove files button.
   */
  removeButtonProps?: NeoButtonProps;
} & Pick<
    NeoFilePickerProps,
    | 'files'
    | 'valid'
    | 'clearable'
    | 'placeholder'
    | 'dropText'
    | 'loading'
    | 'multiple'
    | 'append'
    | 'children'
    | 'label'
    | 'labelProps'
    | 'labelRef'
    | 'required'
  >;
