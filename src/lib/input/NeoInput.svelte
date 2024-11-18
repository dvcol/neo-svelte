<script lang="ts">
  import type { NeoInputProps } from '~/input/neo-input.model.js';

  import { toAction, toActionProps, toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { computeHoverShadowElevation, computeShadowElevation } from '~/utils/shadow.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    label,
    prefix,
    suffix,

    // States
    tag = 'div',
    ref = $bindable(),
    value = $bindable(''),
    valid = $bindable(undefined),
    dirty = $bindable(false),
    dirtyOnChange,
    touched = $bindable(false),

    // Styles
    elevation = 2,
    hover = -1,
    rounded,
    glass,

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Actions
    use,

    // Events
    oninput,
    onfocus,
    onmark,
    onclear,

    // Other props
    containerProps,
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
  export const mark = (state: { touched?: boolean; dirty?: boolean; valid?: boolean }) => {
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
  export const clear = (resetState = false) => {
    value = '';
    if (!resetState) return onclear?.({ touched, dirty, valid });
    initial = value;
    touched = false;
    dirty = false;
    valid = undefined;
    return onclear?.({ touched, dirty, valid });
  };

  const boxShadow = $derived.by(() => computeShadowElevation(elevation, glass));
  const hoverShadow = $derived.by(() => computeHoverShadowElevation(elevation, hover, glass) ?? boxShadow);

  const onFocus = (e: FocusEvent) => {
    touched = true;
    onfocus?.(e);
  };

  const onInput = (e: InputEvent) => {
    if (dirtyOnChange) dirty = true;
    else dirty = e.target.value !== initial;

    oninput?.(e);
  };

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));

  const useFn = $derived(toAction(use));
  const useProps = $derived(toActionProps(use));
</script>

<svelte:element
  this={tag}
  class:neo-input-group={true}
  class:rounded
  class:glass
  class:hover
  data-touched={touched}
  data-dirty={dirty}
  data-valid={valid}
  style:--neo-input-box-shadow={boxShadow}
  style:--neo-input-hover-shadow={hoverShadow}
  use:useFn={useProps}
  out:outFn={outProps}
  in:inFn={inProps}
  {...containerProps}
>
  {#if prefix}
    <svelte:element this={prefixTag} class:neo-input-prefix={true} {...prefixProps}>
      {@render prefix()}
    </svelte:element>
  {/if}
  <input class:neo-input={true} class:suffix class:prefix bind:this={ref} bind:value onfocus={onFocus} oninput={onInput} {...rest} />
  {#if suffix}
    <svelte:element this={suffixTag} class:neo-input-suffix={true} {...suffixProps}>
      {@render suffix()}
    </svelte:element>
  {/if}
</svelte:element>

<style lang="scss">
  .neo-input-group,
  .neo-input,
  .neo-input-prefix,
  .neo-input-suffix {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    text-decoration: none;
    outline: none;
    transition:
      color 0.3s ease,
      padding 0.3s ease,
      background-color 0.3s ease,
      border-color 0.3s ease,
      border-radius 0.3s ease,
      box-shadow 0.3s ease-out;
  }

  .neo-input {
    height: 100%;
    padding: 0.5rem 0.75rem;
    color: inherit;
    background-color: transparent;
    border: none;
    border-radius: var(--neo-input-border-radius, var(--neo-border-radius));
    outline: none;

    &.suffix {
      padding-right: 0.25rem !important;
    }

    &.prefix {
      padding-left: 0.25rem !important;
    }

    &::placeholder {
      color: var(--neo-input-placeholder-color, var(--neo-text-color-disabled));
    }
  }

  .neo-input-prefix {
    padding: 0.5rem 0.25rem 0.5rem 0.5rem;
    color: var(--neo-input-prefix-color, inherit);
    background-color: var(--neo-input-prefix-bg-color, transparent);
    border-right: var(--neo-border-width, 1px) var(--neo-input-border-color, transparent) solid;
  }

  .neo-input-suffix {
    padding: 0.5rem 0.5rem 0.5rem 0.25rem;
    color: var(--neo-input-suffix-color, inherit);
    background-color: var(--neo-input-suffix-bg-color, transparent);
    border-left: var(--neo-border-width, 1px) var(--neo-input-border-color, transparent) solid;
  }

  .neo-input-prefix,
  .neo-input-suffix {
    height: 100%;
    border: none;

    &:is(button, a) {
      cursor: pointer;

      &:focus-visible {
        color: var(--neo-input-focus-color, var(--neo-text-color-focused));
      }

      &:hover {
        color: var(--neo-input-hover-color, var(--neo-text-color-hover));
      }
    }
  }

  .neo-input-group {
    margin: var(--neo-shadow-margin-lg, 1.5rem);
    color: var(--neo-input-text-color, inherit);
    background-color: var(--neo-input-bg-color, var(--neo-background-color));
    border: var(--neo-border-width, 1px) var(--neo-input-border-color, transparent) solid;
    border-radius: var(--neo-input-border-radius, var(--neo-border-radius));
    box-shadow: var(--neo-input-box-shadow, var(--neo-box-shadow-flat));

    &:focus-within,
    &.hover:hover {
      box-shadow: var(--neo-input-hover-shadow, var(--neo-box-shadow-flat));
    }

    &.rounded {
      border-radius: var(--neo-border-radius-lg, 2rem);

      .neo-input {
        padding: 0.5rem 1rem;
        border-radius: var(--neo-border-radius-lg, 2rem);

        &-prefix {
          padding: 0.5rem 0.25rem 0.5rem 0.6rem;
        }

        &-suffix {
          padding: 0.5rem 0.6rem 0.5rem 0.25rem;
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
  }
</style>
