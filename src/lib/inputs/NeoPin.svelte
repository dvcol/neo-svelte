<script lang="ts">
  import { type Snippet } from 'svelte';

  import type { NeoInputHTMLElement, NeoInputProps } from '~/inputs/neo-input.model.js';

  import IconMinus from '~/icons/IconMinus.svelte';
  import NeoInput from '~/inputs/NeoInput.svelte';
  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { doubleBind } from '~/utils/utils.svelte.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    label, // Todo
    before, // Todo
    after, // Todo
    message, // Todo
    error, // Todo
    icon,

    // State
    ref = $bindable(), // Todo
    value = $bindable(''), // Todo override inner value
    valid = $bindable(undefined), // Todo Validation
    dirty = $bindable(false), // Todo Validation
    touched = $bindable(false), // Todo Validation
    loading,
    clearable, // TODO extra button
    dirtyOnInput, // Todo Validation
    validateOnInput, // Todo Validation
    position,

    // Validation
    step = 1,
    min = 0,
    max = 9,
    required,
    pattern,
    minlength = 6,
    maxlength,

    // Styles
    groups = 1,
    count = 4,
    separator,

    validation, // Todo Validation
    floating, // TODO label

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Actions
    use,

    // Events // Todo
    oninput,
    onfocus,
    onblur,
    onmark,
    onclear,
    onchange,
    oninvalid,

    // Other props
    labelRef,
    labelProps,
    afterProps,
    afterTag,
    beforeProps,
    beforeRef,
    beforeTag,
    containerProps,
    containerTag,
    wrapperProps,
    wrapperTag,
    messageProps,
    messageTag,
    ...rest
  }: { groups?: number; count?: number; separator?: boolean | string; icon?: Snippet } & NeoInputProps = $props();
  /* eslint-enable prefer-const */

  const refs = $state<NeoInputHTMLElement[][]>(Array(Number(groups)).fill([]));
  const values = $state<string[][]>(Array(Number(groups)).fill(Array(Number(count)).fill('')));
  const touches = $state<boolean[][]>(Array(Number(groups)).fill(Array(Number(count)).fill(false)));
  const dirtiness = $state<boolean[][]>(Array(Number(groups)).fill(Array(Number(count)).fill(false)));

  // TODO - clearable
  // TODO - loading
  // TODO - copy

  // TODO - password

  const focus = (i: number, j: number, options: { previous?: boolean; select?: boolean } = {}) => {
    let _group: number;
    let _count: number;

    if (options?.previous) {
      _group = j ? i : i - 1;
      _count = j ? j - 1 : count - 1;
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
      dirty = mergedDirty;
    },
  });

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));

  const useFn = $derived(toAction(use));
  const useProps = $derived(toActionProps(use));
</script>

<div
  class="neo-pin-container"
  data-touched={touched}
  data-dirty={dirty}
  data-valid={valid}
  use:useFn={useProps}
  out:outFn={outProps}
  in:inFn={inProps}
>
  <input aria-hidden="true" type="hidden" tabindex="-1" {step} {min} {max} {required} {minlength} {maxlength} {pattern} bind:value />
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
          type="text"
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

<style lang="scss">
  .neo-pin-container,
  .neo-pin-group,
  .neo-pin-separator {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }

  .neo-pin-container {
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

  .neo-pin-separator {
    min-width: 2rem;
  }
</style>
