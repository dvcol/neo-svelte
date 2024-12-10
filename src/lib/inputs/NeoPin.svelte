<script lang="ts">
  import type { EventHandler, FocusEventHandler, MouseEventHandler } from 'svelte/elements';
  import type { NeoInputHTMLElement } from '~/inputs/neo-input.model.js';

  import type { NeoPinContext, NeoPinProps } from '~/inputs/neo-pin.model.js';

  import type { SvelteEvent } from '~/utils/html-element.utils.js';

  import IconMinus from '~/icons/IconMinus.svelte';
  import NeoAffix from '~/inputs/NeoAffix.svelte';
  import NeoInput from '~/inputs/NeoInput.svelte';
  import NeoLabel from '~/inputs/NeoLabel.svelte';
  import NeoValidation from '~/inputs/NeoValidation.svelte';
  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { ArrowPrefix } from '~/utils/regex.utils.js';
  import { DefaultShadowElevation } from '~/utils/shadow.utils.js';
  import { doubleBind } from '~/utils/utils.svelte.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    label,
    before,
    after,
    message,
    error,
    icon,

    // State
    id = label ? `neo-input-${crypto.randomUUID()}` : undefined,
    ref = $bindable(),
    value = $bindable(''),
    valid = $bindable(),
    dirty = $bindable(false),
    touched = $bindable(false),
    hovered = $bindable(false),
    focused = $bindable(false),
    loading,
    clearable,

    // Validation
    step = 1,
    min = 0,
    max = 9,
    required,
    pattern,
    minlength = 6,
    maxlength,
    dirtyOnInput,
    validateOnInput,

    // Styles
    groups = 1,
    count = 4,
    separator,
    validation,
    vertical = groups > 1,

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Actions
    use,

    // Events
    oninput,
    onchange,
    oninvalid,

    // Other props
    labelRef = $bindable(),
    labelProps,
    afterProps,
    afterTag = 'div',
    beforeProps,
    beforeTag = 'div',
    containerProps,
    containerTag = 'div',
    wrapperProps,
    wrapperTag,
    messageProps,
    messageTag,
    ...rest
  }: NeoPinProps = $props();
  /* eslint-enable prefer-const */

  const refs = $state<NeoInputHTMLElement[][]>(Array(Number(groups)).fill([]));
  const values = $state<string[][]>(Array(Number(groups)).fill(Array(Number(count)).fill('')));
  const touches = $state<boolean[][]>(Array(Number(groups)).fill(Array(Number(count)).fill(false)));
  const dirtiness = $state<boolean[][]>(Array(Number(groups)).fill(Array(Number(count)).fill(false)));

  const initial = $state(value);
  let validationMessage: string | undefined = $state(ref?.validationMessage);

  const validate = () => {
    dirty = value !== initial;
    valid = ref?.checkValidity();
    validationMessage = ref?.validationMessage;
    return { touched, dirty, valid, value, initial };
  };

  const focus = (i = 0, j = 0, options: { previous?: boolean; last?: boolean; select?: boolean } = {}) => {
    let _group = i;
    let _count = j;

    if (options?.previous) {
      _group = j ? i : i - 1;
      _count = j ? j - 1 : count - 1;
    } else if (options.last) {
      values.findIndex((group, _i) => {
        const _j = group.findIndex(val => !val?.length);
        if (_j === -1) return false;
        _group = _i;
        _count = _j;
        return true;
      });
    } else {
      _group = j < count - 1 ? i : i + 1;
      _count = j < count - 1 ? j + 1 : 0;
    }

    refs?.[_group]?.[_count]?.focus();
    if (options?.select) refs?.[_group]?.[_count]?.select();
  };

  const onInput = (i: number, j: number) => {
    if (!values?.[i]?.[j]?.length) return;
    focus(i, j);
  };

  const arrow = (e: KeyboardEvent, i: number, j: number) => {
    e.preventDefault();
    if (e.key === 'ArrowLeft') return focus(i, j, { previous: true, select: e.shiftKey });
    if (e.key === 'ArrowRight') return focus(i, j, { select: e.shiftKey });
    const _value = values?.[i]?.[j];
    let data: string = '';
    if (e.key === 'ArrowUp') data = !Number.isNaN(Number(_value)) ? String(Math.min(Number(_value) + 1, Number(max))) : _value.toUpperCase();
    if (e.key === 'ArrowDown') data = !Number.isNaN(Number(_value)) ? String(Math.max(Number(_value) - 1, Number(min))) : _value.toLowerCase();
    if (!data?.length) return;
    return refs?.[i]?.[j]?.change?.(
      data,
      new InputEvent('input', {
        bubbles: true,
        cancelable: false,
        data,
        inputType: 'insertText',
      }),
    );
  };

  const onKeydown = (e: KeyboardEvent, i: number, j: number) => {
    if (ArrowPrefix.test(e.key)) return arrow(e, i, j);

    if (e.key !== 'Backspace') return;
    if (!j && !i) return;
    if (values?.[i]?.[j]?.length) return;

    e.preventDefault();

    const _group = !j ? i - 1 : i;
    const _count = !j ? count - 1 : j - 1;

    refs?.[_group]?.[_count]?.clear?.(
      undefined,
      new InputEvent('input', {
        bubbles: true,
        cancelable: false,
        data: '',
        inputType: 'deleteContentBackward',
      }),
    );
  };

  const clear = async () => {
    await Promise.all(refs?.map(group => group?.map(input => input?.clear?.())));
    focus(0, 0, { last: true });
  };

  const paste = (data: string, i = 0, j = 0) => {
    let _group = i;
    let _count = j;

    if (!data?.length) return;

    data?.split('').forEach((char, index) => {
      if (char === separator && index % count === 0) return;
      if (_group >= groups) return;

      refs?.[_group]?.[_count]?.change?.(
        char,
        new InputEvent('input', {
          bubbles: true,
          cancelable: false,
          data: char,
          inputType: 'insertText',
        }),
      );
      _group = _count < count - 1 ? _group : _group + 1;
      _count = _count < count - 1 ? _count + 1 : 0;
    });
  };

  const onPaste = (e: ClipboardEvent, i: number, j: number) => {
    const data = e.clipboardData?.getData('text');
    if (!data?.length) return;
    e.preventDefault();
    paste(data, i, j);
  };

  const _separator = $derived.by(() => {
    if (typeof separator === 'string') return separator;
    return separator ? '-' : '';
  });

  const mergedValues = $derived(values.map(group => group.join('')).join(_separator));
  doubleBind({
    outer: () => value,
    input: () => {
      clear();
      paste(value);
    },
    inner: () => mergedValues,
    output: () => {
      value = mergedValues;

      if (validateOnInput) validate();

      const event: SvelteEvent<InputEvent, any> = new InputEvent('input', {
        bubbles: true,
        cancelable: false,
        data: value,
        inputType: 'insertText',
      });
      oninput?.(event);
    },
  });

  const mergedTouched = $derived(touches.some(group => group.some(Boolean)));
  doubleBind({
    outer: () => touched,
    input: () => {
      if (touched) return;
      refs?.forEach(group => group?.forEach(input => input?.mark?.({ touched: false })));
    },
    inner: () => mergedTouched,
    output: () => {
      touched = mergedTouched;
    },
  });

  const mergedDirty = $derived(dirtiness.some(group => group.some(Boolean)));
  doubleBind({
    outer: () => dirty,
    input: () => {
      if (dirty) return;
      refs?.forEach(group => group?.forEach(input => input?.mark?.({ dirty: false })));
    },
    inner: () => mergedDirty,
    output: () => {
      if (!dirtyOnInput) return;
      dirty = mergedDirty;
    },
  });

  let changed = value;
  let timeout: ReturnType<typeof setTimeout>;
  const onFocusIn: FocusEventHandler<HTMLDivElement> = e => {
    clearTimeout(timeout);
    focused = true;
    containerProps?.onfocusin?.(e);
  };
  const onFocusOut: FocusEventHandler<HTMLDivElement> = e => {
    timeout = setTimeout(() => {
      focused = false;
      containerProps?.onfocusout?.(e);

      if (changed === value) return;
      validate();
      dirty = mergedDirty;

      const event: SvelteEvent<InputEvent, any> = new InputEvent('change', {
        bubbles: true,
        cancelable: false,
        data: value,
        inputType: 'insertText',
      });
      onchange?.(event);
      changed = value;
    }, 0);
  };

  const onInvalid: EventHandler<Event, HTMLInputElement> = e => {
    valid = false;
    validationMessage = ref?.validationMessage;
    e.preventDefault();
    oninvalid?.(e);
  };

  const errorMessage = $derived.by(() => {
    if (valid || valid === undefined) return;
    if (error) return error;
    if (!validation) return;
    return error ?? validationMessage;
  });

  const onMouseEnter: MouseEventHandler<HTMLDivElement> = e => {
    hovered = true;
    containerProps?.onmouseenter?.(e);
  };
  const onMouseLeave: MouseEventHandler<HTMLDivElement> = e => {
    hovered = false;
    containerProps?.onmouseleave?.(e);
  };

  const affix = $derived(clearable || loading !== undefined || validation);
  const hasValue = $derived(value !== undefined && (typeof value === 'string' ? !!value.length : value !== null));
  const close = $derived(clearable && (focused || hovered) && hasValue && !rest.disabled && !rest.readonly);
  const showMessage = $derived(message || errorMessage || error || validation);
  const messageId = $derived(showMessage ? (messageProps?.id ?? `neo-input-message-${crypto.randomUUID()}`) : undefined);

  const elevation = $derived(rest?.elevation ?? DefaultShadowElevation);

  const context = $derived<NeoPinContext>({
    // Ref
    ref,

    // State
    initial,
    value,
    touched,
    dirty,
    valid,
    disabled: rest.disabled,
    readonly: rest.readonly,

    // Methods
    clear,
  });

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));

  const useFn = $derived(toAction(use));
  const useProps = $derived(toActionProps(use));
</script>

{#snippet group()}
  <svelte:element
    this={containerTag}
    role="none"
    class:neo-pin-container={true}
    class:neo-deep={elevation < -3}
    class:neo-raised={elevation > 3}
    class:neo-pressed={rest.pressed}
    class:neo-after={after}
    data-touched={touched}
    data-dirty={dirty}
    data-valid={valid}
    use:useFn={useProps}
    out:outFn={outProps}
    in:inFn={inProps}
    {...containerProps}
    onfocusin={onFocusIn}
    onfocusout={onFocusOut}
    onmouseenter={onMouseEnter}
    onmouseleave={onMouseLeave}
  >
    {#if before}
      <svelte:element this={beforeTag} class:neo-pin-before={true} class:neo-vertical={vertical} {...beforeProps}>
        {@render before(context)}
      </svelte:element>
    {/if}
    <div class="neo-pin-group-wrapper" class:neo-vertical={vertical}>
      <input
        bind:this={ref}
        {id}
        aria-hidden="true"
        aria-invalid={valid === undefined ? undefined : !valid}
        aria-describedby={messageId}
        hidden
        type="text"
        tabindex="-1"
        {step}
        {min}
        {max}
        {required}
        {minlength}
        {maxlength}
        {pattern}
        bind:value
        oninvalid={onInvalid}
      />
      {#each Array(Number(groups)) as _, i}
        <div class="neo-pin-group">
          {#each Array(Number(count)) as __, j}
            <NeoInput
              bind:ref={refs[i][j]}
              bind:value={values[i][j]}
              bind:dirty={dirtiness[i][j]}
              bind:touched={touches[i][j]}
              size={1}
              maxlength={1}
              minlength={1}
              {step}
              {min}
              {max}
              type="text"
              {...rest}
              oninput={() => onInput(i, j)}
              onkeydown={e => onKeydown(e, i, j)}
              onpaste={e => onPaste(e, i, j)}
            />
          {/each}
        </div>
        {#if i < groups - 1}
          <div class="neo-pin-separator">
            {#if icon}
              {@render icon()}
            {:else if typeof separator === 'string'}
              {separator}
            {:else}
              <IconMinus />
            {/if}
          </div>
        {/if}
      {/each}
    </div>
    {#if affix || after}
      <svelte:element this={afterTag} class:neo-pin-after={true} class:neo-vertical={vertical} {...afterProps}>
        <!--  Affix (loafing, clear, placeholder) -->
        {#if affix}
          <NeoAffix
            {loading}
            {close}
            valid={validation ? valid : undefined}
            disabled={rest.disabled}
            skeleton={rest.skeleton}
            closeProps={{ onclick: () => clear() }}
            onclick={() => focus(0, 0, { last: true })}
          />
        {/if}
        {@render after?.(context)}
      </svelte:element>
    {/if}
  </svelte:element>
{/snippet}

{#snippet validationGroup()}
  {#if showMessage}
    <NeoValidation
      tag={wrapperTag}
      error={errorMessage}
      rounded={rest.rounded}
      {context}
      {message}
      {messageId}
      {messageTag}
      {messageProps}
      in={inAction}
      out={outAction}
      transition={transitionAction}
      {...wrapperProps}
    >
      {@render group()}
    </NeoValidation>
  {:else}
    {@render group()}
  {/if}
{/snippet}

{#snippet labelGroup()}
  {#if typeof label === 'string'}
    {label}
  {:else if label}
    {@render label(context)}
  {/if}
{/snippet}

{#if label}
  <NeoLabel
    {id}
    bind:ref={labelRef}
    {required}
    label={labelGroup}
    {...labelProps}
    onclick={e => {
      focus(0, 0, { last: true });
      labelProps?.onclick?.(e);
    }}
  >
    {@render validationGroup()}
  </NeoLabel>
{:else}
  {@render validationGroup()}
{/if}

<style lang="scss">
  .neo-pin-container,
  .neo-pin-group-wrapper,
  .neo-pin-group,
  .neo-pin-separator,
  .neo-pin-before,
  .neo-pin-after {
    display: inline-flex;
    align-items: center;
  }

  .neo-pin-group-wrapper,
  .neo-pin-group {
    flex-wrap: wrap;
    justify-content: center;
  }

  .neo-pin-separator {
    justify-content: center;
    min-width: 2rem;
  }

  .neo-pin-spacer {
    flex: 1 1 auto;
  }

  .neo-pin-before,
  .neo-pin-after {
    align-self: stretch;
    justify-content: space-between;
    margin: var(--neo-shadow-margin);
  }

  .neo-vertical {
    flex-direction: column;
  }

  .neo-pin-container {
    margin: var(--neo-shadow-margin, 0.625rem);

    :global(.neo-input) {
      width: 2.125rem;
      padding: 0.5rem;
      text-align: center;
    }

    :global(.neo-input[type='number']) {
      /* Hide arrows -Firefox */
      appearance: textfield;

      /* Hide arrows - Chrome, Safari, Edge, Opera */
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        margin: 0;
        appearance: none;
      }
    }

    :global(.neo-input-group.neo-rounded .neo-input) {
      width: 2.25rem;
      padding: 0.5rem;
    }

    :global(.neo-input[type='password']:not(:placeholder-shown)) {
      -webkit-text-stroke-width: 0.1em;
      letter-spacing: 0;
    }

    .neo-pin-after {
      --neo-affix-padding: 0.75rem 0;

      :global(.neo-password-toggle) {
        min-width: 2.25rem;
        min-height: 2.25rem;
        margin: 0.125rem 0;
      }
    }

    &.neo-raised .neo-pin-after,
    &.neo-deep.neo-pressed .neo-pin-after {
      --neo-affix-padding: var(--neo-shadow-margin-lg, 1.125rem) 0;

      :global(.neo-password-toggle) {
        margin: 0.625rem 0;
      }
    }

    &.neo-deep {
      :global(.neo-input) {
        aspect-ratio: 1;
      }
    }

    &.neo-after:not(.neo-vertical) .neo-pin-after {
      gap: 1.125rem;
    }

    &.neo-raised.neo-after:not(.neo-vertical) .neo-pin-after {
      gap: 1.5rem;
    }
  }
</style>
