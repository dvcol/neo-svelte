<script lang="ts">
  import { tick } from 'svelte';

  import type { EventHandler, FocusEventHandler, FormEventHandler, HTMLSelectAttributes } from 'svelte/elements';
  import type { SvelteEvent } from '~/utils/html-element.utils.js';

  import NeoBaseInput from '~/inputs/common/NeoBaseInput.svelte';

  import { type NeoBaseInputProps, type NeoInputMethods, type NeoInputState, type NeoInputValue } from '~/inputs/common/neo-input.model.js';
  import { toAction, toActionProps } from '~/utils/action.utils.js';
  import { toSize } from '~/utils/style.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    children,
    display,

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

    // Size
    width: _width,
    height: _height,
    fitContent,

    // Styles
    before,
    after,
    hide,

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
    displayProps,
    ...rest
  }: NeoBaseInputProps = $props();
  /* eslint-enable prefer-const */

  const { tag: displayTag = 'span', ...displayRest } = $derived(displayProps ?? {});

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

  export const validate: NeoInputMethods<HTMLInputElement>['validate'] = (
    update: { dirty?: boolean; valid?: boolean } = { dirty: true, valid: true },
  ) => {
    if (update.dirty) dirty = !Object.is(typedValue, initial);
    if (!update.valid) return { ...currentState };
    if (readonly) ref?.removeAttribute('readonly');
    valid = ref?.checkValidity();
    validationMessage = ref?.validationMessage;
    if (readonly) ref?.setAttribute('readonly', '');
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
  export const change: NeoInputMethods<HTMLInputElement>['change'] = async (_value: NeoInputValue<HTMLInputElement>, event?: InputEvent) => {
    if (rest.type === 'checkbox' || rest.type === 'radio') {
      checked = !!_value;
    } else {
      value = _value?.toString();
    }
    focus();
    await tick();
    if (event) ref?.dispatchEvent(event);
    return validate();
  };

  const onFocus: FocusEventHandler<HTMLElement> = e => {
    if (!readonly && !disabled) touched = true;
    onfocus?.(e as SvelteEvent<FocusEvent, HTMLInputElement>);
  };

  const onBlur: FocusEventHandler<HTMLElement> = e => {
    validate({ dirty: dirtyOnBlur, valid: validateOnBlur });
    onblur?.(e as SvelteEvent<FocusEvent, HTMLInputElement>);
  };

  const onInput: FormEventHandler<HTMLElement> = e => {
    touched = true;
    validate({ dirty: dirtyOnInput, valid: validateOnInput });
    oninput?.(e as SvelteEvent<InputEvent, HTMLInputElement>);
  };

  const onChange: FormEventHandler<HTMLElement> = e => {
    touched = true;
    validate();
    fallback();
    onchange?.(e as SvelteEvent<InputEvent, HTMLInputElement>);
  };

  const onInvalid: EventHandler<Event, HTMLElement> = e => {
    valid = false;
    validationMessage = ref?.validationMessage;
    e.preventDefault();
    oninvalid?.(e as SvelteEvent<Event, HTMLInputElement>);
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

  const width = $derived(toSize(_width));
  const height = $derived(toSize(_height));
</script>

{#if display !== undefined}
  <NeoBaseInput
    bind:ref
    bind:files
    bind:value
    bind:group
    bind:checked
    bind:indeterminate
    bind:initial
    bind:touched
    bind:valid
    bind:dirty
    bind:focused
    bind:validationMessage
    hidden
    aria-hidden
    tabindex={-1}
    {children}
    {id}
    {disabled}
    {readonly}
    {nullable}
    {dirtyOnInput}
    {dirtyOnBlur}
    {validateOnInput}
    {validateOnBlur}
    {onblur}
    {onfocus}
    {oninput}
    {onchange}
    {oninvalid}
    {onclear}
    {onmark}
    {...rest}
    class={['neo-input-display-input', rest.class]}
    hide
  />
  <svelte:element
    this={displayTag}
    class:neo-input={true}
    class:neo-after={after}
    class:neo-before={before}
    class:neo-fit-content={fitContent}
    style:width={width?.absolute}
    style:min-width={width?.min}
    style:max-width={width?.max}
    style:height={height?.absolute}
    style:min-height={height?.min}
    style:max-height={height?.max}
    use:useFn={useProps}
    {...displayRest}
  >
    {#if typeof display === 'function'}
      {@render display(currentState)}
    {:else}
      <input inert tabindex="-1" class="neo-input-display-content" readonly value={display} placeholder={rest?.placeholder} size={rest?.size} />
    {/if}
  </svelte:element>
{:else if rest.type === 'select'}
  <select
    aria-invalid={valid === undefined ? undefined : !valid}
    {id}
    {disabled}
    bind:this={ref as any}
    bind:value
    bind:focused
    class:neo-input={true}
    class:neo-hide={hide}
    class:neo-after={after}
    class:neo-before={before}
    class:neo-fit-content={fitContent}
    style:width={width?.absolute}
    style:min-width={width?.min}
    style:max-width={width?.max}
    style:height={height?.absolute}
    style:min-height={height?.min}
    style:max-height={height?.max}
    onblur={onBlur}
    onfocus={onFocus}
    oninput={onInput}
    onchange={onChange}
    oninvalid={onInvalid}
    use:useFn={useProps}
    {...rest as HTMLSelectAttributes}
  >
    {@render children?.()}
  </select>
{:else if rest.type === 'file'}
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
    bind:focused
    bind:indeterminate
    class:neo-input={true}
    class:neo-hide={hide}
    class:neo-after={after}
    class:neo-before={before}
    class:neo-fit-content={fitContent}
    style:width={width?.absolute}
    style:min-width={width?.min}
    style:max-width={width?.max}
    style:height={height?.absolute}
    style:min-height={height?.min}
    style:max-height={height?.max}
    onblur={onBlur}
    onfocus={onFocus}
    oninput={onInput}
    onchange={onChange}
    oninvalid={onInvalid}
    use:useFn={useProps}
    {...rest}
  />

  <!--  Space necessary for self-closing input -->
  {@render children?.()}
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
    bind:focused
    bind:checked
    bind:indeterminate
    class:neo-input={true}
    class:neo-hide={hide}
    class:neo-after={after}
    class:neo-before={before}
    class:neo-fit-content={fitContent}
    style:width={width?.absolute}
    style:min-width={width?.min}
    style:max-width={width?.max}
    style:height={height?.absolute}
    style:min-height={height?.min}
    style:max-height={height?.max}
    onblur={onBlur}
    onfocus={onFocus}
    oninput={onInput}
    onchange={onChange}
    oninvalid={onInvalid}
    use:useFn={useProps}
    {...rest}
  />

  <!--  Space necessary for self-closing input -->
  {@render children?.()}
{:else if rest.type === 'radio'}
  <input
    type="radio"
    {id}
    {disabled}
    {readonly}
    {value}
    bind:this={ref}
    bind:group
    bind:focused
    bind:indeterminate
    class:neo-input={true}
    class:neo-hide={hide}
    class:neo-after={after}
    class:neo-before={before}
    class:neo-fit-content={fitContent}
    style:width={width?.absolute}
    style:min-width={width?.min}
    style:max-width={width?.max}
    style:height={height?.absolute}
    style:min-height={height?.min}
    style:max-height={height?.max}
    onblur={onBlur}
    onfocus={onFocus}
    oninput={onInput}
    onchange={onChange}
    oninvalid={onInvalid}
    use:useFn={useProps}
    {...rest}
  />

  <!--  Space necessary for self-closing input -->
  {@render children?.()}
{:else}
  <input
    aria-invalid={valid === undefined ? undefined : !valid}
    {id}
    {disabled}
    {readonly}
    bind:this={ref}
    bind:value
    bind:group
    bind:focused
    bind:indeterminate
    class:neo-input={true}
    class:neo-hide={hide}
    class:neo-after={after}
    class:neo-before={before}
    class:neo-fit-content={fitContent}
    style:width={width?.absolute}
    style:min-width={width?.min}
    style:max-width={width?.max}
    style:height={height?.absolute}
    style:min-height={height?.min}
    style:max-height={height?.max}
    onblur={onBlur}
    onfocus={onFocus}
    oninput={onInput}
    onchange={onChange}
    oninvalid={onInvalid}
    use:useFn={useProps}
    {...rest}
  />

  <!--  Space necessary for self-closing input -->
  {@render children?.()}
{/if}

<style lang="scss">
  %input {
    color: inherit;
    font: inherit;
    text-decoration: none;
    text-overflow: ellipsis;
    background-color: transparent;
    border: none;
    outline: none;
    appearance: none;

    &::placeholder {
      color: var(--neo-input-color-placeholder, var(--neo-text-color-disabled));
      transition: opacity 0.3s ease;
    }

    &:read-only {
      cursor: inherit;
    }

    &:disabled {
      color: var(--neo-input-color-disabled, var(--neo-text-color-disabled));
      cursor: not-allowed;
    }
  }

  .neo-input {
    @extend %input;

    display: inline-flex;
    flex: 1 1 auto;
    align-self: center;
    box-sizing: border-box;
    width: 100%;
    min-width: var(--neo-input-min-width, 1ch);
    max-width: 100%;
    min-height: var(--neo-input-min-height, fit-content);
    padding: var(--neo-input-padding, 0.75rem);
    border-radius: var(--neo-input-border-radius, var(--neo-border-radius));

    &-display-content {
      @extend %input;

      margin: 0;
      padding: 0;
    }

    &.neo-hide {
      display: none;
    }

    &.neo-fit-content {
      field-sizing: content;
    }

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

    &[type='password']:not(:placeholder-shown, :-webkit-autofill:focus, :-webkit-autofill:active) {
      letter-spacing: 0.2em;
      -webkit-text-stroke-width: 0.15em;

      @supports (-webkit-touch-callout: none) or (hanging-punctuation: first) or (-moz-appearance: none) {
        font: small-caption;
        font-size: var(--neo-font-size-xs, 0.75rem);
        line-height: var(--neo-line-height, 1.5rem);
      }
    }

    &[type='search']::-webkit-search-decoration,
    &[type='search']::-webkit-search-cancel-button,
    &[type='search']::-webkit-search-results-button,
    &[type='search']::-webkit-search-results-decoration {
      appearance: none;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active,
    &:-webkit-autofill::first-line {
      color: var(--neo-input-text-color, var(--neo-text-color, inherit)) !important;
      text-decoration: none;
      background-clip: text;
      box-shadow: none;
      appearance: none;
      text-decoration-color: inherit;
      caret-color: var(--neo-input-text-color, var(--neo-text-color, inherit));
      -webkit-text-fill-color: var(--neo-input-text-color, var(--neo-text-color, inherit));
      -webkit-text-stroke-color: var(--neo-input-text-color, var(--neo-text-color, inherit));

      &::selection {
        background-color: oklch(from var(--neo-input-text-color, var(--neo-text-color, inherit)) calc(l + 0.3) c h / 20%);
      }
    }
  }
</style>
