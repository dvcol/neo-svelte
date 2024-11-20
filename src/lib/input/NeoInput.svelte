<script lang="ts">
  import { fade } from 'svelte/transition';

  import type { NeoInputContext, NeoInputMethods, NeoInputProps, NeoInputState } from '~/input/neo-input.model.js';

  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';
  import IconClear from '~/icons/IconClear.svelte';
  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { computeHoverShadowElevation, computeShadowElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    label,
    prefix,
    suffix,

    // States
    id = `neo-input-${crypto.randomUUID()}`,
    ref = $bindable(),
    value = $bindable(''),
    valid = $bindable(undefined),
    dirty = $bindable(false),
    touched = $bindable(false),
    loading,
    clearable,
    dirtyOnInput,
    validateOnInput,

    // Styles
    elevation = 3,
    hover = -1,
    borderless,
    rounded,
    glass,
    start,
    floating,
    skeleton,

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Actions
    use,

    // Events
    oninput,
    onfocus,
    onblur,
    onmark,
    onclear,
    onchange,

    // Other props
    containerProps,
    containerTag = 'div',
    suffixProps,
    suffixTag = suffixProps?.onclick ? 'button' : 'span',
    prefixProps,
    prefixTag = prefixProps?.onclick ? 'button' : 'span',
    ...rest
  }: NeoInputProps = $props();
  /* eslint-enable prefer-const */

  let initial = $state(value);

  /**
   * Change the state of the input
   * @param state
   */
  export const mark: NeoInputMethods['mark'] = (state: NeoInputState) => {
    if (state.touched !== undefined) touched = state.touched;
    if (state.valid !== undefined) valid = state.valid;
    if (state.dirty === undefined) return onmark?.({ touched, dirty, valid });
    dirty = state.dirty;
    if (!dirty) initial = value;
    return onmark?.({ touched, dirty, valid });
  };

  /**
   * Clear the input state
   */
  export const clear: NeoInputMethods['clear'] = (state?: NeoInputState) => {
    value = '';
    ref?.focus();
    if (!state) return onclear?.({ touched, dirty, valid });
    initial = value;
    touched = false;
    dirty = false;
    mark({ touched: false, dirty: false, ...state });
    return onclear?.({ touched, dirty, valid });
  };

  const boxShadow = $derived.by(() => computeShadowElevation(elevation, glass));
  const hoverShadow = $derived.by(() => computeHoverShadowElevation(elevation, hover, glass) ?? boxShadow);

  const hoverFlat = $derived(boxShadow.endsWith('flat') && !hoverShadow.endsWith('flat'));
  const flatHover = $derived(hoverShadow.endsWith('flat') && !boxShadow.endsWith('flat'));

  let hovered = $state(false);
  const onMouseEnter = (e: MouseEvent) => {
    hovered = true;
    containerProps?.onmouseenter?.(e);
  };

  const onMouseLeave = (e: MouseEvent) => {
    hovered = false;
    containerProps?.onmouseleave?.(e);
  };

  let focused = $state(false);
  const onFocus = (e: FocusEvent) => {
    focused = true;
    touched = true;
    onfocus?.(e);
  };

  const onBlur = (e: FocusEvent) => {
    focused = false;
    onblur?.(e);
  };

  const onInput = (e: InputEvent) => {
    if (dirtyOnInput) dirty = e.target?.value !== initial;
    if (validateOnInput) valid = !!e.target?.validity?.valid;

    oninput?.(e);
  };

  const onChange = (e: InputEvent) => {
    dirty = e.target?.value !== initial;
    valid = !!e.target?.validity?.valid;
    onchange?.(e);
  };

  const affix = $derived(clearable || loading !== undefined);
  const close = $derived(clearable && (focused || hovered) && value?.length && !rest?.disabled && !rest?.readonly);

  const context: NeoInputContext = $derived({
    // Ref
    ref,

    // Methods
    mark,
    clear,

    // State
    touched,
    dirty,
    valid,

    // Styles
    elevation,
    hover,
    borderless,
    rounded,
    glass,
    start,
    skeleton,
  });

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));

  const useFn = $derived(toAction(use));
  const useProps = $derived(toActionProps(use));
</script>

{#snippet before()}
  {#if prefix}
    <svelte:element this={prefixTag} class:neo-input-prefix={true} disabled={rest?.disabled} {...prefixProps}>
      {@render prefix(context)}
    </svelte:element>
  {/if}
{/snippet}

{#snippet after()}
  {#if affix}
    <span class="neo-input-affix" class:suffix>
      {#if loading}
        <span out:fade={{ duration: 200 }}>
          <IconCircleLoading width="var(--neo-line-height-sm, 1.25rem)" height="var(--neo-line-height-sm, 1.25rem)" />
        </span>
      {:else if close}
        <button class="neo-input-clear" in:fade out:fade={{ duration: 200 }} onclick={() => clear()}>
          <IconClear class="icon-clear" frozen />
        </button>
      {:else}
        <span in:fade={{ delay: 200 }}>
          <!--  placeholder   -->
        </span>
      {/if}
    </span>
  {/if}
  {#if suffix}
    <svelte:element this={suffixTag} class:neo-input-suffix={true} disabled={rest?.disabled} {...suffixProps}>
      {@render suffix(context)}
    </svelte:element>
  {/if}
{/snippet}

{#snippet input()}
  <input
    {id}
    bind:this={ref}
    bind:value
    class:neo-input={true}
    class:suffix={suffix || affix}
    class:prefix
    onblur={onBlur}
    onfocus={onFocus}
    oninput={onInput}
    onchange={onChange}
    {...rest}
  />
{/snippet}

<svelte:element
  this={containerTag}
  role="none"
  class:neo-input-group={true}
  class:borderless
  class:rounded
  class:glass
  class:hover
  class:start
  class:skeleton
  class:disabled={rest?.disabled}
  class:raised={elevation > 3 || hover > 3}
  class:inset={elevation < -3 || hover < -3}
  class:flat={!elevation}
  class:hover-flat={hoverFlat}
  class:flat-hover={flatHover}
  data-touched={touched}
  data-dirty={dirty}
  data-valid={valid}
  style:--neo-input-box-shadow={boxShadow}
  style:--neo-input-hover-shadow={hoverShadow}
  use:useFn={useProps}
  out:outFn={outProps}
  in:inFn={inProps}
  onmouseenter={onMouseEnter}
  onmouseleave={onMouseLeave}
  {...containerProps}
>
  {@render before()}
  {#if label}
    <div class="neo-input-label-container" class:placeholder={floating && !focused && !value?.length}>
      <label for={id} class="neo-input-label" class:prefix class:rounded>
        {#if typeof label === 'string'}
          {label}
        {:else}
          {@render label()}
        {/if}
      </label>
      <div class="neo-input-label-input">{@render input()}</div>
    </div>
  {:else}
    {@render input()}
  {/if}
  {@render after()}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-input-label-container {
    position: relative;
    flex: 1 1 auto;
    padding-top: calc(0.5rem + var(--neo-font-size-xs));

    .neo-input-label {
      position: absolute;
      top: 0.3rem;
      left: 0;
      width: 100%;
      padding: 0.1rem 0.75rem;
      overflow: hidden;
      font-size: var(--neo-font-size-xs);
      white-space: nowrap;
      text-overflow: ellipsis;
      transition:
        color 0.3s ease,
        font-size 0.3s ease,
        top 0.3s ease,
        left 0.3s ease;
      pointer-events: unset;

      &.prefix {
        padding-left: 0;
      }
    }

    &.placeholder {
      .neo-input-label {
        top: calc(50% - 0.1rem - var(--neo-font-size-xs));
        color: var(--neo-input-placeholder-color, var(--neo-text-color-disabled));
        font-size: var(--neo-font-size);
        pointer-events: none;
      }

      ::placeholder {
        opacity: 0;
      }
    }
  }

  .neo-input-group,
  .neo-input,
  .neo-input-clear,
  .neo-input-affix,
  .neo-input-prefix,
  .neo-input-suffix {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    text-decoration: none;
    outline: none;
    transition:
      color 0.3s ease,
      margin 0.3s ease,
      padding 0.3s ease,
      background-color 0.3s ease,
      border-color 0.3s ease,
      border-radius 0.3s ease,
      box-shadow 0.3s ease-out;
  }

  .neo-input {
    flex: 1 1 auto;
    height: 100%;
    padding: 0.75rem;
    color: inherit;
    text-overflow: ellipsis;
    background-color: transparent;
    border: none;
    border-radius: var(--neo-input-border-radius, var(--neo-border-radius));
    outline: none;

    &-prefix {
      color: var(--neo-input-prefix-color, inherit);
      background-color: var(--neo-input-prefix-bg-color, transparent);
      border: none;
      border-right: var(--neo-border-width, 1px) var(--neo-input-prefix-border-color, transparent) solid;
      border-radius: var(--neo-input-border-radius, var(--neo-border-radius)) 0 0 var(--neo-input-border-radius, var(--neo-border-radius));
    }

    &.prefix {
      margin-left: -0.85rem;
    }

    &.suffix {
      margin-right: -0.85rem;
    }

    &-suffix {
      color: var(--neo-input-suffix-color, inherit);
      background-color: var(--neo-input-suffix-bg-color, transparent);
      border: none;
      border-left: var(--neo-border-width, 1px) var(--neo-input-suffix-border-color, transparent) solid;
      border-radius: 0 var(--neo-input-border-radius, var(--neo-border-radius)) var(--neo-input-border-radius, var(--neo-border-radius)) 0;
    }

    &-affix {
      width: calc(var(--neo-line-height) + 1rem);
      height: calc(var(--neo-line-height) + 1rem);
      padding: 0.75rem;
      border: none;
      border-left: var(--neo-border-width, 1px) var(--neo-input-suffix-border-color, transparent) solid;

      &.suffix {
        width: calc(var(--neo-line-height) + 0.5rem);
        margin-right: -0.15rem;
        padding-right: 0;
      }
    }

    &::placeholder {
      color: var(--neo-input-placeholder-color, var(--neo-text-color-disabled));
      transition: opacity 0.3s ease;
    }

    &:read-only {
      cursor: unset;
    }

    &:disabled {
      color: var(--neo-text-color-disabled);
      cursor: not-allowed;
    }
  }

  %neo-input-button {
    cursor: pointer;

    &:focus-visible {
      color: var(--neo-input-focus-color, var(--neo-text-color-focused));
    }

    &:hover {
      color: var(--neo-input-hover-color, var(--neo-text-color-hover));
    }

    &:active {
      color: var(--neo-input-active-color, var(--neo-text-color-hover-active));
      scale: 0.9;
    }

    &:disabled {
      color: var(--neo-text-color-disabled);
      cursor: not-allowed;
      scale: 1;
    }
  }

  .neo-input-clear {
    @extend %neo-input-button;

    color: var(--neo-input-clear-color, inherit);
    background-color: var(--neo-background-color-darker);
    border: none;
    border-radius: 50%;

    &:focus-visible {
      color: var(--neo-close-color-focused, rgb(255 0 0 / 75%));
      background-color: var(--neo-close-bg-color-focused, rgb(255 0 0 / 5%));
    }

    &:hover {
      color: var(--neo-close-color, rgb(255 0 0 / 75%));
      background-color: var(--neo-close-bg-color-focused, rgb(255 0 0 / 5%));
    }

    &:disabled {
      color: var(--neo-text-color-disabled);
      cursor: not-allowed;
    }
  }

  .neo-input-prefix,
  .neo-input-suffix {
    padding: 0.75rem;

    &:is(button, a) {
      @extend %neo-input-button;
    }
  }

  .neo-input-group {
    margin: var(--neo-shadow-margin, 0.6rem);
    color: var(--neo-input-text-color, inherit);
    background-color: var(--neo-input-bg-color, var(--neo-background-color));
    border: var(--neo-border-width, 1px) var(--neo-input-border-color, transparent) solid;
    border-radius: var(--neo-input-border-radius, var(--neo-border-radius));
    box-shadow: var(--neo-input-box-shadow, var(--neo-box-shadow-flat));

    &.raised {
      margin: var(--neo-shadow-margin-lg, 1.125rem);
    }

    &.inset {
      padding: var(--neo-shadow-padding, 0.6rem);
    }

    &.hover.flat-hover:hover,
    &.hover.flat-hover:focus-within,
    &.flat:not(.borderless, .hover-flat:hover, .hover-flat:focus-within) {
      border-color: var(--neo-card-border-color, var(--neo-border-color));
    }

    &:focus-within,
    &.hover:hover {
      box-shadow: var(--neo-input-hover-shadow, var(--neo-box-shadow-flat));
    }

    &.rounded {
      border-radius: var(--neo-border-radius-lg, 2rem);

      .neo-input-label-container {
        padding-left: 0.5rem;

        .neo-input-label {
          left: 0.5rem;

          &:not(.prefix) {
            left: 0.75rem;
          }
        }
      }

      .neo-input {
        padding: 0.75rem 1rem;
        border-radius: var(--neo-border-radius-lg, 2rem);

        &.prefix {
          margin-left: -1rem;
        }

        &-prefix {
          padding: 0.75rem 0.75rem 0.75rem 1rem;
        }

        &.suffix {
          margin-right: -1rem;
        }

        &-suffix {
          padding: 0.75rem 1rem 0.75rem 0.75rem;
        }

        &-affix:not(.suffix) {
          width: calc(var(--neo-line-height) + 1.25rem);
          padding-right: 0.75rem;
        }
      }
    }

    &.glass {
      --neo-skeleton-color: var(--neo-glass-skeleton-color);

      background-color: var(--neo-input-bg-color, var(--neo-glass-background-color));
      border-color: var(
        --neo-input-border-color,
        var(--neo-glass-top-border-color) var(--neo-glass-right-border-color) var(--neo-glass-bottom-border-color) var(--neo-glass-left-border-color)
      );
      backdrop-filter: var(--neo-glass-blur, var(--neo-blur-4));
    }

    &.start {
      @starting-style {
        box-shadow: var(--neo-box-shadow-flat);

        &:not(.borderless) {
          border-color: var(--neo-input-border-color, var(--neo-border-color));
        }
      }
    }

    &.disabled {
      color: var(--neo-text-color-disabled);
      cursor: not-allowed;
    }

    &.skeleton {
      box-shadow: var(--neo-box-shadow-flat);
      pointer-events: none;

      @include mixin.skeleton;

      &.glass {
        --neo-skeleton-color: var(--neo-glass-skeleton-color);
      }
    }
  }
</style>
