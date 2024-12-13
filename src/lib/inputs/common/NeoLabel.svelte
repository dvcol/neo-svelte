<script lang="ts">
  /* eslint-disable prefer-const -- necessary for binding checked */
  import type { NeoLabelProps } from '~/inputs/common/neo-label.model.js';

  import { toAction, toActionProps } from '~/utils/action.utils.js';

  let {
    // Snippets
    children,
    label,

    // States
    ref = $bindable(),
    required,
    disabled,

    // Actions
    use,

    // Other props
    containerTag = 'div',
    containerProps,
    ...rest
  }: NeoLabelProps = $props();
  /* eslint-enable prefer-const */

  const useFn = $derived(toAction(use));
  const useProps = $derived(toActionProps(use));
</script>

<svelte:element this={containerTag} class:neo-label-container={true} {...containerProps}>
  <label bind:this={ref} class:neo-label={true} class:neo-disabled={disabled} class:neo-required={required} use:useFn={useProps} {...rest}>
    {#if typeof label === 'string'}
      {label}
    {:else}
      {@render label?.()}
    {/if}
  </label>
  {@render children?.()}
</svelte:element>

<style lang="scss">
  .neo-label-container {
    display: inline-flex;
    flex: 1 1 auto;
    flex-direction: column;

    .neo-label {
      display: inline-flex;
      align-items: center;
      box-sizing: border-box;
      max-width: var(--neo-label-max-width);
      margin: var(--neo-label-margin, var(--neo-shadow-margin, 0.625rem) var(--neo-shadow-margin, 0.625rem) 0);
      padding: var(--neo-label-padding, 0 0.75rem);
      overflow: hidden;
      color: var(--neo-label-color, inherit);
      text-wrap: stable;
      text-overflow: ellipsis;
      cursor: inherit;

      &.neo-required::after {
        margin-left: 0.1rem;
        color: var(--neo-label-required-color, var(--neo-color-error-75));
        font-size: var(--neo-label-font-size, var(--neo-font-size, inherit));
        content: '*';
      }

      &.neo-disabled {
        color: var(--neo-label-disabled-color, var(--neo-color-disabled));

        &::after {
          color: var(--neo-label-disabled-color, var(--neo-color-error-50));
        }
      }
    }
  }
</style>
