<script lang="ts">
  import type { EventHandler, FocusEventHandler, MouseEventHandler } from 'svelte/elements';
  import type { NeoInputHTMLElement } from '~/inputs/neo-input.model.js';

  import type { NeoPinContext, NeoPinProps } from '~/inputs/neo-pin.model.js';

  import IconMinus from '~/icons/IconMinus.svelte';
  import NeoAffix from '~/inputs/NeoAffix.svelte';
  import NeoInput from '~/inputs/NeoInput.svelte';
  import NeoValidation from '~/inputs/NeoValidation.svelte';
  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { doubleBind } from '~/utils/utils.svelte.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    label, // Todo
    before,
    after,
    message,
    error,
    icon,

    // State
    ref = $bindable(),
    value = $bindable(''),
    valid = $bindable(undefined),
    dirty = $bindable(false),
    touched = $bindable(false),
    password, // TODO password
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
    labelRef, // TODO
    labelProps, // TODO
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
        const _j = group.findIndex(val => !val.length);
        if (_j === -1) return false;
        _group = _i;
        _count = _j;
        return true;
      });
      console.info(_group, _count);
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
    if (/^Arrow/.test(e.key)) return arrow(e, i, j);

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

  const clear = () => refs?.forEach(group => group?.forEach(input => input?.clear?.()));

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

      const event: InputEvent & { currentTarget: any } = new InputEvent('input', {
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
  let focused = $state(false);
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

      const event: InputEvent & { currentTarget: any } = new InputEvent('change', {
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

  const show = $state(false);
  const inputType = $derived.by(() => {
    if (show) return 'text';
    return password ? 'password' : 'text';
  });

  const errorMessage = $derived.by(() => {
    if (valid || valid === undefined) return;
    if (error) return error;
    if (!validation) return;
    return error ?? validationMessage;
  });

  let hovered = $state(false);
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
        aria-hidden="true"
        hidden
        type={inputType}
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
              {...rest}
              type={inputType}
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
            closeProps={{ onclick: () => clear() }}
            onclick={() => focus(0, 0, { last: true })}
          />
        {/if}
        {@render after?.(context)}
      </svelte:element>
    {/if}
  </svelte:element>
{/snippet}

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

  .neo-pin-container {
    margin: var(--neo-shadow-margin, 0.625rem);

    :global(.neo-input) {
      width: 2rem;
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

  .neo-pin-after {
    --neo-affix-padding: 0.75rem 0.75rem 0.75rem 0;
  }

  .neo-vertical {
    flex-direction: column;

    .neo-pin-affix {
      margin-right: 0;
    }
  }
</style>
