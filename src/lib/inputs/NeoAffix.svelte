<script lang="ts">
  import { fade } from 'svelte/transition';

  import type { NeoAffixProps } from '~/inputs/neo-affix.model.js';

  import IconAlert from '~/icons/IconAlert.svelte';
  import IconCircleLoading from '~/icons/IconCircleLoading.svelte';
  import IconClear from '~/icons/IconClear.svelte';
  import IconConfirm from '~/icons/IconConfirm.svelte';
  import { leaveDefaultTransition } from '~/utils/transition.utils.js';

  const { loading, close, valid, closeProps, ...rest }: NeoAffixProps = $props();
</script>

<span class="neo-affix-container" role="none" {...rest}>
  {#if loading}
    <span class="neo-affix-loading" out:fade={leaveDefaultTransition}>
      <IconCircleLoading width="1.25rem" height="1.25rem" />
    </span>
  {:else if close}
    <button class="neo-affix-clear" aria-label="clear" in:fade out:fade={leaveDefaultTransition} {...closeProps}>
      <IconClear />
    </button>
  {:else}
    <span class="neo-affix-validation" data-valid={valid} in:fade={leaveDefaultTransition}>
      {#if valid !== undefined}
        {#if valid}
          <IconAlert width="1.25rem" height="1.25rem" />
        {:else}
          <IconConfirm width="1.25rem" height="1.25rem" />
        {/if}
      {/if}
    </span>
  {/if}
</span>

<style lang="scss">
  .neo-affix-validation,
  .neo-affix-loading,
  .neo-affix-clear {
    display: inline-flex;
    box-sizing: border-box;
    width: 1.25rem;
    height: 1.25rem;
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

      :global(svg) {
        width: 100%;
        height: 100%;
        margin: 0.05rem;
      }

      &:focus-visible {
        color: var(--neo-close-color-focused, rgb(255 0 0 / 75%));
        background-color: var(--neo-close-bg-color-focused, rgb(255 0 0 / 5%));
      }

      &:hover {
        color: var(--neo-color-warning, rgb(255 0 0 / 75%));
        background-color: var(--neo-close-bg-color-focused, rgb(255 0 0 / 5%));
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
  }
</style>
