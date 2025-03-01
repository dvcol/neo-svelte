<script lang="ts">
  import { debounced } from '@dvcol/svelte-utils/debounce';
  import { fade } from 'svelte/transition';

  import type { NeoAffixProps } from '~/inputs/common/neo-affix.model.js';

  import IconAlert from '~/icons/IconAlert.svelte';
  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';
  import IconClear from '~/icons/IconClear.svelte';
  import IconConfirm from '~/icons/IconConfirm.svelte';
  import { toTransition, toTransitionProps } from '~/utils/action.utils.js';
  import { quickDurationProps } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // Snippets
    reset,
    loader,
    validation,

    // States
    tag = 'span',
    ref = $bindable(),
    loading,
    close,
    valid,
    skeleton = false,
    disabled,
    readonly,

    // Styles
    size,

    // Transition
    in: inAction,
    out: outAction,
    transition: transitionAction,

    // Other props
    closeProps,
    ...rest
  }: NeoAffixProps = $props();
  /* eslint-enable prefer-const */

  const clear = $derived.by(debounced(() => close && !disabled && !readonly, 100));

  const inFn = $derived(toTransition(inAction ?? transitionAction));
  const inProps = $derived(toTransitionProps(inAction ?? transitionAction));
  const outFn = $derived(toTransition(outAction ?? transitionAction));
  const outProps = $derived(toTransitionProps(outAction ?? transitionAction));
</script>

<svelte:element
  this={tag}
  bind:this={ref}
  class:neo-affix-container={true}
  class:neo-skeleton={skeleton}
  style:--neo-affix-size={size}
  in:inFn={inProps}
  out:outFn={outProps}
  {...rest}
>
  {#if loading}
    <span class="neo-affix-loading" transition:fade={quickDurationProps}>
      {#if loader}
        {@render loader({ size })}
      {:else}
        <IconCircleLoading />
      {/if}
    </span>
  {:else if clear}
    <button type="button" {disabled} class:neo-affix-clear={true} aria-label="clear" transition:fade={quickDurationProps} {...closeProps}>
      {#if reset}
        {@render reset({ size })}
      {:else}
        <IconClear />
      {/if}
    </button>
  {:else}
    <span class="neo-affix-validation" data-valid={valid} transition:fade={quickDurationProps}>
      {#if valid !== undefined}
        {#if validation}
          {@render validation({ size, valid })}
        {:else if valid}
          <IconConfirm />
        {:else}
          <IconAlert />
        {/if}
      {/if}
    </span>
  {/if}
</svelte:element>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-affix-validation,
  .neo-affix-loading,
  .neo-affix-clear {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: var(--neo-affix-size, 1.25rem);
    height: var(--neo-affix-size, 1.25rem);
    font: inherit;
    text-decoration: none;
    outline: none;

    :global(> svg) {
      width: 100%;
      height: 100%;
      margin: -0.05rem;
      padding: 0.05rem;
    }
  }

  .neo-affix-container {
    display: inline-grid;
    grid-template-areas: 'affix';
    align-items: center;
    box-sizing: border-box;
    min-height: max-content;
    padding: var(--neo-affix-padding, 0.75rem);
    border: none;

    > * {
      grid-area: affix;
    }

    .neo-affix-validation {
      display: inline-flex;
      align-items: center;

      &[data-valid='true'] {
        color: var(--neo-affix-validation-color-success, var(--neo-color-success));
      }

      &[data-valid='false'] {
        color: var(--neo-affix-validation-color-error, var(--neo-color-error));
      }
    }

    .neo-affix-clear {
      margin: 0;
      padding: 0;
      color: var(--neo-affix-clear-color, inherit);
      background-color: var(--neo-background-color-secondary);
      border: none;
      border-radius: 50%;
      aspect-ratio: 1;
      cursor: pointer;
      transition:
        opacity 0.2s ease-in,
        color 0.3s ease,
        background-color 0.3s ease;

      &:focus-visible {
        outline: var(--neo-border-width, 1px) solid var(--neo-border-color-focused);
      }

      &:hover {
        color: var(--neo-close-color-hover, rgb(255 0 0 / 75%));
        background-color: var(--neo-close-bg-color-hover, rgb(255 0 0 / 7%));
      }

      &:active {
        color: var(--neo-affix-active-color, var(--neo-text-color-hover-active));
        scale: 0.9;
      }

      &:disabled {
        color: var(--neo-text-color-disabled);
        cursor: not-allowed;
        scale: 1;
      }
    }

    &.neo-skeleton > * {
      border-radius: 50%;

      @include mixin.skeleton;
    }
  }
</style>
