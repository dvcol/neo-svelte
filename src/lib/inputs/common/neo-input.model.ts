import type { Snippet } from 'svelte';
import type { HTMLInputAttributes, HTMLSelectAttributes, HTMLTextareaAttributes } from 'svelte/elements';
import type { NeoAffixProps } from '~/inputs/common/neo-affix.model.js';
import type { NeoInputValidationProps } from '~/inputs/common/neo-input-validation.model.js';
import type { NeoLabelProps } from '~/inputs/common/neo-label.model.js';
import type { NeoValidationFieldContext, NeoValidationProps, NeoValidationState } from '~/inputs/common/neo-validation.model.js';
import type { HTMLTransitionProps, HTMLUseProps } from '~/utils/action.utils.js';
import type { Color } from '~/utils/colors.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps, HTMLTagProps, SvelteEvent } from '~/utils/html-element.utils.js';
import type {
  BlurElevation,
  BlurElevationString,
  ShadowElevation,
  ShadowElevationString,
  ShadowHoverElevation,
  ShadowHoverElevationsString,
} from '~/utils/shadow.utils.js';
import type { SizeInput } from '~/utils/style.utils.js';

export type NeoInputValue<T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = T extends HTMLTextAreaElement
  ? HTMLTextareaAttributes['value']
  : T extends HTMLSelectElement
    ? HTMLSelectAttributes['value']
    : HTMLInputAttributes['value'] | HTMLInputAttributes['checked'] | HTMLInputAttributes['bind:files'];

type NeoInputHTMLAttributes<T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = T extends HTMLTextAreaElement
  ? HTMLTextareaAttributes
  : T extends HTMLSelectElement
    ? HTMLSelectAttributes & { type?: 'select' }
    : HTMLInputAttributes & {
        files?: HTMLInputAttributes['bind:files'];
        group?: HTMLInputAttributes['bind:group'];
      };

export type NeoInputState<T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = NeoValidationState<NeoInputValue<T>>;

export type NeoInputStyles = {
  // Styles

  /**
   * Input elevation.
   * @default 3
   */
  elevation?: NeoInputElevation;
  /**
   * Whether to increase/decrease the elevation when hovered/focused.
   * @default 0
   */
  hover?: NeoInputHoverElevation;
  /**
   * The blur level to apply when in glass mode.
   *
   * @default elevation, min: 1, max: 5
   * @see glass
   */
  blur?: NeoInputBlur;
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
   * Tints the input with the current color.
   */
  tinted?: boolean;
  /**
   * Text color to use for the input.
   */
  color?: Color | CSSStyleDeclaration['color'];
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

export type NeoInputMethods<T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = {
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
  change: (value: NeoInputValue<T>, event?: InputEvent | SvelteEvent<InputEvent>) => Promise<NeoInputState<T>>;
  /**
   * Check the input validity.
   * @param update whether to check the input dirty and/or valid state.
   */
  validate: (update?: { dirty?: boolean; valid?: boolean }) => NeoInputState<T>;
};

export type NeoInputBlur = BlurElevation | BlurElevationString;
export type NeoInputElevation = ShadowElevation | ShadowElevationString;
export type NeoInputHoverElevation = ShadowHoverElevation | ShadowHoverElevationsString;
export type NeoInputContext<T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = NeoValidationFieldContext<T, NeoInputValue<T>> &
  Partial<NeoInputStyles & NeoInputMethods<T>>;

export const NeoInputLabelPlacement = {
  Inside: 'inside' as const,
  Top: 'top' as const,
  Left: 'left' as const,
  Right: 'right' as const,
} as const;

export type NeoInputLabelPlacements = (typeof NeoInputLabelPlacement)[keyof typeof NeoInputLabelPlacement];

export type NeoBaseInputProps<T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement = NeoInputHTMLElement> = {
  // Snippets
  /**
   * A snippet to display as the input children.
   */
  children?: Snippet;
  /**
   * A snippet to display as the input display value.
   *
   * @note: This will hide the input (hidden & display: none) and might impact accessibility or form submission.
   */
  display?: Snippet<[NeoInputState<T>]> | string;

  // Styles
  /**
   * Will apply a display: none style to the input.
   */
  hide?: boolean;
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
   * If false, and a default value is provided, the input will be set to the default value when cleared.
   *
   * Note: This does not apply to checkboxes, radios, and file inputs.
   *
   * @default true
   */
  nullable?: boolean;
  /**
   * Fall back value when the input value is cleared.
   */
  defaultValue?: HTMLInputAttributes['value'];
  /**
   * Fall back checked state when the input value is cleared.
   */
  defaultChecked?: HTMLInputAttributes['checked'];

  // Sizing
  /**
   * Optional width constraints.
   */
  width?: SizeInput<'width'>;
  /**
   * Optional height constraints.
   */
  height?: SizeInput<'height'>;
  /**
   * If true, the input will adjust its size to fit the content.
   *
   * @see [field-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing) for browser support
   */
  fitContent?: boolean;

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

  // Other props
  /**
   * The props to pass to the input display wrapper.
   */
  displayProps?: HTMLNeoBaseElement & HTMLTagProps;
} & HTMLUseProps &
  HTMLRefProps<T> &
  NeoInputState<T> &
  NeoInputHTMLAttributes<T>;

export type NeoInputGroupProps<T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = {
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
  /**
   * Element(s) to render inside the input-group.
   */
  children?: Snippet<[NeoInputContext<T>]>;

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
   * Whether the input group has focus (input, affixes or label).
   */
  focusin?: boolean;
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
  validation?: NeoInputValidationProps<T>['validation'];
  /**
   * If `true`, and `validation` is enabled, the validation state will be displayed with an icon.
   */
  validationIcon?: boolean;

  // Styles

  /**
   * Display the label as a placeholder inside the input when empty
   * @default true
   */
  floating?: boolean;
  /**
   * Label placement.
   * When set to outside (`top`, `left`, `right`), the label will be displayed within the input container's margin.
   * Make sure to set the container's margin appropriately to avoid collision or content shift.
   *
   * @default 'inside'
   */
  placement?: NeoInputLabelPlacements;

  // Other props

  /**
   * The ref to bind to the input wrapper (validation).
   */
  wrapperRef?: HTMLRefProps['ref'];
  /**
   * The props to pass to the wrapper component.
   */
  wrapperProps?: NeoInputValidationProps<T>;

  /**
   * The ref to bind to the input container.
   */
  containerRef?: HTMLRefProps['ref'];
  /**
   * The props to pass to the input container.
   */
  containerProps?: HTMLNeoBaseElement & HTMLTagProps;

  /**
   * The props to pass to the message and error components.
   */
  messageProps?: NeoValidationProps<T>['messageProps'];

  /**
   * The props to pass to the suffix.
   */
  afterProps?: HTMLNeoBaseElement & HTMLTagProps;
  /**
   * The ref to bind to the suffix.
   */
  afterRef?: HTMLElement;

  /**
   * The props to pass to the affix.
   */
  affixProps?: NeoAffixProps;
  /**
   * The ref to bind to the affix.
   */
  affixRef?: HTMLElement;

  /**
   * The props to pass to the label.
   */
  labelProps?: NeoLabelProps;
  /**
   * The ref to bind to the label.
   */
  labelRef?: HTMLLabelElement;
} & Omit<NeoBaseInputProps<T>, 'after' | 'before'> &
  NeoInputStyles &
  HTMLTransitionProps;

export type NeoInputProps<T extends HTMLInputElement | HTMLSelectElement = NeoInputHTMLElement> = {
  // Snippets

  /**
   * A snippet to display as the input prefix.
   */
  before?: Snippet<[NeoInputContext<T>]>;
  /**
   * A snippet to display inside the input group but outside the input.
   * This is meant for internal use only. Elements will not be styled as affixes.
   *
   * Use `before` or `after` for custom affixes.
   *
   * @internal
   */
  inner?: Snippet<[NeoInputContext<T>]>;

  // Other props

  /**
   * The props to pass to the prefix.
   */
  beforeProps?: HTMLNeoBaseElement & HTMLTagProps;
  /**
   * The ref to bind to the prefix.
   */
  beforeRef?: HTMLElement;
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
  defaultValue?: HTMLTextareaAttributes['value'];
  /**
   * Overrides the default scrollbars.
   */
  scrollbar?: boolean;
  /**
   * Automatically increments/decrements the textarea rows to fit the content.
   *
   * If `true`, the textarea will increment indefinitely and will not decrement.
   * If an object is provided, the textarea will increment up to `max` rows and decrement to `min` rows.
   *
   * @default true
   */
  autoResize?: boolean | NeoTextAreaResize;
} & Omit<NeoInputGroupProps<T>, 'hide' | 'display' | 'displayProps'> &
  HTMLTextareaAttributes;

export type NeoInputHTMLElement<T extends HTMLInputElement = HTMLInputElement> = T & Partial<NeoInputMethods<T>>;
export type NeoSelectHTMLElement<T extends HTMLSelectElement = HTMLSelectElement> = T & Partial<NeoInputMethods<T>>;
export type NeoTextareaHTMLElement<T extends HTMLTextAreaElement = HTMLTextAreaElement> = T & Partial<NeoInputMethods<T>>;
