import type { Snippet } from 'svelte';

import type { NeoFieldsetProps } from '~/inputs/common/neo-fieldset.model.js';
import type { NeoFormContext } from '~/inputs/common/neo-form-context.svelte.js';
import type { HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';

export type NeoFormProps = {
  /**
   * The content of the form.
   */
  children?: Snippet<[NeoFormContext]>;

  // States
  /**
   * Unique identifier of the form.
   * @default neo-form-{uuid}
   */
  id?: HTMLElement['id'];

  // Legend
  /**
   * The form's legend (wraps the form ina fieldset if provided).
   */
  legend?: NeoFieldsetProps['legend'];
  /**
   * Override the default legend id.
   *
   * @default neo-form-legend-{uuid}
   */
  legendId?: NeoFieldsetProps['id'];
  /**
   * Optional properties to pass to the legend.
   */
  fieldsetProps?: NeoFieldsetProps;
  /**
   * Optional properties to pass to the legend.
   */
  legendProps?: NeoFieldsetProps['legendProps'];
  /**
   * Hide the fieldset border.
   */
  borderless?: NeoFieldsetProps['borderless'];
} & HTMLNeoBaseElement<HTMLFormElement> &
  HTMLRefProps<HTMLFormElement>;
