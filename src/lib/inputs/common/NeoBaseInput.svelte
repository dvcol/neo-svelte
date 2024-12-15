<script lang="ts">
  import { tick } from 'svelte';

  import type { EventHandler, FocusEventHandler, FormEventHandler } from 'svelte/elements';

  import type { SvelteEvent } from '~/utils/html-element.utils.js';

  import { type NeoBaseInputProps, type NeoInputMethods, type NeoInputState, type NeoInputValue } from '~/inputs/common/neo-input.model.js';
  import { toAction, toActionProps } from '~/utils/action.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // States
    id,
    ref = $bindable(),

    files = $bindable(), // type="file"
    value = $bindable(),
    group = $bindable(), // type="radio"
    checked = $bindable(), // type="checkbox"
    indeterminate = $bindable(), // type="checkbox"

    initial = $bindable(),
    touched = $bindable(false),
    valid = $bindable(),
    dirty = $bindable(false),
    focused = $bindable(false),
    disabled,
    readonly,
    nullable = true,

    dirtyOnInput,
    dirtyOnBlur,
    validateOnInput,
    validateOnBlur,
    validationMessage = $bindable(),

    // Styles
    before,
    after,

    // Actions
    use,

    // Events
    onblur,
    onfocus,
    oninput,
    onchange,
    oninvalid,

    onclear,
    onmark,

    // Other props
    ...rest
  }: NeoBaseInputProps = $props();
  /* eslint-enable prefer-const */

  const getValue = () => {
    if (rest.type === 'file') return files;
    if (rest.type === 'checkbox' || rest.type === 'radio') return checked;
    return value;
  };

  const typedValue = $derived(getValue());
  const hasValue = () => {
    if (rest?.type === 'file') return !!files?.length;
    if (rest?.type === 'checkbox' || rest.type === 'radio') return checked !== undefined;
    if (typeof value === 'string') return !!value.length;
    return value !== undefined && value !== null;
  };
  const fallback = () => {
    if (nullable) return value;
    if (rest?.defaultValue === undefined) return value;
    if (rest.type && ['file', 'checkbox', 'radio'].includes(rest.type)) return value;
    if (hasValue()) return value;
    value = rest?.defaultValue;
    return value;
  };

  const reset = () => {
    if (rest.type === 'checkbox' || rest.type === 'radio') {
      checked = rest?.defaultChecked ?? rest?.defaultValue ?? false;
      if (rest.type === 'checkbox') indeterminate = false;
      return;
    }
    value = nullable ? '' : (rest?.defaultValue ?? '');
    if (rest.type === 'file') files = new DataTransfer().files;
  };

  const currentState = $derived<NeoInputState<HTMLInputElement>>({ touched, dirty, valid, value: typedValue, initial });

  const validate: NeoInputMethods<HTMLInputElement>['validate'] = (update: { dirty?: boolean; valid?: boolean } = { dirty: true, valid: true }) => {
    if (update.dirty) dirty = typedValue !== initial;
    if (!update.valid) return { ...currentState };
    valid = ref?.checkValidity();
    validationMessage = ref?.validationMessage;
    return { ...currentState };
  };

  /**
   * Change the state of the input
   * @param state
   */
  export const mark: NeoInputMethods<HTMLInputElement>['mark'] = (state: NeoInputState<HTMLInputElement>) => {
    if (state.touched !== undefined) touched = state.touched;
    if (state.valid !== undefined) valid = state.valid;
    if (state.dirty === undefined) return onmark?.({ ...currentState });
    dirty = state.dirty;
    if (!dirty) initial = typedValue;
    return onmark?.({ ...currentState });
  };

  const focus = () => {
    if (focused || disabled || readonly) return;
    ref?.focus();
  };

  /**
   * Clear the input state
   */
  export const clear: NeoInputMethods<HTMLInputElement>['clear'] = async (
    state?: NeoInputState<HTMLInputElement>,
    event?: InputEvent | SvelteEvent<InputEvent>,
  ) => {
    reset();
    await tick();
    focus();
    if (state) mark({ touched: false, dirty: false, ...state });
    else validate();
    onclear?.({ ...currentState }, event);
    if (event) return ref?.dispatchEvent(event);
    const _event: InputEventInit = { bubbles: true, cancelable: false, data: value, inputType: 'clear' };
    oninput?.(new InputEvent('input', _event) as SvelteEvent<InputEvent, any>);
  };

  /**
   * Change the state of the input
   */
  export const change: NeoInputMethods<HTMLInputElement>['change'] = (_value: NeoInputValue<HTMLInputElement>, event?: InputEvent) => {
    if (rest.type === 'checkbox' || rest.type === 'radio') {
      checked = !!_value;
    } else {
      value = _value?.toString();
    }
    focus();
    if (event) ref?.dispatchEvent(event);
    return validate();
  };

  const onFocus: FocusEventHandler<HTMLInputElement> = e => {
    focused = true;
    touched = true;
    onfocus?.(e);
  };

  const onBlur: FocusEventHandler<HTMLInputElement> = e => {
    focused = false;
    validate({ dirty: dirtyOnBlur, valid: validateOnBlur });
    onblur?.(e);
  };

  const onInput: FormEventHandler<HTMLInputElement> = e => {
    touched = true;
    validate({ dirty: dirtyOnInput, valid: validateOnInput });
    oninput?.(e);
  };

  const onChange: FormEventHandler<HTMLInputElement> = e => {
    touched = true;
    validate();
    fallback();
    onchange?.(e);
  };

  const onInvalid: EventHandler<Event, HTMLInputElement> = e => {
    valid = false;
    validationMessage = ref?.validationMessage;
    e.preventDefault();
    oninvalid?.(e);
  };

  $effect(() => {
    if (!ref) return;
    Object.assign(ref, { mark, clear, change, validate });
  });

  $effect(() => {
    if (group === undefined) return;
    checked = !!ref?.checked;
  });

  const useFn = $derived(toAction(use));
  const useProps = $derived(toActionProps(use));
</script>

{#if rest.type === 'file'}
  <input
    aria-invalid={valid === undefined ? undefined : !valid}
    type="file"
    {id}
    {disabled}
    {readonly}
    bind:this={ref}
    bind:files
    bind:value
    bind:group
    bind:indeterminate
    class:neo-input={true}
    class:neo-after={after}
    class:neo-before={before}
    onblur={onBlur}
    onfocus={onFocus}
    oninput={onInput}
    onchange={onChange}
    oninvalid={onInvalid}
    use:useFn={useProps}
    {...rest}
  />
{:else if rest.type === 'checkbox'}
  <input
    aria-invalid={valid === undefined ? undefined : !valid}
    type="checkbox"
    {id}
    {disabled}
    {readonly}
    {value}
    bind:this={ref}
    bind:group
    bind:checked
    bind:indeterminate
    class:neo-input={true}
    class:neo-after={after}
    class:neo-before={before}
    onblur={onBlur}
    onfocus={onFocus}
    oninput={onInput}
    onchange={onChange}
    oninvalid={onInvalid}
    use:useFn={useProps}
    {...rest}
  />
{:else if rest.type === 'radio'}
  <input
    type="radio"
    {id}
    {disabled}
    {readonly}
    {value}
    bind:this={ref}
    bind:group
    bind:indeterminate
    class:neo-input={true}
    class:neo-after={after}
    class:neo-before={before}
    onblur={onBlur}
    onfocus={onFocus}
    oninput={onInput}
    onchange={onChange}
    oninvalid={onInvalid}
    use:useFn={useProps}
    {...rest}
  />
{:else}
  <input
    aria-invalid={valid === undefined ? undefined : !valid}
    {id}
    {disabled}
    {readonly}
    bind:this={ref}
    bind:value
    bind:group
    bind:indeterminate
    class:neo-input={true}
    class:neo-after={after}
    class:neo-before={before}
    onblur={onBlur}
    onfocus={onFocus}
    oninput={onInput}
    onchange={onChange}
    oninvalid={onInvalid}
    use:useFn={useProps}
    {...rest}
  />
{/if}

<style lang="scss">
  .neo-input {
    display: inline-flex;
    flex: 1 1 auto;
    align-self: center;
    box-sizing: border-box;
    width: 100%;
    min-width: var(--neo-input-min-width, 1ch);
    max-width: 100%;
    min-height: var(--neo-input-min-height, fit-content);
    padding: var(--neo-input-padding, 0.75rem);
    color: inherit;
    font: inherit;
    text-decoration: none;
    text-overflow: ellipsis;
    background-color: transparent;
    border: none;
    border-radius: var(--neo-input-border-radius, var(--neo-border-radius));
    outline: none;
    transition:
      color 0.3s ease,
      margin 0.3s ease,
      padding 0.3s ease,
      background-color 0.3s ease,
      backdrop-filter 0.3s ease,
      border-color 0.3s ease,
      border-radius 0.3s ease,
      box-shadow 0.3s ease-out;

    &.neo-before {
      padding-left: 0;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    &.neo-after {
      padding-right: 0;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    &::placeholder {
      color: var(--neo-input-placeholder-color, var(--neo-text-color-disabled));
      transition: opacity 0.3s ease;
    }

    &:read-only {
      cursor: inherit;
    }

    &:disabled {
      color: var(--neo-text-color-disabled);
      cursor: not-allowed;
    }

    &[type='password']:not(:placeholder-shown) {
      letter-spacing: 0.2em;
      -webkit-text-stroke-width: 0.15em;

      @supports (-webkit-touch-callout: none) {
        font: small-caption;
        font-size: var(--neo-font-size-xs, 0.75rem);
      }
    }
  }
</style>
