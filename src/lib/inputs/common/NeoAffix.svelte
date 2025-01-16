<script lang="ts">
  import { debounced } from '@dvcol/svelte-utils';
  import { fade } from 'svelte/transition';

  import type { NeoAffixProps } from '~/inputs/common/neo-affix.model.js';

  import IconAlert from '~/icons/IconAlert.svelte';
  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';
  import IconClear from '~/icons/IconClear.svelte';
  import IconConfirm from '~/icons/IconConfirm.svelte';
  import { leaveTransitionProps } from '~/utils/transition.utils.js';

  /* eslint-disable prefer-const -- necessary for binding checked */
  let {
    // States
    ref = $bindable(),
    loading,
    close,
    valid,
    skeleton,
    disabled,

    // Styles
    size = '1.25rem',

    // Other props
    closeProps,
    ...rest
  }: NeoAffixProps = $props();
  /* eslint-enable prefer-const */

  const leave = $derived(!loading && !close && valid === undefined ? undefined : leaveTransitionProps);
  const clear = $derived.by(debounced(() => close && !disabled, 100));
</script>

<span bind:this={ref} class:neo-affix-container={true} class:neo-skeleton={skeleton} style:--neo-affix-size={size} role="none" {...rest}>
  {#if loading}
    <span class="neo-affix-loading" out:fade={leave}>
      <IconCircleLoading {size} />
    </span>
  {:else if clear}
    <button {disabled} class:neo-affix-clear={true} aria-label="clear" in:fade out:fade={leave} {...closeProps}>
      <IconClear {size} />
    </button>
  {:else}
    <span class="neo-affix-validation" data-valid={valid} in:fade={leave}>
      {#if valid !== undefined}
        {#if valid}
          <IconConfirm {size} />
        {:else}
          <IconAlert {size} />
        {/if}
      {/if}
    </span>
  {/if}
</span>

<style lang="scss">
  @use 'src/lib/styles/mixin' as mixin;

  .neo-affix-validation,
  .neo-affix-loading,
  .neo-affix-clear {
    display: inline-flex;
    box-sizing: border-box;
    width: var(--neo-affix-size, 1.25rem);
    height: var(--neo-affix-size, 1.25rem);
    font: inherit;
    text-decoration: none;
    outline: none;
  }

  .neo-affix-container {
    display: inline-grid;
    grid-template-areas: 'affix';
    align-items: center;
    box-sizing: border-box;
    min-width: max-content;
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
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 0;
      color: var(--neo-affix-clear-color, inherit);
      background-color: var(--neo-background-color-darker);
      border: none;
      border-radius: 50%;
      aspect-ratio: 1;
      cursor: pointer;
      transition:
        opacity 0.2s ease-in,
        color 0.3s ease,
        background-color 0.3s ease;

      :global(svg) {
        width: 100%;
        height: 100%;
        margin: -0.05rem;
        padding: 0.05rem;
      }

      &:focus-visible {
        color: var(--neo-close-color-focused, rgb(255 0 0 / 50%));
        background-color: var(--neo-close-bg-color-focused, rgb(255 0 0 / 5%));
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
